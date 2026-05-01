import { useEffect, useState, useMemo } from "react";

export default function usePagination(data = [], pageSize = 8) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);

    useEffect(() => {
        if(currentPage > totalPages) {
            setCurrentPage(totalPages || 1)
        }
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize]);

    return {currentPage, setCurrentPage, paginatedData, totalPages};
}