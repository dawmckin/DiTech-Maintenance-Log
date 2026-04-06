import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useInsertNote() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const insertNote = async (text, ticketId) => {
        setError(null);

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
            return {'success': false, error};
        } 
            
        setStatus(data);
        return {'success': true, data};
    }

    return { insertNote, status, error };
}