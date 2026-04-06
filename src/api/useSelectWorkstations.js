import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useSelectWorkstations() {
    const [workstations, setWorkstations] = useState([]);

    useEffect(() => {
        const selectWorkstations = async () => {
            const {data, error} = await supabase
                .from('workstations')
                .select('workstation_id, location_site')
                .order('workstation_id');

            if(error) {
                console.log(error);
            } else {
                setWorkstations(data);
            }
        };

        selectWorkstations();
    }, []);

    return workstations;
}