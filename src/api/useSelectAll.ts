import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { User } from "../types/user";
import type { Workstation } from "../types/workstation";
import type { Equipment } from "../types/equipment";

const TABLE_SELECTS = {
    users: 'user_id, ditech_id, last_name, first_name, email, user_role, created_at',
    workstations: 'workstation_id, location_site, created_at',
    equipment: 'plex_equipment_id, asset_number, equipment_name, workstation_id, created_at'
} as const;

const TABLE_ORDERS = {
    users: 'last_name',
    workstations: 'workstation_id',
    equipment: 'plex_equipment_id'
} as const;

export type SelectableView = keyof typeof TABLE_SELECTS;

interface ViewRowMap {
    users: User;
    workstations: Workstation;
    equipment: Equipment;
}

export default function useSelectAll<V extends SelectableView>(view: V, refresh: boolean): ViewRowMap[V][] {
    const [rowData, setRowData] = useState<ViewRowMap[V][]>([]);

    const { showLoader, hideLoader} = useLoader();

    useEffect(() => {
        const selectAll = async () => {
            showLoader();

            const {data, error} = await supabase
                .from(view)
                .select(TABLE_SELECTS[view])
                .order(TABLE_ORDERS[view])

            if(error) {
                console.log(error);
            } else {
                // console.log(data);
                setRowData(data as ViewRowMap[V][]);
            }

            hideLoader();
        }

        selectAll();
    }, [view, refresh])

    return rowData;
}