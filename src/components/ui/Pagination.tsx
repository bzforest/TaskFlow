import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export default function Pagination ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}: PaginationProps) {

    if (totalItems === 0 || totalPages <= 1) return null;

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i +1)
            // ไม่ค่อยเข้าใจสูตรตรงนี้ครับ เข้าใจความหมายแล้วว่าแสดงทั้งหมดถ้าไม่เกิน 5 แต่งงสูตร
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages -1, totalPages];
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const pages = getPageNumbers();

    return (
        <div className='mt-4 pt-4 border-t border-brand-grey-border dark:border-gray-800 flex items-center justify-center w-full pb-2'>

            <nav className='flex items-center gap-1' aria-label='Pagination'>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='flex items-center gap-1 h-9 px-3 sm:px-4 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer'
                >
                    <ChevronLeft size={16} /> <span className='hidden sm:inline'>Previous</span>
                </button>

                {pages.map((page , index) => {
                    if (page === '...') {
                        return (
                            <div key={`ellipsis-${index}`} className='flex h-9 w-9 items-center justify-center text-status-gray-text'>
                                <MoreHorizontal size={16} />
                            </div>
                        );
                    }

                    const isCurrentPage = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            className={clsx(
                                "h-9 w-9 rounded-md text-sm font-medium transition-colors flex items-center justify-center cursor-pointer",
                                isCurrentPage
                                ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='flex items-center gap-1 h-9 px-3 sm:px-4 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer'
                >
                    <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
                </button>
            </nav>

        </div>
    )
}