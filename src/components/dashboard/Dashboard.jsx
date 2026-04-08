import { Link } from "react-router-dom";
import { use, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import calculateKPIs from "../../kpi-utils/calculate-kpis";
import formatDuration from "../../kpi-utils/format-duration";
import filterLogsByRanges from "../../kpi-utils/filter-by-range";

import KPICard from "./KPICard";
import DowntimeChart from "./DowntimeChart";
import IssuesOverTimeChart from "./IssuesOverTimeChart";
import DowntimeByIssueTypeChart from "./DowntimeByIssueTypeChart";
import DowntimeByWorkstationChart from "./DowntimeByWorkstationChart";
import IssueDistributionChart from "./IssueDistributionChart";

import useSelectWorklogs from "../../api/useSelectWorklogs";

export default function Dashboard() {
    const user = useAuth().user;

    const logs = useSelectWorklogs();

    const [range, setRange] = useState("week");

    const filteredLogs = useMemo(() => {
        return filterLogsByRanges(logs, range);
    }, [logs, range]);

    const {totalDowntime, activeIssues, issuesToday} = useMemo(() => {
        return calculateKPIs(filteredLogs);
    }, [filteredLogs]);

    return (
        <div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h2>Dashboard</h2>
                    <Link to="/new-maintenance-log">
                        <button className="primary log-action">New Maintenance Log</button>
                    </Link>
                </div>

                <hr/>
                <div className="row d-flex justify-content-between mb-2">
                    <div className="col-md-4 d-flex">
                        <p className="my-auto">Welcome <strong>{user?.user_metadata?.display_name}</strong>!</p>
                    </div>

                    <div className="col-md-4 d-flex">
                        <p className="ml-auto mr-2 my-auto"><strong>View by:</strong></p>
                        <select className="col-md-9" value={range} onChange={(e) => setRange(e.target.value)}>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter-year">Last 3 Months</option>
                            <option value="half-year">Last 6 Months</option>
                            <option value="year">Last 12 Months</option>
                        </select>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="d-flex flex-column justify-content-between">
                        <KPICard title="Total Downtime" value={formatDuration(totalDowntime)} />
                        <KPICard title="Active Issues" value={activeIssues} />
                        <KPICard title="Issues Today" value={issuesToday}/>
                    </div>
                    <IssueDistributionChart logs={filteredLogs} />
                    <DowntimeByIssueTypeChart logs={filteredLogs} />

                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <DowntimeChart logs={filteredLogs} range={range} />
                    </div>
                    <div className="col-md-6">
                        <IssuesOverTimeChart logs={filteredLogs} range={range} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12">
                        <DowntimeByWorkstationChart logs={filteredLogs} />
                    </div>
                </div>

            </div>
        </div>
    );
}