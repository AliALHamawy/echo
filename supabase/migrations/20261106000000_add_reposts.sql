create table if not exists public.reposts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create index if not exists reposts_post_id_created_at_idx
  on public.reposts (post_id, created_at desc);

create index if not exists reposts_user_id_created_at_idx
  on public.reposts (user_id, created_at desc);

alter table public.reposts enable row level security;

drop policy if exists "Reposts are publicly readable" on public.reposts;
drop policy if exists "Users can create their own reposts" on public.reposts;
drop policy if exists "Users can remove their own reposts" on public.reposts;

create policy "Reposts are publicly readable"
  on public.reposts for select using (true);

create policy "Users can create their own reposts"
  on public.reposts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own reposts"
  on public.reposts for delete
  to authenticated
  using ((select auth.uid()) = user_id);
