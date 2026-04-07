import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useUpdateWorklog() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const updateWorklog = async (ticketId) => {
        setError(null);

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
            return {'success': false, error};
        } 
        
        setStatus(data);
        return {'success': true, data};
    }

    return { updateWorklog, status, error };
}