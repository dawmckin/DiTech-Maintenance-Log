import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, forwardRef } from "react";
import groupLogsByField from "../../utils/group-by-field";
import formatDuration from "../../utils/format-duration";
import "./KPICard.css";

const DowntimeByIssueTypeChart = forwardRef(({logs}, ref) => {
    const data = useMemo(() => {
        return groupLogsByField(logs, "issue_type");
    }, [logs]);

    return (
        <div className="kpi-card" ref={ref}>
            <h3 className="header-center">Downtime by Issue Type</h3>
            <hr />

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="20%">
                    <XAxis dataKey="Name" stroke="#e5e7eb"/>
                    <YAxis  tickFormatter={(v) => Math.round(v / (1000 * 60 * 60)) + "h"} stroke="#e5e7eb"/>
                    <Tooltip formatter={(v) => formatDuration(v)} radius={[6, 6, 0, 0]}  itemStyle={{color: '#000'}} />
                    <Bar dataKey="Downtime" fill="#22c55e" radius={[6, 6, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
});

export default DowntimeByIssueTypeChart;

// export default function DowntimeByIssueTypeChart({logs}) {
//     const data = useMemo(() => {
//         return groupLogsByField(logs, "issue_type");
//     }, [logs]);

//     return (
//         <div className="kpi-card">
//             <h3 className="header-center">Downtime by Issue Type</h3>
//             <hr />

//             <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={data} barCategoryGap="20%">
//                     <XAxis dataKey="Name" stroke="#e5e7eb"/>
//                     <YAxis  tickFormatter={(v) => Math.round(v / (1000 * 60 * 60)) + "h"} stroke="#e5e7eb"/>
//                     <Tooltip formatter={(v) => formatDuration(v)} radius={[6, 6, 0, 0]}  itemStyle={{color: '#000'}} />
//                     <Bar dataKey="Downtime" fill="#22c55e" radius={[6, 6, 0, 0]}/>
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     )
// }