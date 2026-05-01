export interface Equipment {
    equipment_id: number;
    plex_equipment_id: string;
    asset_number: string;
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