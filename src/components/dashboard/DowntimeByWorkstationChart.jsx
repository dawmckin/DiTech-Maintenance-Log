import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import groupLogsByField from "../../kpi-utils/group-by-field";
import formatDuration from "../../kpi-utils/format-duration";
import "./KPICard.css";

export default function DowntimeByWorkstationChart({logs}) {
    const data = useMemo(() => {
        return groupLogsByField(logs, "workstation");
    }, [logs]);
  
    return (
      <div className="kpi-card">
          <h3 className="header-center">Downtime by Workstation</h3>
          <hr />

          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                  <XAxis dataKey="Name" stroke="#e5e7eb"/>
                  <YAxis tickFormatter={(v) => Math.round(v / 3600000) + "h"} stroke="#e5e7eb"/>
                  <Tooltip formatter={(value) => formatDuration(value)} radius={[6, 6, 0, 0]}/>
                  <Bar dataKey="Downtime" fill="#0d6efd" />
              </BarChart>
          </ResponsiveContainer>
      </div>
    );
}