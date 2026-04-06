import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useSelectEquipment(wsId) {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        if(!wsId || wsId === "") {
            setEquipment([]);
            return;
        }
        const selectEquipment = async () => {
            const {data, error} = await supabase
                .from('equipment')
                .select('*')
                .eq('workstation_id', wsId)
                .order('equipment_id');

            if(error) {
                console.log(error);
            } else {
                setEquipment(data);
            }
        };

        selectEquipment();
    }, [wsId]);

    return equipment;
}