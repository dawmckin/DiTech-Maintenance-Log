import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";
import { useMemo } from "react";
import calculateKPIs from "../../kpi-utils/calculate-kpis";
import "./KPICard.css";

export default function IssueDistributionChart({logs}) {
    let data = useMemo(() => {
        return calculateKPIs(logs).issueCountByType;
    }, [logs]);

    return (
        <div className="kpi-card">
            <h3 className="header-center">Issue Distribution</h3>
            <hr />

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}    
                    >
                        {data.map((entry, index) => {
                            <Sector 
                                key={`cell-${index}`}
                                fill={entry.fill}
                            />
                        })}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} issues`, name]} itemStyle={{color: '#000'}} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}