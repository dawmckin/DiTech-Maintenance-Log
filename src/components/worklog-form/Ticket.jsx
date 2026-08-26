import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import formatDateTime from "../../utils/format-date-time";
import formatDuration from "../../utils/format-duration";

import useSelectWorklogById from "../../api/useSelectWorklogById";
import useSelectAll from "../../api/useSelectAll";
import useInsertNote from "../../api/useInsertNote";
import useUpdateWorklog from "../../api/useUpdateWorklog";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import Modal from "../util/Modal";

import OpenIcon from "../../assets/open-icon.svg";
import CompetedIcon from "../../assets/completed-icon.svg";


export default function Ticket() {
    const authUser = useAuth().user;
    
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const [isToolingIssue, setIsToolingIssue] = useState("");
    const [notes, setNotes] = useState(null);
    const [transferRecipient, setTransferRecipient] = useState(null);

    const worklogData = useSelectWorklogById(id);
    const userData = useSelectAll('users', 0);

    const duration = (worklogData?.end_time) ? 
                        new Date(worklogData?.end_time) - new Date(worklogData?.start_time) : 
                        new Date() - new Date(worklogData?.start_time);

    const { insertNote, insertNoteStatus, insertNoteError } = useInsertNote();
    const { updateWorklog, updateWorklogStatus, updateWorklogError } = useUpdateWorklog();

    useEffect(() => {
        if(worklogData?.is_tooling_issue !== undefined) {
                setIsToolingIssue(worklogData.is_tooling_issue === true ? 'yes' : 'no');
        }
    }, [worklogData])

    const handleChange = (e) => {
        if(e.target.name === 'isToolingIssue') {
            setIsToolingIssue(e.target.value);
        } else if(e.target.name === 'notes') {
            setNotes(e.target.value);
        }
    };

    const initiateTransfer = (e) => {
        e.preventDefault();

        if(!notes) {
            showToast("Please enter a note before transferring your worklog.", "warning");
            return;
        } 

        setIsModalOpen(true);
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault();

        if(!notes) {
            showToast("Missing required fields.", "warning");
            return;
        }

        if(type === 'transfer' && !transferRecipient) {
            showToast('Missing transfer recipient.', 'warning');
            return;
        }
        
        try {
            const notesResult = await insertNote(notes, id);
            const worklogResult = (type === 'transfer') ? 
                                        await updateWorklog(id, isToolingIssue, transferRecipient, 'transfer') :
                                        await updateWorklog(id, isToolingIssue, worklogData?.created_by);

            if(notesResult.success && worklogResult) {
                (type === 'transfer') ? 
                    showToast("Maintenance Log Transferred.", "success") : 
                    showToast("Maintenance Log Submitted.", "success");
                    
                navigate(`/dashboard`);
            } else {
                (type === 'transfer') ? 
                    showToast("Error transferring log.", "error") : 
                    showToast("Error submitting log.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Unexpected error.", "error");
        }
    };

    const generateSelectOptions = () => {
        return userData.filter(user => user.user_id !== authUser.id).map(user => 
                <option value={user.user_id}>{user.first_name} {user.last_name}</option>
            );
    };

    const generateNotes = () => {
        return (
            <ul className="notes-list pl-0">
                {
                    worklogData?.notes?.map(note => (
                        <li>
                            <div className="row top-meta mb-0">
                                <div className="col-md-2">
                                    <strong>{`${note?.users?.first_name} ${note?.users?.last_name}`}</strong>
                                    <strong>{`[${formatDateTime(note.created_at)}]`}</strong>
                                </div>
                                <div className="col-md-10">
                                    <p className="mb-0">{note.note_text}</p>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }

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
                        (worklogData?.end_time) && 
                        (
                            <div>
                                <strong>End Time:</strong>
                                <span>{formatDateTime(worklogData?.end_time)}</span>
                            </div>
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
                <p><label>Workstation:</label> {worklogData?.workstation_id} - {worklogData?.workstations?.location_site.toUpperCase()}</p>
                <p><label>Equipment:</label>[ID: {worklogData?.equipment?.plex_equipment_id}] - {worklogData?.equipment?.equipment_name}</p>
                <p><label>Issue Description:</label> {worklogData?.issue_description}</p>
            </div>
            
            {
                (worklogData?.issue_status === 'completed') ? 
                (
                    <div>
                        <p><label>Tooling Issue:</label> {worklogData?.is_tooling_issue ? 'Yes' : 'No'}</p>
                        <p><label>Notes:</label></p>
                        {generateNotes()}
                    </div>

                ) : 
                (
                    <form>
                        <label className="mr-3">Tooling Issue: </label>
                        <div className="d-flex">

                            <label className="mr-3 mt-0">
                                <input 
                                    type="radio"
                                    checked={isToolingIssue === "yes"}
                                    name="isToolingIssue"
                                    value='yes'
                                    onChange={handleChange}
                                    className="mr-2"
                                /> 
                                Yes
                            </label>                        
                            <label className="mr-3 mt-0">
                                <input 
                                    type="radio"
                                    checked={isToolingIssue === "no"}
                                    name="isToolingIssue"
                                    value='no'
                                    onChange={handleChange}
                                    className="mr-2"
                                /> 
                                No
                            </label>
                        </div>

                        <label>Notes <span className="required-input">*</span></label>
                        {generateNotes()}
                        <textarea name="notes" onChange={handleChange} placeholder="Add any additional notes..."></textarea>
                    
                        <div className="actions">
                            {/* {
                                // (authUser?.user_metadata?.user_role === 'admin' && authUser?.user_metadata?.email === 'dmckinney@ditechinc.net') && 
                                (authUser?.user_metadata?.user_role === 'admin') && 
                                    (
                                        <button onClick={(e) => initiateTransfer(e)} className="primary transfer mr-2" type="button">Transfer</button>
                                    )
                            } */}
                            <button onClick={(e) => initiateTransfer(e)} className="primary transfer mr-md-2" type="button">Transfer</button>
                            <button onClick={(e) => handleSubmit(e, 'submit')} className="primary">Submit</button>
                        </div>
                    </form>
                )
            }

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                }} 
                title={`Transfer Worklog`}
            >
                <form onSubmit={(e) => handleSubmit(e, 'transfer')}>
                    <label className="mr-2">Recipient: <span className="required-input">*</span></label>
                    <select className="mr-2"
                            style={{height: '3em'}} 
                            value={transferRecipient} 
                            name="transferRecipient" 
                            onChange={(e) => setTransferRecipient(e.target.value)}
                    >
                        <option value="">--Select--</option>
                        {generateSelectOptions()}
                    </select>

                    <div className="actions">
                        <button type='submit' className="primary transfer">Transfer</button>
                    </div>
                </form>
            </Modal>
        </div>
    )

}