export interface Workstation {
    workstation_id: number;
    location_site: string;
    created_at: string;
}

export interface WorkstationInsert {
    workstation_id: number;
    location_site: string;
}

export interface InsertResult {
    success: boolean;
    data?: Workstation;
    error?: unknown;
}