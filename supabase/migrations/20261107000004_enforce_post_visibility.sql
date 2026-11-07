alter table public.posts
  drop constraint if exists posts_visibility_check;

alter table public.posts
  add constraint posts_visibility_check
  check (visibility in ('public', 'followers', 'mutuals', 'only_me'));

drop policy if exists "Posts are publicly readable" on public.posts;
drop policy if exists "Posts are readable by audience" on public.posts;

create policy "Posts are readable by audience"
  on public.posts for select
  to authenticated
  using (
    visibility = 'public'
    or author_id = (select auth.uid())
    or (
      visibility in ('followers', 'mutuals')
      and exists (
        select 1
        from public.follows
        where follower_id = (select auth.uid())
          and following_id = posts.author_id
      )
    )
    or (
      visibility = 'mutuals'
      and exists (
        select 1
        from public.follows
        where follower_id = posts.author_id
          and following_id = (select auth.uid())
      )
    )
  );
