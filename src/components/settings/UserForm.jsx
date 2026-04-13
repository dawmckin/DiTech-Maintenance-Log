import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import useInsertUser from "../../api/useInsertUser";
import useUpdateUser from "../../api/useUpdateUser";

export default function UserForm({onSuccess, initialData}) {
    const [updatedFields, setUpdatedFields] = useState([]);
    const [userForm, setUserForm] = useState({
        user_id: "",
        ditech_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_role: ""
    });

    const { signUpUser, updateAuthUser } = useAuth();
    const { showToast } = useToast();
    const { insertUser } = useInsertUser();
    const { updateUser } = useUpdateUser();

    useEffect(() => {
        if(initialData) {
            setUserForm({
                user_id: initialData.user_id || "",
                ditech_id: initialData.ditech_id || "",
                first_name: initialData.first_name || "",
                last_name: initialData.last_name || "",
                email: initialData.email || "",
                password: "",
                user_role: initialData.user_role || "",
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

        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    }

    const handleAddUser = async (e) => {
        e.preventDefault();

        console.log(updatedFields);

        if(Object.entries(userForm).some(i => i[1] === "" && i[0] !== 'password')) {
            showToast("Missing required fields.", "error");
            return;
        } else if(initialData && updatedFields.length === 0) {
            showToast("No changes made.", "error");
            return;
        } 

        if(initialData) {
            let authUpdatedData = {
                email: userForm.email,
                user_metadata: {display_name: `${userForm.first_name} ${userForm.last_name}`}
            };
            // if(updatedFields.includes('email') && (updatedFields.includes('first_name') || updatedFields.includes('last_name'))) {
            //     authUpdatedData = {email: userForm.email, data: {display_name: `${userForm.first_name} ${userForm.last_name}`}};
            // } else if(updatedFields.includes('email')) {
            //     authUpdatedData = {email: userForm.email};
            // } else if (updatedFields.includes('first_name') || updatedFields.includes('last_name')) {
            //     authUpdatedData = {display_name: `${userForm.first_name} ${userForm.last_name}`};
            // }

            const authResult = await updateAuthUser(initialData.user_id, authUpdatedData);

            if(authResult.success) {
                showToast("User updated to Auth successfully.", "success");
                
                const userId = authResult.data.user.id;
                
                delete userForm.password;
                const dbResult = await updateUser(userId, userForm);

                if(dbResult.success) {
                    showToast("User updated successfully.", "success");
                    onSuccess?.();
                    
                    setUserForm({
                        user_id: "",
                        ditech_id: "",
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        user_role: ""
                    });
                } else {
                    console.log(dbResult.error);
                    showToast("Unable to update user.", 'error');
                }
            } else {
                console.log(authResult.error);
                showToast("Unable to add user.", 'error')  
            }
        } else {
            const authResult = await signUpUser(userForm.email, userForm.password, `${userForm.first_name} ${userForm.last_name}`);

            if(authResult.success) {
                // showToast("User added to Auth successfully.", "success");

                const userId = authResult.data.user.id;

                const dbResult = await insertUser(userId, userForm.ditech_id, userForm.first_name, userForm.last_name, userForm.user_role);
                
                if(dbResult.success) {
                    showToast("User added successfully.", "success");
                    onSuccess?.();

                    setUserForm({
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
    }

    return (
        <>
            <form onSubmit={handleAddUser}>
                <label>DiTech ID <span className="required-input">*</span></label>
                <input 
                    name='ditech_id' 
                    type="text"
                    value={userForm.ditech_id || ""}
                    onChange={handleChange}
                />
                
                <label>First Name <span className="required-input">*</span></label>
                <input 
                    name='first_name' 
                    type="text" 
                    value={userForm.first_name || ""}
                    onChange={handleChange}
                />
                
                <label>Last Name <span className="required-input">*</span></label>
                <input 
                    name='last_name' 
                    type="text" 
                    value={userForm.last_name || ""}
                    onChange={handleChange}
                />

                <label>Email <span className="required-input">*</span></label>
                <input 
                    name='email' 
                    type="text" 
                    value={userForm.email || ""}
                    onChange={handleChange}
                />
                {(!initialData) ? (
                    <>
                        <label>Password <span className="required-input">*</span></label>
                        <input 
                            name='password' 
                            type="text" 
                            value={userForm.password || ""}
                            onChange={handleChange}
                        />
                    </>
                ) : (<></>)}

                <label>Role <span className="required-input">*</span></label>
                <select 
                    name='user_role' 
                    value={userForm.user_role || ""}
                    onChange={handleChange}
                >
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