import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import useInsertEmailRecipient from "../../api/useInsertEmailRecipient";
import useUpdateEmailRecipient from "../../api/useUpdateEmailRecipient";

export default function EmailRecipientForm({onSuccess, initialData}) {
    const [updatedFields, setUpdatedFields] = useState([]);
    const [emailRecipientForm, setEmailRecipientForm] = useState({
        recipient_id: null,
        name: "",
        email: "",
        all_shifts: true,
        first_shift: true,
        second_shift: true,
        third_shift: true,
        enabled: true,
    });

    const { showToast } = useToast();
    const { insertEmailRecipient } = useInsertEmailRecipient();
    const { updateEmailRecipient } = useUpdateEmailRecipient();

    useEffect(() => {
        if(initialData) {
            setEmailRecipientForm({
                recipient_id: initialData.recipient_id,
                name: initialData.name || "",
                email: initialData.email || "",
                all_shifts: initialData.all_shifts ?? true,
                first_shift: initialData.first_shift ?? true,
                second_shift: initialData.second_shift ?? true,
                third_shift: initialData.third_shift ?? true,
                enabled: initialData.enabled ?? true
            });
        }
    }, [initialData]);
    
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        if (initialData) {
            if (
                initialData[e.target.name] !== value &&
                !updatedFields.includes(e.target.name)
            ) {
                setUpdatedFields(prev => [...prev, e.target.name]);
            } else if (
                initialData[e.target.name] === value &&
                updatedFields.includes(e.target.name)
            ) {
                setUpdatedFields(prev =>
                    prev.filter(i => i !== e.target.name)
                );
            }
        }

        setEmailRecipientForm(prev => {
            let updatedForm = {
                ...prev,
                [name]: newValue
            };

            if (type === "checkbox") {
                if (name === "all_shifts") {
                    updatedForm = {
                        ...updatedForm,
                        first_shift: checked,
                        second_shift: checked,
                        third_shift: checked
                    };
                } else {
                    const allSelected =
                        updatedForm.first_shift &&
                        updatedForm.second_shift &&
                        updatedForm.third_shift;

                    updatedForm.all_shifts = allSelected;
                }
            }

            updatedForm.enabled = updatedForm.first_shift || updatedForm.second_shift || updatedForm.third_shift; 

            return updatedForm;
        });
    };

    const handleAddEmailRecipient = async (e) => {
        e.preventDefault();

        if(Object.entries(emailRecipientForm).some(i => i[1] === "" && i[0] !== 'recipient_id')) {
            showToast("Missing required fields.", "error");
            return;
        } else if(initialData && updatedFields.length === 0) {
            showToast("No changes made.", "error");
            return;
        } 

        if(initialData) {
            const result = await updateEmailRecipient(emailRecipientForm);

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
                    third_shift: true,
                    enabled: true
                });
            } else {
                console.log(result.error);
                showToast("Unable to update email recipient.", 'error')  
            }
        } else {
            delete emailRecipientForm.recipient_id;
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
                    third_shift: true,
                    enabled: true
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

                <label>Email <span className="required-input">*</span></label>
                <input 
                    name='email' 
                    type="text"
                    value={emailRecipientForm.email || ""}
                    onChange={handleChange}
                />

                <div className="d-flex mt-2">
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={emailRecipientForm.all_shifts}
                            name="all_shifts"
                            onChange={handleChange}
                            className="mr-1"
                        /> 
                        All Shifts
                    </label>

                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={emailRecipientForm.first_shift}
                            name="first_shift"
                            onChange={handleChange}
                            className="mr-1"
                        />
                        1st
                    </label>                
                    
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={emailRecipientForm.second_shift}
                            name="second_shift"
                            onChange={handleChange}
                            className="mr-1"
                        /> 
                        2nd
                    </label>

                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={emailRecipientForm.third_shift}
                            name="third_shift"
                            onChange={handleChange}
                            className="mr-1"
                        />
                        3rd
                    </label>
                </div>

                <div className="actions">
                    <button type='submit' className="primary">{initialData ? 'Update' : 'Add'} Email Recipient</button>
                </div>
            </form>
        </>
    )
}