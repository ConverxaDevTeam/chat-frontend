import React from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  totalItems?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  goToPage,
  totalItems,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  return (
    <div className="bg-[#F6F6F6] flex items-center py-3 px-4">
      <div className="flex justify-start items-start">
        {totalItems !== undefined && (
          <div className="text-sm font-normal text-gray-600">
            Total <span className="font-semibold">{totalItems}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <img src="/mvp/chevron-left.svg" alt="Anterior" className="w-5 h-5" />
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <img
            src="/mvp/chevron-right.svg"
            alt="Siguiente"
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
