export interface Equipment {
    equipment_id: number;
    equipment_name: string;
    workstation_id: number;
    workstations?: {
        location_site: string;
    }
    created_at: string;
}

export interface InsertResult {
    success: boolean;
    data?: Equipment;
    error?: unknown;
}