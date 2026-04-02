import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import groupLogsByDate  from "../../kpi-utils/group-by-date";
import formatDuration from "../../kpi-utils/format-duration";
import { useMemo } from "react";
import "./KPICard.css";

export default function DowntimeChart({logs, range}) {
    const data = useMemo(() => {
        return groupLogsByDate(logs, range);
    }, [logs, range]);

    return (
        <div className="kpi-card">
            <h3 className="header-center">Downtime Over Time</h3>
            <hr />

            <ResponsiveContainer width='100%' height={300}>
                <LineChart data={data.groups}>
                    <XAxis dataKey="Date" stroke="#e5e7eb"/>
                    <YAxis tickFormatter={(v) => Math.round(v / (1000 * 60 * 60)) + "h"} stroke="#e5e7eb"/>
                    <Tooltip formatter={(value)=> formatDuration(value)}  itemStyle={{color: '#000'}} />
                    <Line 
                        type="monotone"
                        dataKey="Downtime"
                        stroke="#22c55e"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}