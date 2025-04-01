import React from 'react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  goToPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center py-3 px-4">
      <div className="flex gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <img src="/mvp/chevron-left.svg" alt="Anterior" className="w-5 h-5" />
        </button>
        <span className="flex items-center text-sm text-gray-600">
          {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <img src="/mvp/chevron-right.svg" alt="Siguiente" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
