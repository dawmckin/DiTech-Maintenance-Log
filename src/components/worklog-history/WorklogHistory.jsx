import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { generateWorkbook } from "../../utils/reports/generateWorkbook";

import SearchBox from "./SearchBox";
import FilterToggle from "./FilterToggle";
import HistoryTable from "./HistoryTable";
import ExportToExcelForm from "./ExportToExcelForm";
import Modal from "../util/Modal";

import useSelectWorklogs from "../../api/useSelectWorklogs";

export default function WorklogHistory() {
    const user = useAuth().user;

    const [search, setSearch] = useState("");
    const [toggle, setToggle] = useState("date");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const worklogs = useSelectWorklogs(refreshKey);

    return (
        <div>
            <div className="card">
                <h2>Worklog History</h2>

                <hr/>
                <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                    <div className="flex-grow-1">
                        <SearchBox
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="d-flex">
                        {
                            (user.user_metadata.user_role === 'admin') && (
                                <div className="d-flex mr-2">
                                    <button className="primary ml-auto"
                                            onClick={() => setIsModalOpen(true)}
                                    >
                                        <i className="bi bi-download"></i>
                                    </button>
                                </div>
                            )
                        }
                        <div className="d-flex">
                            <button className="primary ml-auto"
                                    onClick={() => setRefreshKey(prev => prev + 1)}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>


                    {/* <div className="d-flex toggle-container">
                        <FilterToggle value={toggle} onChange={setToggle} />
                    </div> */}
                </div>
                <div className="card">
                    <HistoryTable logs={worklogs} toggle={toggle} search={search} />
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                }} 
                title={`Export to Excel`}
            >
                <ExportToExcelForm 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        // setRefreshKey(prev => prev + 1);
                    }}
                />        
            </Modal>
        </div>
    );
}