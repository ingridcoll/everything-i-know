-- Raw PostgreSQL schema
create table pokemon(
id serial primary key,
name varchar(100) not null,
type varchar(20)[] not null,
height numeric(5, 1),
evolves boolean,
created_at timestamp default current_timestamp
)