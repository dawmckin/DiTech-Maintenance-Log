create table notes (
    note_id uuid primary key default gen_random_uuid(),
    note_text text,
    created_at timestamp default now(),
    constraint fk_created_by 
        foreign key (created_by) 
        references users(emp_id),
    constraint fk_ticket_id 
        foreign key (ticket_id) 
        references tickets(ticket_id)
)