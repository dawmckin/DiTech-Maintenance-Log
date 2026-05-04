import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

import AdminTable from "./AdminTable";
import UserForm from "./UserForm";
import WorkstationsForm from "./WorkstationsForm";
import EquipmentForm from "./EquipmentForm";
import Modal from "../util/Modal";

import "./admin-settings.css";

import useSelectAll from "../../api/useSelectAll";
import useUpdateUser from "../../api/useUpdateUser";
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
    const { deleteWorkstation } = useDeleteWorkstation();
    const { deleteEquipment } = useDeleteEquipment();

    const { showToast } = useToast();

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
                title={`${selectedRow ? 'Edit' : 'Add'} ${activeTab.toUpperCase()}`}
            >
                {
                    (activeTab === 'users') ? 
                    (
                        <UserForm 
                            initialData={selectedRow}
                            onSuccess={() => {
                                setIsModalOpen(false);
                                setSelectedRow(null);
                                setRefreshKey(prev => prev + 1);
                            }}
                        />    
                    ) : 
                    (
                        (activeTab === 'workstations') ? 
                        (
                            <WorkstationsForm 
                                initialData={selectedRow}
                                onSuccess={() => {
                                    setIsModalOpen(false);
                                    setSelectedRow(null);
                                    setRefreshKey(prev => prev + 1);
                                }}
                            />

                        ) : 
                        (
                            <EquipmentForm 
                                initialData={selectedRow}
                                onSuccess={() => {
                                    setIsModalOpen(false);
                                    setSelectedRow(null);
                                    setRefreshKey(prev => prev + 1);
                                }}
                            />
                        )
                    )
                }
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
                            activeTab === 'workstations' ? 
                                'Delete Workstation' : 
                                'Delete Equipment'}`}
                isDelete={true}
            >
                <p>Are you sure?</p>

                <div className="float-right">
                    {
                        (activeTab === 'users') ? 
                        (
                            <button className={`primary ${selectedRow?.user_status === 'active' ? 'cancel' : ''}`}
                                    onClick={() => handleEnableDisableUser()}>
                                {selectedRow?.user_status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                        ) : 
                        (
                            (activeTab === 'workstations') ? 
                            (
                                <button className="primary cancel"
                                        onClick={() => handleDeleteWorkstation()}>
                                    Delete
                                </button>
                            ) : 
                            (
                                <button className="primary cancel"
                                        onClick={() => handleDeleteEquipment()}>
                                    Delete
                                </button>
                            )
                        )

                    }

                </div>
            </Modal>
        </div>
    )
}