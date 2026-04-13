import { useState } from "react";
import { useToast } from "../../context/ToastContext";

import AdminTable from "./AdminTable";
import UserForm from "./UserForm";
import WorkstationsForm from "./WorkstationsForm";
import Modal from "../util/Modal";

import "./admin-settings.css";

import useSelectAll from "../../api/useSelectAll";
import useDeleteWorkstation from "../../api/useDeleteWorkstation";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("users");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDelete, setIsDelete] = useState(null);
    
    const data = useSelectAll(activeTab, refreshKey);
    const { deleteWorkstation } = useDeleteWorkstation();

    const { showToast } = useToast();

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

    return (
        <div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h2>Admin Settings</h2>
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
                            <div className="d-flex justify-content-end">
                                <button className="primary log-action d-flex" onClick={() => setIsModalOpen(true)}>
                                    <i className="bi bi-plus-lg pr-2"></i>
                                    <p className="mb-0">Add {activeTab?.toUpperCase()}</p>
                                </button>
                            </div>

                            <div className="card">
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
                            <></>
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
                title={`Delete Workstation`}
                isDelete={true}
            >
                <p>Are you sure?</p>

                <div className="float-right">
                    <button className="primary cancel"
                            onClick={() => handleDeleteWorkstation()}>
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    )
}