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
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'user_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'preferred_username'), ''),
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
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'display_name', '')
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
