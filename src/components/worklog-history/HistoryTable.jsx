import { useEffect, useMemo, useState, Fragment } from "react";
import usePagination from "../../utils/usePagination";
import Pagination from "../util/Pagination";
import ExpandedRow from "./ExpandedRow";
import "./history-table.css";
import OpenIcon from "./../../assets/open-icon.svg";
import CompetedIcon from "./../../assets/completed-icon.svg";

export default function HistoryTable({logs, toggle, search}) {
    //sorting configs
    const [sortConfig, setSortConfig] = useState({key: 'start_time', direction: "desc"});
    
    //search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    //expanded rows
    const [expandedRows, setExpandedRows] = useState(new Set());

    //sorting configs
    useEffect(() => {
        if(toggle === "date") {
            setSortConfig({
                key: 'start_time',
                direction: 'desc'
            });
        } else if(toggle === 'workstation') {
            setSortConfig({
                key: 'workstation_id',
                direction: 'asc'
            });
        }
    }, [toggle]);
    
    //search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    //handle col click sorting
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if(prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc"
                }
            }
            return {key, direction: "asc"};
        });

        setCurrentPage(1);
    };

    //expanded rows
    const toggleRow = (id, status) => {
        if(status !== 'completed') return;

        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if(newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    const getSortArrow = (column) => {
        if(sortConfig.key !== column) return null;

        return sortConfig.direction === 'asc' ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>;
    }

    //sorting logic
    const sortedLogs = useMemo(() => {
        let filtered = Array.isArray(logs) ? [...logs] : [];

        if(debouncedSearch) {
            const searchableFields = [
                "workstation_id",
                "workstations",
                "equipment",
                "issue_type",
                "ticket_id",
                "issue_status",
                "start_time",
                "end_time",
                "users"
            ];
            const lowercasedSearch = debouncedSearch.toLowerCase();

            console.log(filtered);
            filtered = filtered.filter((log) =>
                searchableFields.some((field) => {
                    const value = log[field];

                    if(value === null || value === undefined) return false;

                    if(field === "start_time" || field === "end_time") {
                        return new Date(value).toLocaleString().toLowerCase().includes(lowercasedSearch);
                    }

                    if(field === 'equipment') {
                        return String(value?.equipment_name).toLowerCase().includes(lowercasedSearch) || String(value?.plex_equipment_id).toLowerCase().includes(lowercasedSearch);
                    }

                    if(field === 'workstations') {
                        return String(value?.location_site).toLowerCase().includes(lowercasedSearch);
                    }

                    if(field === 'users') {
                        return String(value?.first_name).toLowerCase().includes(lowercasedSearch) || String(value?.last_name).toLowerCase().includes(lowercasedSearch);
                    }

                    return String(value).toLowerCase().includes(lowercasedSearch);
                })
            );
        }

        //apply column sort
        filtered.sort((a, b) => {
            const {key, direction} = sortConfig;

            let valueA = key !== 'equipment' ? a[key] : a[key].plex_equipment_id;
            let valueB = key !== 'equipment' ? b[key] : b[key].plex_equipment_id;

            if (valueA == null) return 1;
            if (valueB == null) return -1;

            if(key === 'start_time' || key === 'end_time') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            if(typeof valueA === 'string') {
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            return direction === 'asc' ? valueA - valueB : valueB - valueA;
        });

        return filtered;
    }, [logs, debouncedSearch, sortConfig]);

    const pageSize = 8;
    const {currentPage, setCurrentPage, paginatedData: paginatedLogs, totalPages} = usePagination(sortedLogs, pageSize);

    return (
        <>
            <div className="table-wrapper">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th className="sortable" onClick={() => handleSort("issue_status")}>
                                Status {getSortArrow("issue_status")}
                            </th>
                            {toggle === 'date' ? (
                                <>
                                    <th className="sortable" onClick={() => handleSort("start_time")}>
                                        Start Time {getSortArrow("start_time")}
                                    </th>
                                    <th className="sortable" onClick={() => handleSort("workstation_id")}>
                                        Workstation {getSortArrow("workstation_id")}
                                    </th>
                                    <th className="sortable" onClick={() => handleSort("equipment")}>
                                        Equipment {getSortArrow("equipment")}
                                    </th>
                                </>
                            ) : (
                                <>
                                    <th className="sortable" onClick={() => handleSort("workstation_id")}>
                                        Workstation {getSortArrow("workstation_id")}
                                    </th>
                                    <th className="sortable" onClick={() => handleSort("equipment")}>
                                        Equipment {getSortArrow("equipment")}
                                    </th>
                                    <th className="sortable" onClick={() => handleSort("start_time")}>
                                        Start Time {getSortArrow("start_time")}
                                    </th>
                                </>
                            )}
                            <th className="sortable" onClick={() => handleSort("end_time")}>
                                End Time {getSortArrow("end_time")}
                            </th>                           
                            <th className="sortable" onClick={() => handleSort("issue_type")}>
                                Issue Type {getSortArrow("issue_type")}
                            </th>
                            <th>
                                Issue Description
                            </th>
                        </tr> 
                    </thead>

                    <tbody>
                        {paginatedLogs?.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "16px" }}>
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            paginatedLogs?.map((log) => {
                                const isExpanded = expandedRows.has(log.ticket_id);
                                const expandable = log.notes?.length > 0 && log.issue_status === 'completed';

                                return (
                                    <Fragment key={log.ticket_id}>
                                        <tr
                                            onClick={() => toggleRow(log.ticket_id, log.issue_status)}
                                            style={{
                                                cursor: (expandable) ? "pointer" : "default"
                                            }}
                                        >
                                            <td>
                                                <div className="d-flex justify-content-between">
                                                    <div><strong>{log.ticket_id}</strong></div>
                                                    <div className="ml-2"> 
                                                        {expandable ? 
                                                            (isExpanded) ? 
                                                                <i className="bi bi-chevron-up"></i> : 
                                                                <i className="bi bi-chevron-down"></i> :
                                                            <span></span>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <div className="status-tooltip">
                                                    {log.issue_status === 'open'
                                                        ? <img src={OpenIcon} className="pulse-icon" alt="Open" />
                                                        : <img src={CompetedIcon} alt="Completed" />
                                                    }
                                                    <span className="status-tooltip-text">{log.issue_status.toUpperCase()}</span>
                                                </div>
                                            </td>

                                            {toggle === 'date' ? (
                                                <>
                                                    <td>{new Date(log.start_time).toLocaleString()}</td>
                                                    <td>{log.workstation_id} - {log.workstations?.location_site?.toUpperCase()}</td>
                                                    <td>[{log.equipment?.plex_equipment_id}] - {log.equipment.equipment_name}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{log.workstation_id} - {log.workstations?.location_site?.toUpperCase()}</td>
                                                    <td>[{log.equipment?.plex_equipment_id}] - {log.equipment.equipment_name}</td>
                                                    <td>{new Date(log.start_time).toLocaleString()}</td>
                                                </>
                                            )}

                                            <td>{log.end_time ? new Date(log.end_time).toLocaleString() : ""}</td>
                                            <td>{log.issue_type}</td>
                                            <td>{log.issue_description}</td>
                                        </tr>

                                        {(isExpanded && expandable) && (
                                            <ExpandedRow logData={{
                                                name: `${log.users.first_name} ${log.users.last_name}`,
                                                start_time: log.start_time,
                                                end_time: log.end_time,
                                                notes: log.notes 
                                            }} colSpan={8} isExpanded={isExpanded} />
                                        )}
                                    </Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
                totalItems={sortedLogs.length} 
                pageSize={pageSize}
            />
        </>

    );

}