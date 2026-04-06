import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useSelectWorklogById(ticketId) {
    const [ logData, setLogData ] = useState(null);

    useEffect(() => {
        const selectWorklogById = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select(`workstation_id,
                        workstations (
                            location_site
                        ),
                        equipment_id,
                        equipment (
                            equipment_name
                        ),
                        issue_type,
                        issue_description,
                        issue_status,
                        start_time
                    `)
                .eq('ticket_id', ticketId)
                .single()

            if(error) {
                console.log(error);
            } else {
                setLogData(data);
            }
        }

        selectWorklogById();
    }, [ticketId]);

    return logData;
}