do $$
declare
  profile_record record;
  base_username text;
  candidate_username text;
  suffix_number integer;
begin
  for profile_record in
    select id, username
    from public.profiles
    where username like '%-%'
    order by created_at, id
  loop
    base_username := lower(
      regexp_replace(
        regexp_replace(profile_record.username, '[[:space:]-]+', '_', 'g'),
        '[^a-z0-9_]',
        '',
        'gi'
      )
    );
    base_username := trim(both '_' from regexp_replace(base_username, '_+', '_', 'g'));

    if base_username = '' then
      base_username := 'user_' || substr(replace(profile_record.id::text, '-', ''), 1, 8);
    end if;

    candidate_username := base_username;
    suffix_number := 0;

    while exists (
      select 1
      from public.profiles
      where username = candidate_username
        and id <> profile_record.id
    ) loop
      suffix_number := suffix_number + 1;
      candidate_username := base_username || '_' || suffix_number::text;
    end loop;

    update public.profiles
    set username = candidate_username
    where id = profile_record.id;
  end loop;
end
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  source_name text;
  base_username text;
  candidate_username text;
  random_suffix text;
begin
  source_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'username'), '')
  );

  base_username := lower(
    regexp_replace(
      regexp_replace(coalesce(source_name, ''), '[[:space:]-]+', '_', 'g'),
      '[^a-z0-9_]',
      '',
      'gi'
    )
  );
  base_username := trim(both '_' from regexp_replace(base_username, '_+', '_', 'g'));

  if base_username = '' then
    base_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  perform pg_advisory_xact_lock(hashtext(base_username));
  candidate_username := base_username;

  if exists (select 1 from public.profiles where username = candidate_username) then
    loop
      random_suffix := substr(encode(gen_random_bytes(4), 'hex'), 1, 6);
      candidate_username := base_username || '_' || random_suffix;
      exit when not exists (
        select 1 from public.profiles where username = candidate_username
      );
    end loop;
  end if;

  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    candidate_username,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
