create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  avatar_url text,
  cover_url text,
  cover_url text,
  bio text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content text not null,
  media_urls text[] not null default '{}',
  author_id uuid not null references public.profiles(id) on delete cascade,
  visibility text not null default 'public',
  comments_enabled boolean not null default true
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sender uuid not null references public.profiles(id) on delete cascade,
  recipient uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  read boolean not null default false
);

create table if not exists public.post_interactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('like', 'repost')),
  unique (post_id, user_id, kind)
);

create index if not exists posts_author_id_created_at_idx
  on public.posts (author_id, created_at desc);
create index if not exists comments_post_id_created_at_idx
  on public.comments (post_id, created_at);
create index if not exists follows_following_id_idx
  on public.follows (following_id);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.messages enable row level security;
alter table public.post_interactions enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;
drop policy if exists "Posts are publicly readable" on public.posts;
drop policy if exists "Authenticated users can create posts" on public.posts;
drop policy if exists "Authors can update their posts" on public.posts;
drop policy if exists "Authors can delete their posts" on public.posts;
drop policy if exists "Likes are publicly readable" on public.likes;
drop policy if exists "Users can like as themselves" on public.likes;
drop policy if exists "Users can remove their own likes" on public.likes;
drop policy if exists "Comments are publicly readable" on public.comments;
drop policy if exists "Authenticated users can create comments" on public.comments;
drop policy if exists "Authors can update their comments" on public.comments;
drop policy if exists "Authors can delete their comments" on public.comments;
drop policy if exists "Follows are publicly readable" on public.follows;
drop policy if exists "Users can follow as themselves" on public.follows;
drop policy if exists "Users can unfollow as themselves" on public.follows;
drop policy if exists "Users can read their messages" on public.messages;
drop policy if exists "Users can send messages" on public.messages;
drop policy if exists "Recipients can mark messages read" on public.messages;
drop policy if exists "Interactions are publicly readable" on public.post_interactions;
drop policy if exists "Users can create interactions as themselves" on public.post_interactions;
drop policy if exists "Users can remove their own interactions" on public.post_interactions;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);
create policy "Users can create their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can delete their own profile"
  on public.profiles for delete using (auth.uid() = id);

create policy "Posts are publicly readable"
  on public.posts for select using (true);
create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = author_id);
create policy "Authors can update their posts"
  on public.posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Authors can delete their posts"
  on public.posts for delete using (auth.uid() = author_id);

create policy "Likes are publicly readable"
  on public.likes for select using (true);
create policy "Users can like as themselves"
  on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can remove their own likes"
  on public.likes for delete using (auth.uid() = user_id);

create policy "Comments are publicly readable"
  on public.comments for select using (true);
create policy "Authenticated users can create comments"
  on public.comments for insert with check (auth.uid() = author_id);
create policy "Authors can update their comments"
  on public.comments for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Authors can delete their comments"
  on public.comments for delete using (auth.uid() = author_id);

create policy "Follows are publicly readable"
  on public.follows for select using (true);
create policy "Users can follow as themselves"
  on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow as themselves"
  on public.follows for delete using (auth.uid() = follower_id);

create policy "Users can read their messages"
  on public.messages for select using (auth.uid() = sender or auth.uid() = recipient);
create policy "Users can send messages"
  on public.messages for insert with check (auth.uid() = sender);
create policy "Recipients can mark messages read"
  on public.messages for update using (auth.uid() = recipient) with check (auth.uid() = recipient);

create policy "Interactions are publicly readable"
  on public.post_interactions for select using (true);
create policy "Users can create interactions as themselves"
  on public.post_interactions for insert with check (auth.uid() = user_id);
create policy "Users can remove their own interactions"
  on public.post_interactions for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      'user-' || substr(replace(new.id::text, '-', ''), 1, 8)
    ),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload profile media" on storage.objects;
drop policy if exists "Users can update profile media" on storage.objects;
drop policy if exists "Users can delete profile media" on storage.objects;
drop policy if exists "Users can read profile media" on storage.objects;

create policy "Users can upload profile media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can update profile media"
on storage.objects for update to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can delete profile media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can read profile media"
on storage.objects for select to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
