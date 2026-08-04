import { useState, useEffect } from "react";
import type { Worklog } from "../types/worklog"; 
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectWorklogs(refreshKey: number = 0): Worklog[] {
    const [worklogs, setWorklogs] = useState<Worklog[]>([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const selectWorklogs = async () => {
            showLoader();

            const {data, error} = await supabase
                .from('tickets')
                .select(`*,
                        created_by:users!tickets_created_by_fkey (
                            first_name,
                            last_name
                        ),
                        owner:users!tickets_owner_fkey (
                            first_name,
                            last_name
                        ),
                        workstations (
                            location_site
                        ),
                        equipment (
                            plex_equipment_id,
                            equipment_name
                        ),
                        notes (
                            note_text,
                            created_at,
                            users (
                                first_name,
                                last_name
                            )
                        )
                        `)
                .order('start_time');

            if(error) {
                console.log(error);
            } else {
                setWorklogs(data as Worklog[]);
            }

            hideLoader();
        };

        selectWorklogs();
    }, [refreshKey]);

    return worklogs;
}