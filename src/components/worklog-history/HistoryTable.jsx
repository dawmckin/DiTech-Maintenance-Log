import { useEffect, useMemo, useState, Fragment } from "react";
import usePagination from "../../utils/usePagination";
import Pagination from "../util/Pagination";
import ExpandedRow from "./ExpandedRow";

import formatShift from "../../utils/format-shift";

import "./history-table.css";

import OpenIcon from "./../../assets/open-icon.svg";
import CompetedIcon from "./../../assets/completed-icon.svg";
import formatDuration from "../../utils/format-duration";

export default function HistoryTable({logs, search}) {
    //sorting configs
    const [sortConfig, setSortConfig] = useState({key: 'start_time', direction: "desc"});
    
    //search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    //expanded rows
    const [expandedRows, setExpandedRows] = useState(new Set());
    
    //search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    //handle col click sorting
    const handleSort = (key) => {
        // console.log(key);
        setSortConfig((prev) => {
            if(prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc"
                }
            }
            return {key, direction: "asc"};
        });
        // console.log(sortConfig);

        setCurrentPage(1);
    };

    //expanded rows
    const toggleRow = (id, status) => {
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

        return sortConfig.direction === 'asc' 
                    ? <i className="bi bi-caret-up-fill"></i> 
                    : <i className="bi bi-caret-down-fill"></i>;
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
                "created_by",
                "owner",
                'shift',
                'is_tooling_issue'
            ];
            const lowercasedSearch = debouncedSearch.toLowerCase();

            filtered = filtered.filter((log) =>
                searchableFields.some((field) => {
                    const value = (field === 'shift') ? log.start_time : log[field];

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

                    if(field === 'created_by' || field === 'owner') {
                        return String(value?.first_name).toLowerCase().includes(lowercasedSearch) || String(value?.last_name).toLowerCase().includes(lowercasedSearch);
                    }

                    if(field === 'shift') {
                        return formatShift(log.start_time).includes(lowercasedSearch);
                    }

                    return String(value).toLowerCase().includes(lowercasedSearch);
                })
            );
        }

        //apply column sort
        filtered.sort((a, b) => {
            const {key, direction} = sortConfig;
            // console.log(key, direction);

            let valueA;
            let valueB;

            switch (key) {
                case 'equipment':
                   valueA = a[key].plex_equipment_id;
                   valueB = b[key].plex_equipment_id;
                   break;
                case 'shift':
                    valueA = formatShift(a.start_time);
                    valueB = formatShift(b.start_time);
                    break;
                default:
                    valueA = a[key];
                    valueB = b[key];
                    break;
            }

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

    const pageSize = 10;
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
                            <th className="sortable" onClick={() => handleSort("start_time")}>
                                Start Time {getSortArrow("start_time")}
                            </th>
                            {/* <th className="sortable" onClick={() => handleSort("shift")}>
                                Shift {getSortArrow("shift")}
                            </th>                            */}
                            <th className="sortable" onClick={() => handleSort("shift")}>
                                Downtime {getSortArrow("shift")}
                            </th>  
                            <th className="sortable" onClick={() => handleSort("workstation_id")}>
                                Workstation {getSortArrow("workstation_id")}
                            </th>
                            <th className="sortable" onClick={() => handleSort("equipment")}>
                                Equipment {getSortArrow("equipment")}
                            </th>
                            <th className="sortable" onClick={() => handleSort("issue_type")}>
                                Issue Type {getSortArrow("issue_type")}
                            </th>
                            <th className="sortable" onClick={() => handleSort("end_time")}>
                                End Time {getSortArrow("end_time")}
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

                                return (
                                    <Fragment key={log.ticket_id}>
                                        <tr
                                            onClick={() => toggleRow(log.ticket_id, log.issue_status)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>
                                                <div className="d-flex justify-content-between">
                                                    <div><strong>{log.ticket_id}</strong></div>
                                                    <div className="ml-2"> 
                                                        {
                                                            (isExpanded) ? 
                                                                <i className="bi bi-chevron-up"></i> : 
                                                                <i className="bi bi-chevron-down"></i>
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
                                            <td>{new Date(log.start_time).toLocaleString()}</td>
                                            {/* <td>{formatShift(log.start_time)}</td> */}
                                            <td>
                                                {formatDuration(log.end_time 
                                                    ? new Date(log.end_time) - new Date(log.start_time) 
                                                    : new Date() - new Date(log.start_time)
                                                )}
                                            </td>
                                            <td>{log.workstation_id} - {log.workstations?.location_site?.toUpperCase()}</td>
                                            <td>[{log.equipment?.plex_equipment_id}] - {log.equipment.equipment_name}</td>
                                            <td>{log.issue_type}</td>
                                            <td>{log.end_time ? new Date(log.end_time).toLocaleString() : ""}</td>
                                        </tr>

                                        {(isExpanded) && (
                                            <ExpandedRow logData={{
                                                name: `${log.created_by.first_name} ${log.created_by.last_name}`,
                                                issue_description: log?.issue_description,
                                                start_time: log.start_time,
                                                end_time: log.end_time,
                                                is_tooling_issue: log.is_tooling_issue,
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