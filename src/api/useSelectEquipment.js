import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectEquipment(wsId) {
    const [equipment, setEquipment] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if(!wsId || wsId === "") {
            setEquipment([]);
            return;
        }

        showLoader();

        const selectEquipment = async () => {
            const {data, error} = await supabase
                .from('equipment')
                .select('*')
                .eq('workstation_id', wsId)
                .order('equipment_id');

            if(error) {
                console.log(error);
            } else {
                // setTimeout(() => setEquipment(data),3000);
                setEquipment(data);
            }

            hideLoader();
        };

        selectEquipment();
    }, [wsId]);

    return equipment;
}