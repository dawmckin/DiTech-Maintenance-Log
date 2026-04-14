export type IssueStatus = 'open' | 'completed';
export type IssueType = 'setup' | 'maintenance' | 'problem';

export interface Worklog {
    ticket_id: number;
    workstation_id: number;
    workstations?: {
        location_site: string;
    }
    equipment_id: number;
    equipment?: {
        equipment_name: string;
    }
    issue_type: IssueType;
    issue_description: string;
    issue_status: IssueStatus;
    start_time: Date;
    end_time: Date;
    users?: {
        first_name: string;
        last_name: string;
    }
    notes?: {
        note_text: string;
        users?: {
            ditech_id: string;
        }
    }
}

export interface WorklogSummary {
    ticket_id: number;
    issue_status: IssueStatus;
    workstation_id: number;
    equipment_id: number;
    workstations?: {
        location_site: string;
    }
    equipment?: {
        equipment_name: string;
    }
}