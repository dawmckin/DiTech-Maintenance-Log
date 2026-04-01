import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import calculateKPIs from "../../kpi-utils/calculate-kpis";
import formatDuration from "../../kpi-utils/format-duration";
import KPICard from "./KPICard";
import DowntimeChart from "./DowntimeChart";
import IssuesOverTimeChart from "./IssuesOverTimeChart";
import DowntimeByIssueTypeChart from "./DowntimeByIssueTypeChart";
import DowntimeByWorkstationChart from "./DowntimeByWorkstationChart";
import IssueDistributionChart from "./IssueDistributionChart";

import LogData from "../../mock-data/logs.json";


export default function Dashboard() {
    const logs = LogData;
    const [range, setRange] = useState("day");

    const {totalDowntime, activeIssues, issuesToday} = useMemo(() => {
        return calculateKPIs(logs);
    }, [logs]);

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

                <div className="kpi-grid">
                    <div className="d-flex flex-column justify-content-between">
                        <KPICard title="Total Downtime" value={formatDuration(totalDowntime)} />
                        <KPICard title="Active Issues" value={activeIssues} />
                        <KPICard title="Issues Today" value={issuesToday}/>
                    </div>
                    <IssueDistributionChart logs={logs} />
                    <DowntimeByIssueTypeChart logs={logs} />

                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <DowntimeChart logs={logs} range={range} />
                    </div>
                    <div className="col-md-6">
                        <IssuesOverTimeChart logs={logs} range={range} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12">
                        <DowntimeByWorkstationChart logs={logs} />
                    </div>
                </div>

            </div>
        </div>
    );
}