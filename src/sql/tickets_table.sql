create table tickets (
    ticket_id uuid primary key default gen_random_uuid(),
    issue_type enum('Maintenance', 'Problem', 'Setup') not null,
    issue_description text not null,
    issue_status enum('completed', 'open') not null,
    start_time timestamp not null,
    end_time timestamp
    constraint fk_workstation_id 
        foreign key (workstation_id) 
        references workstations(workstation_id),
    constraint fk_equipment_id 
        foreign key (equipment_id) 
        references equipment(equipment_id),
    constraint fk_created_by 
        foreign key (created_by) 
        references users(emp_id)
)