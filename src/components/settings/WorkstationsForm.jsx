import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import useInsertWorkstion from "../../api/useInsertWorkstation";
import useUpdateWorkstation from "../../api/useUpdateWorkstation";

export default function WorkstationsForm({onSuccess, initialData}) {
    const [updatedFields, setUpdatedFields] = useState([]);
    const [workstationForm, setWorkstationForm] = useState({
        workstation_id: "",
        location_site: ""
    });

    const { showToast } = useToast();
    const { insertWorkstation } = useInsertWorkstion();
    const { updateWorkstation } = useUpdateWorkstation();

    useEffect(() => {
        if(initialData) {
            setWorkstationForm({
                workstation_id: initialData.workstation_id || "",
                location_site: initialData.location_site || ""
            })
        }
    }, [initialData]);
    
    const handleChange = (e) => {
        if(initialData && e.target.value !== "") {
            if(initialData[e.target.name] !== e.target.value && !updatedFields.includes(e.target.name)) {
                setUpdatedFields(prev => [...prev, e.target.name]);
            } else if(initialData[e.target.name] === e.target.value && updatedFields.includes(e.target.name)) {
                setUpdatedFields(prev => prev.filter(i => i !== e.target.name))
            }
        }

        setWorkstationForm({
            ...workstationForm,
            [e.target.name]: e.target.value
        });
    }

    const handleAddWorkstation = async (e) => {
        e.preventDefault();

        console.log(workstationForm);
        console.log(updatedFields);

        if(Object.entries(workstationForm).some(i => i[1] === "")) {
            showToast("Missing required fields.", "error");
            return;
        } else if(initialData && updatedFields.length === 0) {
            showToast("No changes made.", "error");
            return;
        } 

        if(initialData) {
            const result = await updateWorkstation(workstationForm);

            if(result.success) {
                showToast("Workstation updated successfully.", "success");
                
                onSuccess?.();

                setWorkstationForm({
                    workstation_id: "",
                    location_site: ""
                });
            } else {
                console.log(result.error);
                showToast("Unable to update workstation.", 'error')  
            }
        } else {
            const result = await insertWorkstation(workstationForm);

            if(result.success) {
                showToast("Workstation added successfully.", "success");
                onSuccess?.();

                setWorkstationForm({
                    workstation_id: "",
                    location_site: ""
                });
            
            } else {
                console.log(result.error);
                showToast("Unable to add workstation.", 'error')
            }
        }
    }

    return (
        <>
            <form onSubmit={handleAddWorkstation}>
                <label>Workstation ID <span className="required-input">*</span></label>
                <input 
                    name='workstation_id' 
                    type="text"
                    value={workstationForm.workstation_id || ""}
                    onChange={handleChange}
                />

                <label>Location <span className="required-input">*</span></label>
                <select 
                    name='location_site' 
                    value={workstationForm.location_site || ""}
                    onChange={handleChange}
                >
                    <option value="">--Select--</option>
                    <option value="main">Main</option>
                    <option value="walnut">Walnut</option>
                </select>

                <div className="actions">
                    <button type='submit' className="primary">Add Workstation</button>
                </div>
            </form>
        </>
    )
}