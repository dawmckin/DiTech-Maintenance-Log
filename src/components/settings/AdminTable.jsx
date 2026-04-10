import { useEffect, useMemo, useState } from "react";

import "../worklog-history/history-table.css";

export default function AdminTable({view, rowData}) {
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
        <div>
            <table className="admin-table">
                <thead>
                    {
                        (view === 'users') ? (
                            <tr>
                                <th>DiTech ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>Created At</th>
                            </tr>
                        ) : (
                            (view === 'workstations') ? (
                                <tr>
                                    <th>Workstation ID</th>
                                    <th>Location</th>
                                    <th>Created At</th>
                                </tr> 
                            ) : (
                                <tr>
                                    <th>Equipment ID</th>
                                    <th>Equipment Name</th>
                                    <th>Workstation ID</th>
                                    <th>Created At</th>
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
                            else rowKey = row.equipment_id;

                            return (
                                <tr key={`${view}-${rowKey ?? 'no-id'}-${index}`}>
                                    {
                                        Object.keys(row).map(k => (
                                            <td key={k}>
                                                {(upperCaseFields.includes(k)) ? 
                                                    row[k].toUpperCase() : 
                                                    row[k]}
                                            </td>
                                        ))
                                    }
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
            )}   
        </div>
    )
}