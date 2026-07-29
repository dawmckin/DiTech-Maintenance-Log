import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useDeleteEmailRecipient() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const deleteEmailRecipient = async (emailRecipientData) => {
        setError(null);
        
        showLoader();

        const {data, error} = await supabase
            .from('report_subscriptions')
            .delete()
            .eq('recipient_id', emailRecipientData.recipient_id);

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

    return { deleteEmailRecipient, status, error };
}