import { useMemo } from "react";

import calculateKPIs from "../../utils/calculate-kpis";
import formatDuration from "../../utils/format-duration";
import filterLogsByRanges from "../../utils/filter-by-range";

import KPICard from "./KPICard";
import DowntimeChart from "./DowntimeChart";
import IssuesOverTimeChart from "./IssuesOverTimeChart";
import DowntimeByIssueTypeChart from "./DowntimeByIssueTypeChart";
import DowntimeByWorkstationChart from "./DowntimeByWorkstationChart";
import IssueDistributionChart from "./IssueDistributionChart";

import useSelectWorklogs from "../../api/useSelectWorklogs";

export default function AdminView({range}) {
    const logs = useSelectWorklogs();
    
    const filteredLogs = useMemo(() => {
        return filterLogsByRanges(logs, range);
    }, [logs, range]);

    const {totalDowntime, activeIssues, issuesToday} = useMemo(() => {
        return calculateKPIs(filteredLogs);
    }, [filteredLogs]);

    return (
        <div>
            <div className="kpi-grid">
                <div className="d-flex flex-column justify-content-between">
                    <KPICard title="Total Downtime" value={formatDuration(totalDowntime)} />
                    <div className="mobile-kpi-container">
                        <KPICard title="Active Issues" value={activeIssues} optionalClass="mobile-kpi" />
                        <KPICard title="Issues Today" value={issuesToday} optionalClass="mobile-kpi"/>
                    </div>
                    <KPICard title="Active Issues" value={activeIssues} optionalClass="desktop-kpi"/>
                    <KPICard title="Issues Today" value={issuesToday} optionalClass="desktop-kpi"/>                       
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
    )
}