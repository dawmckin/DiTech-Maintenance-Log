import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import useInsertEquipment from "../../api/useInsertEquipment";
import useUpdateEquipment from "../../api/useUpdateEquipment";
import useSelectWorkstations from "../../api/useSelectWorkstations";

export default function EquipmentForm({onSuccess, initialData}) {
    const [updatedFields, setUpdatedFields] = useState([]);
    const [equipmentForm, setEquipmentForm] = useState({
        equipment_id: "",
        equipment_name: "",
        workstation_id: ""
    });

    const { showToast } = useToast();
    const { insertEquipment } = useInsertEquipment();
    const { updateEquipment } = useUpdateEquipment();
    const workstationOptions = useSelectWorkstations();

    useEffect(() => {
        if(initialData) {
            setEquipmentForm({
                equipment_id: initialData.equipment_id || "",
                equipment_name: initialData.equipment_name || "",
                workstation_id: initialData.workstation_id || ""
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

        setEquipmentForm({
            ...equipmentForm,
            [e.target.name]: e.target.value
        });
    }

    const handleAddEquipment = async (e) => {
        e.preventDefault();

        console.log(equipmentForm);
        console.log(updatedFields);

        if(Object.entries(equipmentForm).some(i => i[1] === "")) {
            showToast("Missing required fields.", "error");
            return;
        } else if(initialData && updatedFields.length === 0) {
            showToast("No changes made.", "error");
            return;
        } 

        if(initialData) {
            const result = await updateEquipment(equipmentForm);

            if(result.success) {
                showToast("Equipment updated successfully.", "success");
                
                onSuccess?.();

                setEquipmentForm({
                    equipment_id: "",
                    equipment_name: "",
                    workstation_id: ""
                });
            } else {
                console.log(result.error);
                showToast("Unable to update equipment.", 'error')  
            }
        } else {
            const result = await insertEquipment(equipmentForm);

            if(result.success) {
                showToast("Equipment added successfully.", "success");
                
                onSuccess?.();

                setEquipmentForm({
                    equipment_id: "",
                    equipment_name: "",
                    workstation_id: ""
                });
            
            } else {
                console.log(result.error);
                showToast("Unable to add equipment.", 'error')
            }
        }
    }

    return (
        <>
            <form onSubmit={handleAddEquipment}>
                <label>Equipment ID <span className="required-input">*</span></label>
                <input 
                    name='equipment_id' 
                    type="text"
                    value={equipmentForm.equipment_id || ""}
                    onChange={handleChange}
                />

                <label>Equipment Name <span className="required-input">*</span></label>
                <input 
                    name='equipment_name' 
                    type="text"
                    value={equipmentForm.equipment_name || ""}
                    onChange={handleChange}
                />

                <label>Workstation ID <span className="required-input">*</span></label>
                <select 
                    name='workstation_id' 
                    value={equipmentForm.workstation_id || ""}
                    onChange={handleChange}
                >
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

                <div className="actions">
                    <button type='submit' className="primary">Add Workstation</button>
                </div>
            </form>
        </>
    )
}