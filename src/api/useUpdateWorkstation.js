import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useUpdateWorkstation() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const updateWorkstation = async (workstationData) => {
        setError(null);
        
        showLoader();

        const {data, error} = await supabase
            .from('workstations')
            .update(workstationData)
            .eq('workstation_id', workstationData.workstation_id);

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

    return { updateWorkstation, status, error };
}