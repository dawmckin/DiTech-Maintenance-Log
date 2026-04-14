import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useInsertWorkstation() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const insertWorkstation = async (workstationData) => {
        setError(null);

        showLoader();

        const {data, error} = await supabase
            .from('workstations')
            .insert(workstationData)

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

    return { insertWorkstation, status, error };
}