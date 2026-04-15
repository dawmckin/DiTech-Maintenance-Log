import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useInsertUser() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const insertUser = async (user_id, ditech_id, first_name, last_name, user_role, email) => {
        setError(null);

        showLoader();

        const {data, error} = await supabase
            .from('users')
            .insert({
                user_id,
                ditech_id,
                first_name,
                last_name,
                user_role,
                email
            })

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

    return { insertUser, status, error };
}