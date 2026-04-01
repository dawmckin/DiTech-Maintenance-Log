import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import groupDowntimeByField from "../../kpi-utils/group-by-field";
import formatDuration from "../../kpi-utils/format-duration";
import "./KPICard.css";

export default function DowntimeByIssueTypeChart({logs}) {
    const data = useMemo(() => {
        return groupDowntimeByField(logs, "issue_type");
    }, [logs]);

    return (
        <div className="kpi-card">
            <h3 className="header-center">Downtime by Issue Type</h3>
            <hr />

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis datakey="name" stroke="#e5e7eb"/>
                    <YAxis stroke="#e5e7eb"/>
                    <Tooltip formatter={(value) => formatDuration(value)} radius={[6, 6, 0, 0]}/>
                    <Bar dataKey="downtime"  fill="#dc3545"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}