import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useUpdateEquipment() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const updateEquipment = async (equipmentData) => {
        setError(null);
        
        showLoader();

        const {data, error} = await supabase
            .from('equipment')
            .update(equipmentData)
            .eq('plex_equipment_id', equipmentData.plex_equipment_id);

        if (error) {
            console.log(error);
            setError(error);

            hideLoader();

            return {'success': false, error};
        } 
        
        setStatus(data);

        hideLoader();
        
        return {'success': true, data};
    }

    return { updateEquipment, status, error };
}