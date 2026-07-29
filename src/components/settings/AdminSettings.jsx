import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

import AdminTable from "./AdminTable";
import UserForm from "./UserForm";
import EmailRecipientForm from "./EmailRecipientForm";
import WorkstationsForm from "./WorkstationsForm";
import EquipmentForm from "./EquipmentForm";
import Modal from "../util/Modal";

import "./admin-settings.css";

import useSelectAll from "../../api/useSelectAll";
import useUpdateUser from "../../api/useUpdateUser";
import useDeleteEmailRecipient from "../../api/useDeleteEmailRecipient";
import useDeleteWorkstation from "../../api/useDeleteWorkstation";
import useDeleteEquipment from "../../api/useDeleteEquipment";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("users");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDelete, setIsDelete] = useState(null);
    
    const data = useSelectAll(activeTab, refreshKey);

    const { updateAuthUser } = useAuth();
    const { updateUser } = useUpdateUser();
    const { deleteEmailRecipient } = useDeleteEmailRecipient();
    const { deleteWorkstation } = useDeleteWorkstation();
    const { deleteEquipment } = useDeleteEquipment();

    const { showToast } = useToast();

    const headerText = {
        users: 'User',
        emailRecipients: 'Email Recipient',
        workstations: 'Workstation',
        equipment: 'Equipment'
    }

    const handleEnableDisableUser = async () => {
        let authUpdatedData = {
            email: selectedRow?.email,
            user_metadata: {
                display_name: `${selectedRow?.first_name} ${selectedRow?.last_name}`,
                user_role: selectedRow?.user_role,
                sub: selectedRow?.user_id,
                email: selectedRow?.email,
                status: selectedRow?.user_status === 'active' ? 'disabled' : 'active'
            }
        };

        const authResult = await updateAuthUser(selectedRow?.user_id, authUpdatedData);

        if(authResult.success) {
            // showToast(`User ${selectedRow?.user_status === 'active' ? 'disabled' : 'enabled'} to Auth successfully.`, "success");
            
            const userId = authResult.data.user.id;
            
            const dbResult = await updateUser(userId, {user_status: selectedRow?.user_status === 'active' ? 'disabled' : 'active'});

            if(dbResult.success) {
                showToast(`User ${selectedRow?.user_status === 'active' ? 'disabled' : 'enabled'} successfully.`, "success");

                setIsDelete(false);
                setIsModalOpen(false);
                setSelectedRow(null);
                setRefreshKey(prev => prev + 1);
            } else {
                console.log(dbResult.error);
                showToast(`Unable to  ${selectedRow?.user_status === 'active' ? 'disable' : 'enable'} user.`, 'error');
            }
        } else {
            console.log(authResult.error);
            showToast(`Unable to ${selectedRow?.user_status === 'active' ? 'disable' : 'enable'} user.`, 'error');
        }
    }

    const handleDeleteEmailRecipient = async () => {
        const result = await deleteEmailRecipient(selectedRow);

        if(result.success) {
            showToast("Email Recipient deleted successfully.", "success");

            setIsDelete(false);
            setIsModalOpen(false);
            setSelectedRow(null);
            setRefreshKey(prev => prev + 1);
        } else {
            console.log(result.error);
            showToast("Unable to delete email recipient.", 'error');
        }
    }

    const handleDeleteWorkstation = async () => {
        const result = await deleteWorkstation(selectedRow);

        if(result.success) {
            showToast("Workstation deleted successfully.", "success");

            setIsDelete(false);
            setIsModalOpen(false);
            setSelectedRow(null);
            setRefreshKey(prev => prev + 1);
        } else {
            console.log(result.error);
            showToast("Unable to delete workstation.", 'error');
        }
    }

    const handleDeleteEquipment = async () => {
        const result = await deleteEquipment(selectedRow);

        if(result.success) {
            showToast("Equipment deleted successfully.", "success");

            setIsDelete(false);
            setIsModalOpen(false);
            setSelectedRow(null);
            setRefreshKey(prev => prev + 1);
        } else {
            console.log(result.error);
            showToast("Unable to delete equipment.", 'error');
        }
    }

    let tabForm = '';
    switch(activeTab) {
        case 'users':
            tabForm = <UserForm 
                initialData={selectedRow}
                onSuccess={() => {
                    setIsModalOpen(false);
                    setSelectedRow(null);
                    setRefreshKey(prev => prev + 1);
                }}
            />;
            break;
        case 'emailRecipients':
            tabForm = <EmailRecipientForm 
                initialData={selectedRow}
                onSuccess={() => {
                    setIsModalOpen(false);
                    setSelectedRow(null);
                    setRefreshKey(prev => prev + 1);
                }}
            />
            break;
        case 'workstations':
            tabForm = <WorkstationsForm 
                initialData={selectedRow}
                onSuccess={() => {
                    setIsModalOpen(false);
                    setSelectedRow(null);
                    setRefreshKey(prev => prev + 1);
                }}
            />;
            break;
        case 'equipment':
            tabForm = <EquipmentForm 
                initialData={selectedRow}
                onSuccess={() => {
                    setIsModalOpen(false);
                    setSelectedRow(null);
                    setRefreshKey(prev => prev + 1);
                }}
            />;
            break;
        default:
            break;
    }

    let deleteButton = '';
    switch(activeTab) {
        case 'users':
            deleteButton = <button className={`primary ${selectedRow?.user_status === 'active' ? 'cancel' : ''}`}
                onClick={() => handleEnableDisableUser()}>
                {selectedRow?.user_status === 'active' ? 'Disable' : 'Enable'}
            </button>;
            break;
        case 'emailRecipients':
           deleteButton = <button className="primary cancel"
                onClick={() => handleDeleteEmailRecipient()}>
                Delete
            </button>; 
            break;       
        case 'workstations':
            deleteButton = <button className="primary cancel"
                onClick={() => handleDeleteWorkstation()}>
                Delete
            </button>;
            break;
        case 'equipment':
            deleteButton = <button className="primary cancel"
                onClick={() => handleDeleteEquipment()}>
                Delete
            </button>;
            break;
        default:
            break;

    }

    return (
        <div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h2>Admin Settings</h2>

                    <div className="d-flex justify-content-end">
                        <button className="primary log-action d-flex" onClick={() => setIsModalOpen(true)}>
                            <i className="bi bi-plus-lg pr-2"></i>
                            <p className="mb-0">Add</p>
                        </button>
                    </div>
                </div>

                <hr />

                <div>
                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button
                                className={activeTab === 'users' ? 'tab active' : 'tab'}
                                onClick={() => setActiveTab('users')}
                            >
                                Users
                            </button>                             
                            <button
                                className={activeTab === 'emailRecipients' ? 'tab active' : 'tab'}
                                onClick={() => setActiveTab('emailRecipients')}
                            >
                                Email Recipients
                            </button>                            
                            <button
                                className={activeTab === 'workstations' ? 'tab active' : 'tab'}
                                onClick={() => setActiveTab('workstations')}
                            >
                                Workstations
                            </button>                            
                            <button
                                className={activeTab === 'equipment' ? 'tab active' : 'tab'}
                                onClick={() => setActiveTab('equipment')}
                            >
                                Equipment
                            </button>
                        </div>

                        <div className="tabs-content ">
                            <div>
                                <AdminTable view={activeTab} 
                                            rowData={data} 
                                            onEdit={(row) => {
                                                setSelectedRow(row);
                                                setIsModalOpen(true);
                                            }}
                                            onDelete={(row) => {
                                                setIsDelete(true);
                                                setSelectedRow(row);
                                                setIsModalOpen(true);
                                            }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={isModalOpen && !isDelete} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRow(null);
                }} 
                title={`${selectedRow ? 'Edit' : 'Add'} ${headerText[activeTab]}`}
            >
                {tabForm}
            </Modal>

            <Modal
                isOpen={isModalOpen && isDelete} 
                onClose={() => {
                    setIsDelete(false);
                    setIsModalOpen(false);
                    setSelectedRow(null);
                }} 
                title={`${activeTab === 'users' ? 
                            `${selectedRow?.user_status === 'active' ? 'Disable' : 'Enable'} User` : 
                            `Delete ${headerText[activeTab]}`}
                        `}
                isDelete={true}
            >
                <p>Are you sure?</p>

                <div className="float-right">
                    {deleteButton}
                </div>
            </Modal>
        </div>
    )
}