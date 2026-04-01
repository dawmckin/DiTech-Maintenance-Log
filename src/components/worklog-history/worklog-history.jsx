import { useState } from "react";
import SearchBox from "./search-box";
import FilterToggle from "./filter-toggle";
import HistoryTable from "./history-table";
import LogData from "../../mock-data/logs.json";

export default function WorklogHistory() {
    const [search, setSearch] = useState("");
    const [toggle, setToggle] = useState("date");

    const logs = LogData;

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
                        <p className="my-auto mr-2"><strong>View By: </strong></p>
                        <FilterToggle value={toggle} onChange={setToggle} />
                    </div>
                </div>
                <div className="card">
                    <HistoryTable logs={logs} toggle={toggle} search={search} />
                </div>
            </div>
        </div>
    );
}