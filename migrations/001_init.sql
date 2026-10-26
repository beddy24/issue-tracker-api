create table users(
  id serial primary key,
  email text unique not null,
  password_hash text not null,
  role text not null default 'USER' check (role in ('USER','ADMIN')),
  created_at timestamptz not null default now()
);

create table issues(
  id serial primary key,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  author_id int not null references users(id),
  assignee_id int references users(id),
  created_at timestamptz not null default now()
);

create index on issues(status);
create index on issues(assignee_id);