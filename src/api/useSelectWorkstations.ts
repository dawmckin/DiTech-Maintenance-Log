import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { Workstation } from "../types/workstation"; 

type WorkstationOption = Pick<Workstation, 'workstation_id' | 'location_site'>;

export default function useSelectWorkstations(): WorkstationOption[] {
    const [workstations, setWorkstations] = useState<WorkstationOption[]>([]);

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
                setWorkstations(data as WorkstationOption[]);
            }

            hideLoader();
        };

        selectWorkstations();
    }, []);

    return workstations;
}