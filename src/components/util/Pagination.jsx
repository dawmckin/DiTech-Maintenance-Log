export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize
}) {
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    // how many page buttons to show around current
    const pageWindow = 0;

    const getPageNumbers = () => {
        const pages = [];

        const startPage = Math.max(1, currentPage - pageWindow);
        const endPage = Math.min(totalPages, currentPage + pageWindow);

        // Always include first page
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("start-ellipsis");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Always include last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push("end-ellipsis");
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination">
            <p>
                Showing <strong>{start} - {end}</strong> of
                <strong> {totalItems}</strong> results
            </p>

            <div className="d-flex align-items-center gap-1 flex-wrap">

                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-chevron-double-left"></i>
                </button>

                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                {/* Page Numbers */}
                {
                    pages.map((page, idx) => {
                        if (page === "start-ellipsis" || page === "end-ellipsis") {
                            return <span key={`${page}-${idx}`} style={{ padding: "0 6px" }}>...</span>;
                        }

                        return (
                            <button
                                key={`page-${page}-${idx}`}
                                className={page === currentPage ? "active" : ""}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        );
                    })
                }

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <i className="bi bi-chevron-double-right"></i>
                </button>
            </div>
        </div>
  );
}