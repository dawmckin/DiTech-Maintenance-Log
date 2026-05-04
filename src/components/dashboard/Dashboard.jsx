import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import AdminView from "./AdminView";
import MaintenanceView from "./MaintenanceView";

export default function Dashboard() {
    const user = useAuth().user;

    const navigate = useNavigate();

    const [refreshKey, setRefreshKey] = useState(0);
    const [range, setRange] = useState("week");

    const openNewWorklog = () => {
        navigate("/new-maintenance-log");
    }

    return (
        <div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h2>Dashboard</h2>
                    {/* <button className="primary log-action d-flex" disabled={user.user_metadata.user_role !== 'admin'} */}
                    <button className="primary log-action d-flex"
                            onClick={() => openNewWorklog()}>
                        <i className="bi bi-plus-lg pr-2"></i>
                        <p className="mb-0">Worklog</p>    
                    </button>
                </div>

                <hr/>
                
                <div className="row align-items-center mb-2">
                    <div className="col d-flex">
                        <p className="welcome-user my-auto">Welcome <strong>{user?.user_metadata?.display_name}</strong>!</p>
                    </div>
                    {
                        user.user_metadata.user_role !== 'admin' ? 
                        (
                            <div className="col-auto d-flex">
                                <button className="primary ml-auto"
                                        onClick={() => setRefreshKey(prev => prev + 1)}
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        ) : 
                        (
                            <div className="col-md-8 d-flex">
                                <select className="col-md-4 ml-auto" value={range} onChange={(e) => setRange(e.target.value)}>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                    <option value="quarter-year">Last 3 Months</option>
                                    <option value="half-year">Last 6 Months</option>
                                    <option value="year">Last 12 Months</option>
                                </select>
                            </div>
                        )
                    }
                </div>      
                {user.user_metadata.user_role === 'admin' ? (
                        <div>
                            <AdminView range={range}/>
                        </div>
                    ) : (
                        <div className="card">
                            <MaintenanceView userId={user.id} refreshKey={refreshKey}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
}