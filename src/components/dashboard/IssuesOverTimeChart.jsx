import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import groupLogsByDate  from "../../utils/group-by-date";
import { useMemo } from "react";
import "./KPICard.css";

export default function IssuesOverTimeChart({logs, range}) {
    const data = useMemo(() => {
        return groupLogsByDate(logs, range);
    }, [logs, range]);

  return (
    <div className="kpi-card">
      <h3 className="header-center">Issues Over Time</h3>
      <hr />

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.groups}>
          <XAxis dataKey="Date" stroke="#e5e7eb"/>
          {data.highestIssues <= 5 ? (
            <YAxis stroke="#e5e7eb" domain={[0, 5]} tickCount={6} />
          ) : (
            <YAxis stroke="#e5e7eb" domain={[0, data.highestIssues + (data.highestIssues % 5)]} tickCount={6}/>
          )}
          <Tooltip itemStyle={{color: '#000'}} />
          <Line
            type="monotone"
            dataKey="Issues"
            stroke="#22c55e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}