import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import usePagination from "../../utils/usePagination";
import Pagination from "../util/Pagination";

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

    const pageSize = 8;
    const {currentPage, setCurrentPage, paginatedData: paginatedLogs, totalPages} = usePagination(logs, pageSize);

    return (
        <>
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
                        {paginatedLogs?.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            paginatedLogs?.map((log) => {
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
                                                <span>[{log.equipment?.ditech_equipment_id}] - {log.equipment.equipment_name}</span>
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
            </div>
            
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
                totalItems={logs.length} 
                pageSize={pageSize}
            />
        </>


    )
}