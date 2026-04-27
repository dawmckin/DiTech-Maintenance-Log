import { useEffect, useMemo, useState } from "react";

import formatDateTime from "../../utils/format-date-time";

import "../worklog-history/history-table.css";

export default function AdminTable({view, rowData, onEdit, onDelete}) {
    const upperCaseFields = ['location_site', 'user_role'];

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [view]);

    const totalPages = Math.ceil(rowData.length / pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [totalPages]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return rowData.slice(start, start + pageSize);
    }, [rowData, currentPage, pageSize]);

    return (
        <div className="table-wrapper">
            <table className="admin-table">
                <thead>
                    {
                        (view === 'users') ? (
                            <tr>
                                <th>DiTech ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th></th>
                            </tr>
                        ) : (
                            (view === 'workstations') ? (
                                <tr>
                                    <th>Workstation ID</th>
                                    <th>Location</th>
                                    <th>Created At</th>
                                    <th></th>
                                </tr> 
                            ) : (
                                <tr>
                                    <th>Ditech Equipment ID</th>
                                    <th>Asset Number</th>
                                    <th>Equipment Name</th>
                                    <th>Workstation ID</th>
                                    <th>Created At</th>
                                    <th></th>
                                </tr>
                            )
                        )
                    }
                </thead>
                <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                                No results found
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row, index) => {
                            let rowKey;

                            if(view === 'users') rowKey = row.ditech_id;
                            else if(view === 'workstations') rowKey = row.workstation_id;
                            else rowKey = row.ditech_equipment_id;

                            return (
                                <tr key={`${view}-${rowKey ?? 'no-id'}-${index}`}>
                                    {
                                        Object.keys(row).map(k => (
                                            (k !== 'user_id') ? 
                                                (
                                                   <td key={k}>
                                                        {
                                                            (k === 'created_at') ? 
                                                            (
                                                                formatDateTime(row[k])
                                                            ) : 
                                                            (
                                                                (upperCaseFields.includes(k)) ? 
                                                                    row[k].toUpperCase() : 
                                                                    row[k]
                                                            )
                                                        }
                                                    </td>  
                                                ) : (
                                                    <></>
                                                )
                                           
                                        ))
                                    }
                                    <td>
                                        <div className="float-right">
                                            <button className="primary log-action edit mb-0 mr-2"
                                                onClick={() => onEdit(row)}
                                                style={{width: '6rem', maxHeight: '2rem', padding: '5px 9px'}}>
                                                <i className="bi bi-pencil-square pr-2"></i>
                                                Edit
                                            </button>
                                            <button className="primary log-action cancel mb-0 mr-2"
                                                onClick={() => onDelete(row)}
                                                style={{width: '6rem', maxHeight: '2rem', padding: '5px 9px'}}>
                                                {
                                                    (view === 'users') ? 
                                                    (
                                                        <>
                                                            <i className="bi bi-slash-circle pr-2"></i>
                                                            Disable
                                                        </>
                                                    ) : 
                                                    (
                                                        <>
                                                            <i className="bi bi-trash3 pr-2"></i>
                                                            Delete
                                                        </>
                                                    )
                                                }
                                            </button> 
                                        </div>
                                   
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
                        Showing <strong>{(currentPage * pageSize) - (pageSize - 1)} - {(currentPage * pageSize) > rowData.length ? rowData.length : (currentPage * pageSize)}</strong> of
                        <strong> {rowData.length}</strong> results
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