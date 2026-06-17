import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState, forwardRef, useEffect } from "react";
import groupLogsByField from "../../utils/group-by-field";
import formatDuration from "../../utils/format-duration";
import "./KPICard.css";

const DowntimeByWorkstationChart = forwardRef(({logs, locationSite = 'walnut'}, ref) => {
    const [location, setLocation] = useState('walnut');

    useEffect(() => setLocation(locationSite), [locationSite]);

    const data = useMemo(() => {
        return groupLogsByField(logs, "workstation_id");
    }, [logs]);

    const filteredData = useMemo(() => {
        return data.filter(log => log.Location === location);
    }, [location, data]);
  
    return (
        <div className="kpi-card" ref={ref}>
            <div className="card-header">
                <h3 className="">Downtime by Workstation</h3>

                <div className="location-filter">
                    <label>
                        <input
                        type="radio"
                        name="location"
                        value="main"
                        checked={location === "main"}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                        Main St
                    </label>

                    <label className="ms-2">
                        <input
                        type="radio"
                        name="location"
                        value="walnut"
                        checked={location === "walnut"}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                        Walnut St
                    </label>
                </div>
            </div>
          
            <hr />

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                    <XAxis dataKey="Name" stroke="#e5e7eb"/>
                    <YAxis tickFormatter={(v) => Math.round(v / 3600000) + "h"} stroke="#e5e7eb"/>
                    <Tooltip formatter={(value) => formatDuration(value)} radius={[6, 6, 0, 0]}  itemStyle={{color: '#000'}} />
                    <Bar dataKey="Downtime" fill="#22c55e" radius={[6, 6, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
})

export default DowntimeByWorkstationChart;