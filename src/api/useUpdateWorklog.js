import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useUpdateWorklog() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const updateWorklog = async (ticketId) => {
        setError(null);
        
        showLoader();

        const now = new Date();

        const {data, error} = await supabase
            .from('tickets')
            .update({
                end_time: now,
                issue_status: 'completed'
            })
            .eq('ticket_id', ticketId);

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

    return { updateWorklog, status, error };
}