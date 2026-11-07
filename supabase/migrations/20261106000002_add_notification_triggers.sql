create or replace function public.notify_new_follow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, actor_id, type)
  values (new.following_id, new.follower_id, 'follow');

  return new;
end;
$$;

create or replace function public.notify_new_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
begin
  select author_id
    into post_author_id
    from public.posts
   where id = new.post_id;

  if post_author_id is not null and post_author_id <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (post_author_id, new.user_id, 'like', new.post_id);
  end if;

  return new;
end;
$$;

create or replace function public.notify_new_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
begin
  select author_id
    into post_author_id
    from public.posts
   where id = new.post_id;

  if post_author_id is not null then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (post_author_id, new.author_id, 'comment', new.post_id);
  end if;

  insert into public.notifications (user_id, actor_id, type, post_id)
  select distinct
    mentioned_profile.id,
    new.author_id,
    'mention',
    new.post_id
  from regexp_matches(new.content, '@([A-Za-z0-9_]+)', 'g') as mention(username)
  join public.profiles as mentioned_profile
    on lower(mentioned_profile.username) = lower(mention.username)
  where mentioned_profile.id <> new.author_id;

  return new;
end;
$$;

create or replace function public.notify_new_post_mentions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, actor_id, type, post_id)
  select distinct
    mentioned_profile.id,
    new.author_id,
    'mention',
    new.id
  from regexp_matches(new.content, '@([A-Za-z0-9_]+)', 'g') as mention(username)
  join public.profiles as mentioned_profile
    on lower(mentioned_profile.username) = lower(mention.username)
  where mentioned_profile.id <> new.author_id;

  return new;
end;
$$;

drop trigger if exists follows_create_notification on public.follows;
create trigger follows_create_notification
after insert on public.follows
for each row execute function public.notify_new_follow();

drop trigger if exists likes_create_notification on public.likes;
create trigger likes_create_notification
after insert on public.likes
for each row execute function public.notify_new_like();

drop trigger if exists comments_create_notification on public.comments;
create trigger comments_create_notification
after insert on public.comments
for each row execute function public.notify_new_comment();

drop trigger if exists posts_mention_notification on public.posts;
create trigger posts_mention_notification
after insert on public.posts
for each row execute function public.notify_new_post_mentions();

revoke execute on function public.notify_new_follow() from public, anon, authenticated;
revoke execute on function public.notify_new_like() from public, anon, authenticated;
revoke execute on function public.notify_new_comment() from public, anon, authenticated;
revoke execute on function public.notify_new_post_mentions() from public, anon, authenticated;

alter table public.notifications enable row level security;

drop policy if exists "Users can read their notifications" on public.notifications;
drop policy if exists "Users can mark their notifications as read" on public.notifications;

create policy "Users can read their notifications"
  on public.notifications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can mark their notifications as read"
  on public.notifications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
