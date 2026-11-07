drop trigger if exists follows_create_notification on public.follows;
drop trigger if exists likes_create_notification on public.likes;
drop trigger if exists comments_create_notification on public.comments;
drop trigger if exists posts_mention_notification on public.posts;

drop function if exists public.notify_new_follow();
drop function if exists public.notify_new_like();
drop function if exists public.notify_new_comment();
drop function if exists public.notify_new_post_mentions();

alter table public.notifications enable row level security;

drop policy if exists "Users can insert notifications as themselves" on public.notifications;

create policy "Users can insert notifications as themselves"
  on public.notifications for insert
  to authenticated
  with check ((select auth.uid()) = actor_id);

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
