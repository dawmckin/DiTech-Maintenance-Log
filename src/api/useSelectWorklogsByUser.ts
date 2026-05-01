import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { WorklogSummary } from "../types/worklog";

export default function useSelectWorklogsByUser(userId: string): WorklogSummary[] {
    const [worklogs, setWorklogs] = useState<WorklogSummary[]>([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const selectWorklogsByUser = async () => {
            showLoader();

            const {data, error} = await supabase
                .from('tickets')
                .select(`ticket_id,
                        issue_status,
                        workstation_id,
                        equipment_id,
                        workstations (
                            location_site
                        ),
                        equipment (
                            plex_equipment_id,
                            equipment_name
                        )
                        `)
                .eq('created_by', userId)
                .order('issue_status', {ascending: false});

            if(error) {
                console.log(error);
            } else {
                setWorklogs(data as unknown as WorklogSummary[]);
            }

            hideLoader();
        }

        selectWorklogsByUser();
    }, []);

    return worklogs;
}