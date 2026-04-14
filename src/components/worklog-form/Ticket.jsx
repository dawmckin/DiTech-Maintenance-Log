import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import formatDateTime from "../../utils/format-date-time";

import useSelectWorklogById from "../../api/useSelectWorklogById";
import useInsertNote from "../../api/useInsertNote";
import useUpdateWorklog from "../../api/useUpdateWorklog";

import { useToast } from "../../context/ToastContext";


export default function Ticket() {
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { id } = useParams();
    const [notes, setNotes] = useState(null);

    const worklogData = useSelectWorklogById(id);

    const { insertNote, insertNoteStatus, insertNoteError } = useInsertNote();
    const { updateWorklog, updateWorklogStatus, updateWorklogError } = useUpdateWorklog();

    const handleChange = (e) => {
        setNotes(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!notes) {
            showToast("Missing required fields.", "warning");
            return;
        } 
        
        try {
            const notesResult = await insertNote(notes, id);
            const worklogResult = await updateWorklog(id);

            if(notesResult.success && worklogResult) {
                showToast("Maintenance Log Submitted.", "success");

                navigate(`/dashboard`);
            } else {
                showToast("Error submitting log.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Unexpected error.", "error");
        }
    };

    return (
        <div className="card">
            <div className="top-meta">
                <div>
                    <strong>Start Time:</strong>
                    <span>{formatDateTime((worklogData?.start_time))}</span>
                </div>
                <div>
                    <strong>Issue Type:</strong>
                    <span>{worklogData?.issue_type}</span>
                </div>
            </div>

            <hr/>

            <div className="readonly">
                <p><label>Workstation #:</label> {worklogData?.workstation_id} - {worklogData?.workstations?.location_site.toUpperCase()}</p>
                <p><label>Equipment:</label>[ID: {worklogData?.equipment_id}] - {worklogData?.equipment?.equipment_name}</p>
                <p><label>Issue Description:</label> {worklogData?.issue_description}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <label>Notes <span className="required-input">*</span></label>
                <textarea name="notes" onChange={handleChange} placeholder="Add any additional notes..."></textarea>
            
                <div className="actions">
                    <button className="primary">Submit</button>
                </div>
            </form>
        </div>
    )

}