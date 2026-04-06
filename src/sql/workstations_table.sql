create table workstations (
    workstation_id int primary key,
    location_site text not null,
    created_at timestamp default now()
)