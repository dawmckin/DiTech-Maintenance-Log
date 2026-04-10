import { useState } from "react";

import AdminTable from "./AdminTable";
import AddUserForm from "./AddUserForm";
import Modal from "../util/Modal";

import "./admin-settings.css";

import useSelectAll from "../../api/useSelectAll";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("users");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const data = useSelectAll(activeTab, refreshKey);

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
                                <AdminTable view={activeTab} rowData={data}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add ${activeTab.toUpperCase()}`}>
                <AddUserForm onSuccess={() => {
                    setIsModalOpen(false);
                    setRefreshKey(prev => prev + 1)
                }}/>
            </Modal>
        </div>
    )
}