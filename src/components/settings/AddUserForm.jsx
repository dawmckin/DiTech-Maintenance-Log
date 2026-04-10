import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import useInsertUser from "../../api/useInsertUser";

export default function AddUserForm({onSuccess}) {
    const [addUserForm, setAddUserForm] = useState({
        ditech_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_role: ""
    });

    const { signUpUser } = useAuth();
    const { showToast } = useToast();
    const { insertUser } = useInsertUser();

    const handleChange = (e) => {
        setAddUserForm({
            ...addUserForm,
            [e.target.name]: e.target.value
        });
    }

    const handleAddUser = async (e) => {
        e.preventDefault();

        console.log(Object.values(addUserForm));
        if(Object.values(addUserForm).some(i => i === "")) {
            showToast("Missing required fields.", "error");
            return;
        }

        const authResult = await signUpUser(addUserForm.email, addUserForm.password, `${addUserForm.first_name} ${addUserForm.last_name}`);

        if(authResult.success) {
            // showToast("User added to Auth successfully.", "success");

            const userId = authResult.data.user.id;

            const dbResult = await insertUser(userId, addUserForm.ditech_id, addUserForm.first_name, addUserForm.last_name, addUserForm.user_role);
            
            if(dbResult.success) {
                showToast("User added successfully.", "success");
                onSuccess?.();

                setAddUserForm({
                    ditech_id: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    user_role: ""
                });
            } else {
                console.log(dbResult.error);
                showToast("Unable to add user.", 'error');
            }
        
        } else {
            console.log(authResult.error);
            showToast("Unable to add user.", 'error')
        }
    }

    return (
        <>
            <form onSubmit={handleAddUser}>
                <label>DiTech ID <span className="required-input">*</span></label>
                <input name='ditech_id' type="text" onChange={handleChange}/>
                
                <label>First Name <span className="required-input">*</span></label>
                <input name='first_name' type="text" onChange={handleChange}/>
                
                <label>Last Name <span className="required-input">*</span></label>
                <input name='last_name' type="text" onChange={handleChange}/>

                <label>Email <span className="required-input">*</span></label>
                <input name='email' type="text" onChange={handleChange}/>

                <label>Password <span className="required-input">*</span></label>
                <input name='password' type="text" onChange={handleChange}/>

                <label>Role <span className="required-input">*</span></label>
                <select name='user_role' onChange={handleChange}>
                    <option value="">--Select--</option>
                    <option value="admin">Admin</option>
                    <option value="maintenance">Maintenance</option>
                </select>

                <div className="actions">
                    <button type='submit' className="primary">Add User</button>
                </div>
            </form>
        </>
    )
}