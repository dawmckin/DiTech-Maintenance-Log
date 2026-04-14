import { useState, useEffect } from "react";
import type { Worklog } from "../types/worklog";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectWorklogById(ticketId: number): Worklog | undefined {
    const [ logData, setLogData ] = useState<Worklog | undefined>(undefined);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        showLoader();

        const selectWorklogById = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select(`*,
                        workstations (
                            location_site
                        ),
                        equipment (
                            equipment_name
                        )
                    `)
                .eq('ticket_id', ticketId)
                .single()

            if(error) {
                console.log(error);
            } else {
                setLogData(data as Worklog);
            }

            hideLoader();
        }

        selectWorklogById();
    }, [ticketId]);

    return logData;
}