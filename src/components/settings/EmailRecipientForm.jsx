import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import useInsertEmailRecipient from "../../api/useInsertEmailRecipient";
import useUpdateEmailRecipient from "../../api/useUpdateEmailRecipient";

export default function EmailRecipientForm({onSuccess, initialData}) {
    const [updatedFields, setUpdatedFields] = useState([]);
    const [emailRecipientForm, setEmailRecipientForm] = useState({
        name: "",
        email: "",
        all_shifts: true,
        first_shift: true,
        second_shift: true,
        third_shift: true
    });

    const { showToast } = useToast();
    const { insertEmailRecipient } = useInsertEmailRecipient();
    const { updateEmailRecipient } = useUpdateEmailRecipient();

    useEffect(() => {
        if(initialData) {
            setEmailRecipientForm({
                recipient_id: initialData.recipient_id || null,
                name: initialData.name || "",
                email: initialData.email || "",
                all_shifts: initialData.all_shifts || true,
                first_shift: initialData.first_shift || true,
                second_shift: initialData.second_shift || true,
                third_shift: initialData.third_shift || true
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

        setEmailRecipientForm({
            ...emailRecipientForm,
            [e.target.name]: e.target.value
        });
    }

    const handleAddEmailRecipient = async (e) => {
        e.preventDefault();

        console.log(Object.entries(emailRecipientForm));
        if(Object.entries(emailRecipientForm).some(i => i[1] === "")) {
            showToast("Missing required fields.", "error");
            return;
        } else if(initialData && updatedFields.length === 0) {
            showToast("No changes made.", "error");
            return;
        } 

        if(initialData) {
            const result = await updateEmailRecipient(email);

            if(result.success) {
                showToast("Email Recipient updated successfully.", "success");
                
                onSuccess?.();

                setEmailRecipientForm({
                    recipient_id: null,
                    name: "",
                    email: "",
                    all_shifts: true,
                    first_shift: true,
                    second_shift: true,
                    third_shift: true
                });
            } else {
                console.log(result.error);
                showToast("Unable to update email recipient.", 'error')  
            }
        } else {
            const result = await insertEmailRecipient(emailRecipientForm);

            if(result.success) {
                showToast("Email Recipient added successfully.", "success");
                
                onSuccess?.();

                setEmailRecipientForm({
                    recipient_id: null,
                    name: "",
                    email: "",
                    all_shifts: true,
                    first_shift: true,
                    second_shift: true,
                    third_shift: true
                });
            
            } else {
                console.log(result.error);
                showToast("Unable to add email recipient.", 'error')
            }
        }
    }

    return (
        <>
            <form onSubmit={handleAddEmailRecipient}>
                <label>Name <span className="required-input">*</span></label>
                <input 
                    name='name' 
                    type="text"
                    value={emailRecipientForm.name || ""}
                    onChange={handleChange}
                />

                <label>Email</label>
                <input 
                    name='email' 
                    type="text"
                    value={emailRecipientForm.email || ""}
                    onChange={handleChange}
                />

                <label className="mr-3">
                    <input 
                        type="checkbox"
                        checked={emailRecipientForm.all_shifts}
                        name="allShifts"
                        onChange={handleChange}
                        className="mr-1"
                    /> 
                    All Shifts
                </label>

                <label className="mr-3">
                    <input 
                        type="checkbox"
                        checked={emailRecipientForm.first_shift}
                        name="firstShift"
                        onChange={handleChange}
                        className="mr-1"
                    />
                    1st Shift
                </label>                
                
                <label className="mr-3">
                    <input 
                        type="checkbox"
                        checked={emailRecipientForm.second_shift}
                        name="secondShift"
                        onChange={handleChange}
                        className="mr-1"
                    /> 
                    2nd Shift
                </label>

                <label className="mr-3">
                    <input 
                        type="checkbox"
                        checked={emailRecipientForm.third_shift}
                        name="thirdShift"
                        onChange={handleChange}
                        className="mr-1"
                    />
                    3rd Shift
                </label>

                <div className="actions">
                    <button type='submit' className="primary">{initialData ? 'Update' : 'Add'} Email Recipient</button>
                </div>
            </form>
        </>
    )
}