import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectWorklogsByUser(userId) {
    const [worklogs, setWorklogs] = useState([]);

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
                            equipment_name
                        )
                        `)
                .eq('created_by', userId)
                .order('issue_status', {ascending: false});

            if(error) {
                console.log(error);
            } else {
                console.log(data);
                setWorklogs(data);
            }

            hideLoader();
        }

        selectWorklogsByUser();
    }, []);

    return worklogs;
}