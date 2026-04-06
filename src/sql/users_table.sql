create table users (
    emp_id uuid primary key default gen_random_uuid(),
    first_name text not null,
    last_name text not null,
    user_role enum('admin', 'maintenance') not null,
    ditech_id text not null,
    created_at timestamp default now()
)