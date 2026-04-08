import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectWorkstations() {
    const [workstations, setWorkstations] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const selectWorkstations = async () => {
            showLoader();

            const {data, error} = await supabase
                .from('workstations')
                .select('workstation_id, location_site')
                .order('workstation_id');

            if(error) {
                console.log(error);
            } else {
                // setTimeout(() => setWorkstations(data), 3000);
                setWorkstations(data);
            }

            hideLoader();
        };

        selectWorkstations();
    }, []);

    return workstations;
}