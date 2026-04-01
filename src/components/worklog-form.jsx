import { useState } from "react";
import { Link } from "react-router-dom";
import Toast from "./toast";

export default function WorklogForm() {
    const [prelimFormState, setPrelimFormState] = useState(1);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({message, type});
    };
    const handleCloseToast = () => setToast(null);

    const [worklogFormData, setWorklogFormData] = useState({
        "workstation": "",
        "equipment": "",
        "issueType": "",
        "issueDescription": "",
        "notes": ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWorklogFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInitialize = (e) => {
        e.preventDefault();

        if(!worklogFormData.workstation ||
            !worklogFormData.equipment ||
            !worklogFormData.issueType || 
            !worklogFormData.issueDescription
        ) {
            showToast("Missing required fields.", "warning");
        } else {
            console.log(worklogFormData);
            showToast("Maintenance Log Initialized.", "success");
            setPrelimFormState(2);

            // later: send to backend
            // fetch('/api/tickets', { method: 'POST', body: JSON.stringify(formData) })
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!worklogFormData.notes) {
            showToast("Missing required fields.", "warning");
        } else {
            console.log(worklogFormData);
            showToast("Maintenance Log Submitted.", "success");
            setPrelimFormState(3);

            // later: send to backend
            // fetch('/api/tickets', { method: 'POST', body: JSON.stringify(formData) })
        }
    };

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
            {prelimFormState === 1 ? (
                /* PRELIM LOG SCREEN */
                <div className="card">
                    <div className="d-flex justify-content-between">
                        <h2>New Maintenance Report</h2>
                        <Link to="/dashboard">
                            <button className="primary log-action cancel">Cancel</button>
                        </Link>
                    </div>

                    <hr/>

                    <form onSubmit={handleInitialize}>
                        <label>Workstation <span className="required-input">*</span></label>
                        <select name="workstation" onChange={handleChange} defaultValue="--Select--">
                            <option value="">--Select--</option>
                            <option>4150</option>
                            <option>4270</option>
                            <option>5610</option>
                        </select>
                        
                        <label>Equipment <span className="required-input">*</span></label>
                        <select name="equipment" onChange={handleChange} defaultValue="--Select--">
                            <option value="">--Select--</option>
                            <option>Crimper</option>
                            <option>Roller</option>
                            <option>Welder</option>

                        </select>

                        <label>Issue Type <span className="required-input">*</span></label>
                        <select name="issueType" onChange={handleChange} defaultValue="--Select--">
                            <option value="">--Select--</option>
                            <option>Setup</option>
                            <option>Maintenance</option>
                            <option>Problem</option>
                        </select>

                        <label>Issue Description <span className="required-input">*</span></label>
                        <textarea name="issueDescription" onChange={handleChange} placeholder="Describe the issue..."></textarea>

                        <div className="actions">
                            <button className="primary">Initiate</button>
                        </div>
                    </form>
                </div>
            ) : (
                /* READ-ONLY LOG SCREEN */
                <div className="card">
                    <div className="top-meta">
                        <div>
                        <strong>Start Time:</strong>
                        <span>02/24/2024, 10:15 AM</span>
                        </div>
                        <div>
                        <strong>Issue Type:</strong>
                        <span>{worklogFormData.issueType}</span>
                        </div>
                    </div>

                    <hr/>

                    <div className="readonly">
                        <p><label>Workstation #:</label> {worklogFormData.workstation}</p>
                        <p><label>Equipment:</label> {worklogFormData.equipment}</p>
                        <p><label>Issue Description:</label> {worklogFormData.issueDescription}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>Notes <span className="required-input">*</span></label>
                        <textarea name="notes" onChange={handleChange} placeholder="Add any additional notes..."></textarea>
                    
                        <div className="actions">
                            {/* <Link to="/dashboard"> */}
                                <button className="primary">Submit</button>
                            {/* </Link> */}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}