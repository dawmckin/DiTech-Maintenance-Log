import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import formatDateTime from "../../utils/format-date-time";
import formatDuration from "../../utils/format-duration";

import useSelectWorklogById from "../../api/useSelectWorklogById";
import useInsertNote from "../../api/useInsertNote";
import useUpdateWorklog from "../../api/useUpdateWorklog";

import { useToast } from "../../context/ToastContext";

import OpenIcon from "../../assets/open-icon.svg";
import CompetedIcon from "../../assets/completed-icon.svg";


export default function Ticket() {
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { id } = useParams();
    const [notes, setNotes] = useState(null);

    const worklogData = useSelectWorklogById(id);

    const duration = (worklogData?.end_time) ? 
                        new Date(worklogData?.end_time) - new Date(worklogData?.start_time) : 
                        new Date() - new Date(worklogData?.start_time);

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
            <div className="row m-0">
                <div className="top-meta col-9 p-0">
                    <div className="d-flex">
                        <strong>Status:</strong>
                        <div className="status-tooltip align-items-start ml-2">
                            {worklogData?.issue_status === 'open'
                                ? <img src={OpenIcon} className="pulse-icon" alt="Open" />
                                : <img src={CompetedIcon} alt="Completed" />
                            }
                            <span className="status-tooltip-text">{worklogData?.issue_status.toUpperCase()}</span>
                        </div>
                    </div>
                    <div>
                        <strong>Issue Type:</strong>
                        <span>{worklogData?.issue_type}</span>
                    </div>
                    <div>
                        <strong>Start Time:</strong>
                        <span>{formatDateTime(worklogData?.start_time)}</span>
                    </div>
                    {
                        (worklogData?.end_time) ? 
                        (
                            <div>
                                <strong>End Time:</strong>
                                <span>{formatDateTime(worklogData?.end_time)}</span>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                    <div>
                        <strong>Downtime:</strong>
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>
                <div className="col-3 p-0 d-flex justify-content-end">
                    <Link to="/dashboard">
                        <button className="primary log-action cancel">{worklogData?.issue_status === 'completed' ? 'Close' : 'Cancel'}</button>
                    </Link>    
                </div>  
            </div>


            <hr/>

            <div className="readonly">
                <p><label>Workstation #:</label> {worklogData?.workstation_id} - {worklogData?.workstations?.location_site.toUpperCase()}</p>
                <p><label>Equipment:</label>[ID: {worklogData?.equipment?.plex_equipment_id}] - {worklogData?.equipment?.equipment_name}</p>
                <p><label>Issue Description:</label> {worklogData?.issue_description}</p>
            </div>
            
            {
                (worklogData?.issue_status === 'completed') ? 
                (
                    <p><label>Notes:</label> {worklogData?.notes[0]?.note_text}</p>

                ) : 
                (
                    <form onSubmit={handleSubmit}>
                        <label>Notes <span className="required-input">*</span></label>
                        <textarea name="notes" onChange={handleChange} placeholder="Add any additional notes..."></textarea>
                    
                        <div className="actions">
                            <button className="primary">Submit</button>
                        </div>
                    </form>
                )
            }
        </div>
    )

}