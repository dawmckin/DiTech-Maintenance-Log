export default function Pagination({currentPage, totalPages, onPageChange, totalItems, pageSize}) {
    if(totalPages <=1) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="pagination">
            <p>
                Showing <strong>{start} - {end}</strong> of
                <strong> {totalItems}</strong> results
            </p>

            <div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={page === currentPage ? "active" : ""}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}                       
            </div>
        </div>
    )
}