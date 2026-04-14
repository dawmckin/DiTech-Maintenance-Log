import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useInsertEquipment() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const insertEquipment = async (equipmentData) => {
        setError(null);

        showLoader();

        const {data, error} = await supabase
            .from('equipment')
            .insert(equipmentData)

            if(error) {
                console.log(error);
                setError(error);

                hideLoader();

                return {'success': false, error};
            }

            setStatus(data);

            hideLoader();

            return {success: true, data};
    }

    return { insertEquipment, status, error };
}