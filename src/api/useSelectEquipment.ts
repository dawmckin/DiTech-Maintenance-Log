import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { Equipment } from "../types/equipment";

export default function useSelectEquipment(wsId: number | null): Equipment[] {
    const [equipment, setEquipment] = useState<Equipment[]>([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if(!wsId) {
            setEquipment([]);
            return;
        }

        showLoader();

        const selectEquipment = async () => {
            const {data, error} = await supabase
                .from('equipment')
                .select('*')
                .eq('workstation_id', wsId)
                .order('plex_equipment_id');

            if(error) {
                console.log(error);
            } else {
                // setTimeout(() => setEquipment(data),3000);
                setEquipment(data as Equipment[]);
            }

            hideLoader();
        };

        selectEquipment();
    }, [wsId]);

    return equipment;
}