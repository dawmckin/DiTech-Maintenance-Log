import { supabase } from "../lib/supabaseClient";
import type { Worklog } from "../types/worklog";

export type WorklogFilters = {
    startDate?: string;
    endDate?: string;
    main?: boolean;
    walnut?: boolean
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
            workstations!inner(
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

    if(filters.main && !filters.walnut) {
        query = query.eq('workstations.location_site', 'main');
    }

    if(filters.walnut && !filters.main) {
        query = query.eq('workstations.location_site', 'walnut');
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