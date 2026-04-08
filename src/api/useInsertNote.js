import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useInsertNote() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const insertNote = async (text, ticketId) => {
        setError(null);

        showLoader();

        const {data, error} = await supabase
            .from('notes')
            .insert({
                ticket_id: ticketId,
                note_text: text,
                created_by: 1
            });

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

    return { insertNote, status, error };
}