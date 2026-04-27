import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useDeleteEquipment() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const deleteEquipment = async (equipmentData) => {
        setError(null);
        
        showLoader();

        const {data, error} = await supabase
            .from('equipment')
            .delete()
            .eq('ditech_equipment_id', equipmentData.ditech_equipment_id);

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

    return { deleteEquipment, status, error };
}