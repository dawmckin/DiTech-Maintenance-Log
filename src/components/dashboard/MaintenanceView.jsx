import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import '../worklog-history/history-table.css';

import OpenIcon from "./../../assets/open-icon.svg";
import CompetedIcon from "./../../assets/completed-icon.svg";

import useSelectWorklogsByUser from "../../api/useSelectWorklogsByUser";

export default function MaintenanceView({userId}) {
    const logs = useSelectWorklogsByUser(userId);

    const navigate = useNavigate();

    const openWorklog = (ticketId) => {
        navigate(`/new-maintenance-log/ticket/${ticketId}`);
    }

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    //pagination
    useEffect(() => {
        setCurrentPage(1);
    }, []);

    //pagination logic
    const totalPages = Math.ceil(logs.length / pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [totalPages]);

    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return logs.slice(start, start + pageSize);
    }, [logs, currentPage, pageSize]);

    return (
        <div className="table-wrapper">
            <table className="maintenance-dashboard-table">
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>                            
                        <th className="text-center">
                            Status
                        </th>                            
                        <th></th>                            
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedLogs.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                                No results found
                            </td>
                        </tr>
                    ) : (
                        paginatedLogs.map((log) => {
                            return (
                                <tr key={log.ticket_id}>
                                    <td><strong>{log.ticket_id}</strong></td>
                                    <td className="align-middle text-center">
                                        <div className="status-tooltip">
                                            {log.issue_status === 'open'
                                                ? <img src={OpenIcon} className="pulse-icon" alt="Open" />
                                                : <img src={CompetedIcon} alt="Completed" />
                                            }
                                            <span className="status-tooltip-text">{log.issue_status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-stack">
                                            <span>{log.workstation_id} - {log.workstations.location_site.toUpperCase()}</span>
                                            <span>[ID: {log.equipment_id}] - {log.equipment.equipment_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className={`primary ${log.issue_status === 'open' ? 'edit' : 'view-only'} float-right text-center align-middle`}
                                                onClick={() => openWorklog(log.ticket_id)}
                                                style={{width: '3.5rem', height: '2.5rem', padding: '5px'}}>
                                            {
                                                (log.issue_status === 'open') ? (
                                                    <div className="d-flex justify-content-center mx-auto">
                                                        <i className="bi bi-pencil-square"></i>
                                                    </div>

                                                ) : (
                                                    <div className="d-flex justify-content-center mx-auto">
                                                        <i className="bi bi-eye"></i>
                                                    </div>
                                                )
                                            }
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <p>
                        Showing <strong>{(currentPage * pageSize) - (pageSize - 1)} - {(currentPage * pageSize) > logs.length ? logs.length : (currentPage * pageSize)}</strong> of
                        <strong> {logs.length}</strong> results
                    </p>
                    <div>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={page === currentPage ? "active" : ""}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                </div>
            )}   
        </div>

    )
}