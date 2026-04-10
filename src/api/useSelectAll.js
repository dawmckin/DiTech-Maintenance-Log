import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

export default function useSelectAll(view, refresh) {
    const [rowData, setRowData] = useState([]);

    const { showLoader, hideLoader} = useLoader();

    const tableSelects = {
        users: 'ditech_id, first_name, last_name, user_role, created_at',
        workstations: 'workstation_id, location_site, created_at',
        equipment: 'equipment_id, equipment_name, workstation_id, created_at'
    }

    useEffect(() => {
        const selectAll = async () => {
            showLoader();

            const {data, error} = await supabase
                .from(view)
                .select(tableSelects[view])

            if(error) {
                console.log(error);
            } else {
                console.log(data);
                setRowData(data);
            }

            hideLoader();
        }

        selectAll();
    }, [view, refresh])

    return rowData;
}