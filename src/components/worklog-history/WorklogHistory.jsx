import { useState } from "react";

import { exportToExcel } from "../../utils/export-to-excel";

import SearchBox from "./SearchBox";
import FilterToggle from "./FilterToggle";
import HistoryTable from "./HistoryTable";

import useSelectWorklogs from "../../api/useSelectWorklogs";

export default function WorklogHistory() {
    const [search, setSearch] = useState("");
    const [toggle, setToggle] = useState("date");
    const [refreshKey, setRefreshKey] = useState(0);

    const worklogs = useSelectWorklogs(refreshKey);

    const handleExport = () => {
        const formattedData = worklogs.map(log => ({
            TicketID: log.ticketId,
            Workstation: log.workstation_id,
            Location: log.workstations?.location_site,
            DitechEquipmentID: log.plex_equipment_id,
            AssetNumber: log.asset_number,
            EquipmentName: log.equipment?.equipment_name,
            IssueType: log.issue_type,
            Status: log.issue_status,
            StartTime: log.start_time,
            CreatedBy: `${log.users?.first_name} ${log.users?.last_name}`
        }));

        exportToExcel(formattedData, "worklogs.xlsx");
    }

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
                        <button className="primary ml-auto"
                                onClick={() => setRefreshKey(prev => prev + 1)}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>

                    {/* <div className="d-flex toggle-container">
                        <FilterToggle value={toggle} onChange={setToggle} />
                    </div> */}

                    {/* <div>
                        <button onClick={handleExport}>
                            Export to Excel
                        </button>
                    </div> */}
                </div>
                <div className="card">
                    <HistoryTable logs={worklogs} toggle={toggle} search={search} />
                </div>
            </div>
        </div>
    );
}