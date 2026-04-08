import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useSelectWorkstations from "../../api/useSelectWorkstations";
import useSelectEquipment from "../../api/useSelectEquipment";
import useInsertWorklog from "../../api/useInsertWorkLog";

import { useToast } from "../../context/ToastContext";

export default function WorklogForm() {
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { insertWorklog, status, error } = useInsertWorklog();

    const [worklogFormData, setWorklogFormData] = useState({
        "workstationId": "",
        "equipmentId": null,
        "equipmentName": "",
        "issueType": "",
        "issueDescription": "",
        "startTime": null,
        "createdBy": 1,
        "issueStatus": "open",
        "notes": ""
    });

    const workstationOptions = useSelectWorkstations();
    const equipmentOptions = useSelectEquipment(worklogFormData.workstationId);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWorklogFormData((prev) => ({
            ...prev,
            ...(value.includes(',')) ? (
                {
                    equipmentId: value.split(',')[0], 
                    equipmentName : value.split(',')[1]
                }
            ) : (
                {[name]: value,
                ...(name === "workstation" && {equipmentName: ""})
                }
            )
        }));
    };

    const handleInitialize = async (e) => {
        e.preventDefault();

        if(!worklogFormData.workstationId ||
            !worklogFormData.equipmentName ||
            !worklogFormData.issueType || 
            !worklogFormData.issueDescription
        ) {
            showToast("Missing required fields.", "warning");
            return;
        } 

        try {
            const startTime = new Date().toISOString();
            
            const updatedForm = {
                ...worklogFormData,
                startTime
            }
            setWorklogFormData(updatedForm);
            const result = await insertWorklog(updatedForm);

            if(result.success) {
                const ticketId = result?.data[0].ticket_id;

                localStorage.setItem('activeTicket', JSON.stringify(ticketId));

                showToast("Maintenance Log Initialized.", "success");

                navigate(`/new-maintenance-log/ticket/${ticketId}`);
            } else {
                showToast("Error initializing log.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Unexpected error.", "error");
        }
    };

    
    useEffect(() => {
        // console.log(worklogFormData);
    }, [worklogFormData]);

    return (
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
                <select name="workstationId" onChange={handleChange}>
                    <option value="">--Select--</option>
                    {
                        workstationOptions.map(ws => {
                            return (
                                <option
                                    key={ws.workstation_id}
                                    value={ws.workstation_id}
                                >
                                    {ws.workstation_id} - {ws.location_site.toUpperCase()}
                                </option>
                            );
                        })
                    }
                </select>
                
                <label>Equipment <span className="required-input">*</span></label>
                <select name="equipmentName" onChange={handleChange} disabled={worklogFormData.workstationId === ""}>
                    <option value="">--Select--</option>
                    {
                        equipmentOptions.length > 0 ? (
                            equipmentOptions.map(eq => (
                                <option 
                                    key={eq.equipment_id} 
                                    value={[eq.equipment_id, eq.equipment_name]} 
                                >
                                    [ID: {eq.equipment_id}] - {eq.equipment_name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No equipment available</option>
                        )
                    }
                </select>

                <label>Issue Type <span className="required-input">*</span></label>
                <select name="issueType" onChange={handleChange}>
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
            
    );
}