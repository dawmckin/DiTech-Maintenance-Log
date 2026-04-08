import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import AdminView from "./AdminView";
import MaintenanceView from "./MaintenanceView";

export default function Dashboard() {
    const user = useAuth().user;

    const [range, setRange] = useState("week");

    return (
        <div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h2>Dashboard</h2>
                    <Link to="/new-maintenance-log">
                        <button className="primary log-action d-flex">
                            <i className="bi bi-plus-lg pr-2"></i>
                            <p className="mb-0">New Maintenance Log</p>    
                        </button>
                    </Link>
                </div>

                <hr/>
                <div className="row d-flex justify-content-between mb-2">
                    <div className="col-md-4 d-flex">
                        <p className="my-auto">Welcome <strong>{user?.user_metadata?.display_name}</strong>!</p>
                    </div>
                    {
                        user.user_metadata.user_role === 'admin' ? (
                            <div className="col-md-4 d-flex">
                                <p className="ml-auto mr-2 my-auto"><strong>View by:</strong></p>
                                <select className="col-md-9" value={range} onChange={(e) => setRange(e.target.value)}>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                    <option value="quarter-year">Last 3 Months</option>
                                    <option value="half-year">Last 6 Months</option>
                                    <option value="year">Last 12 Months</option>
                                </select>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }

                </div>
                {user.user_metadata.user_role === 'admin' ? (
                        <div>
                            <AdminView range={range}/>
                        </div>
                    ) : (
                        <div className="card">
                            <MaintenanceView userId={user.id}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
}