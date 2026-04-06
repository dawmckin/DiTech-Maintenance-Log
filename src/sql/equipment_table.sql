create table equipment (
    equipment_id int primary key,
    equipment_name text not null,
    created_at timestamp default now(),
    constraint fk_workstation_id 
        foreign key (workstation_id) 
        references workstations(workstation_id)
)