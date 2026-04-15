import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";


import type { Workstation, WorkstationInsert, InsertResult } from "../types/workstation";

export default function useInsertWorkstation() {
    const [status, setStatus] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const { showLoader, hideLoader } = useLoader();

    const insertWorkstation = async (workstationData: WorkstationInsert): Promise<InsertResult> => {
        setError(null);

        showLoader();

        const {data, error} = await supabase
            .from('workstations')
            .insert(workstationData)
            .select()

            if(error) {
                console.log(error);
                setError(error);

                hideLoader();

                return {'success': false, error};
            }

            setStatus(data as unknown as Workstation);

            hideLoader();

            return {success: true, data: data as unknown as Workstation};
    }

    return { insertWorkstation, status, error };
}