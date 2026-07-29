import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { EmailRecipient, InsertResult } from "../types/email-recipient";

type InsertEmailRecipientPayload = Omit<EmailRecipient, 'created_at'>;

export default function useInsertEmailRecipient() {
    const [status, setStatus] = useState<EmailRecipient | null>(null);
    const [insertError, setInsertError] = useState<unknown>(null);

    const { showLoader, hideLoader } = useLoader();

    const insertEmailRecipient = async (emailRecipientData: InsertEmailRecipientPayload): Promise<InsertResult> => {
        setInsertError(null);

        showLoader();

        const {data, error} = await supabase
            .from('report_subscriptions')
            .insert(emailRecipientData)

            if(error) {
                console.log(error);
                setInsertError(error);

                hideLoader();

                return {'success': false, error};
            }

            setStatus(data as unknown as EmailRecipient);

            hideLoader();

            return {success: true, data: data as unknown as EmailRecipient};
    }

    return { insertEmailRecipient, status, insertError };
}