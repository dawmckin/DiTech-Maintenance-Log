import { supabase } from "../lib/supabaseClient";
import type { Worklog } from "../types/worklog";

export type WorklogFilters = {
    startDate?: string;
    endDate?: string;
}

export async function useSelectFilteredWorklogs(filters: WorklogFilters): Promise<Worklog[]> {
    let query = supabase
        .from('tickets')
        .select(`
            *,
            users(
                first_name,
                last_name
            ),
            workstations(
                location_site
            ),
            equipment(
                plex_equipment_id,
                equipment_name
            ),
            notes(
                note_text,
                users(
                    ditech_id
                )
            )
        `);
    
    if(filters.startDate) {
        query = query.gte(
            'start_time',
            filters.startDate
        );
    }    
    
    if(filters.endDate) {
        query = query.lte(
            'start_time',
            filters.endDate
        );
    }

    const {data, error} = await query.order(
        'start_time',
        {ascending: true}
    )

    if(error) {
        console.log(error);
        return [];
    }

    return data as Worklog[];
}