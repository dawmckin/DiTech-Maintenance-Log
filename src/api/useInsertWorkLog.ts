import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../context/LoaderContext";

import type { Worklog, WorklogInsert, WorklogRow, InsertResult } from "../types/worklog";

export default function useInsertWorklog() {
    const [status, setStatus] = useState<WorklogRow[] | null>(null);
    const [error, setError] = useState<any>(null);

    const { showLoader, hideLoader } = useLoader();

    const insertWorklog = async (worklog: WorklogInsert): Promise<InsertResult> => {
        setError(null);

        showLoader();

        const { data, error } = await supabase
            .from("tickets")
            .insert({
                workstation_id: worklog.workstationId,
                equipment_id: worklog.equipmentId,
                created_by: worklog.createdBy,
                issue_type: worklog.issueType,
                issue_description: worklog.issueDescription,
                issue_status: worklog.issueStatus,
                start_time: worklog.startTime
            })
            .select();

        if (error) {
            console.log(error);
            setError(error);

            hideLoader();

            return {'success': false, error};
        } 
            
        setStatus(data);

        hideLoader();
        
        return {success: true, data};
    };

    return { insertWorklog, status, error };
}