import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectWorklogs() {
    const [worklogs, setWorklogs] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const selectWorklogs = async () => {
            showLoader();

            const {data, error} = await supabase
                .from('tickets')
                .select(`*,
                        users(
                            first_name,
                            last_name
                        ),
                        workstations (
                            location_site
                        ),
                        equipment (
                            equipment_name
                        ),
                        notes (
                            note_text,
                            users (
                                ditech_id
                            )
                        )
                        `)
                .order('start_time');

            if(error) {
                console.log(error);
            } else {
                setWorklogs(data);
            }

            hideLoader();
        };

        selectWorklogs();
    }, []);

    return worklogs;
}