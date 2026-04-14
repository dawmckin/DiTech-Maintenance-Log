import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { Equipment, InsertResult } from "../types/equipment";

type InsertEquipmentPayload = Omit<Equipment, 'equipment_id' | 'created_at'>;

export default function useInsertEquipment() {
    const [status, setStatus] = useState<Equipment | null>(null);
    const [insertError, setInsertError] = useState<unknown>(null);

    const { showLoader, hideLoader } = useLoader();

    const insertEquipment = async (equipmentData: InsertEquipmentPayload): Promise<InsertResult> => {
        setInsertError(null);

        showLoader();

        const {data, error} = await supabase
            .from('equipment')
            .insert(equipmentData)

            if(error) {
                console.log(error);
                setInsertError(error);

                hideLoader();

                return {'success': false, error};
            }

            setStatus(data as unknown as Equipment);

            hideLoader();

            return {success: true, data: data as unknown as Equipment};
    }

    return { insertEquipment, status, insertError };
}