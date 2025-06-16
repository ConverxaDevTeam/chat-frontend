import React from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  totalItems?: number;
  maxPagesToShow?: number;
  itemsPerPage?: number;
  onChangeItemsPerPage?: (value: number) => void;
  rowsPerPageOptions?: number[];
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  goToPage,
  totalItems,
  maxPagesToShow = 5,
  itemsPerPage,
  onChangeItemsPerPage,
  rowsPerPageOptions = [5, 10, 20, 50],
}) => {
  if (totalPages <= 1 && !totalItems) return null;
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-[#F6F6F6] flex items-center py-3 px-4">
      <div className="flex justify-start items-center gap-4">
        
        {totalItems !== undefined && (
          <div className="text-sm font-normal text-sofia-superDark">
            Total <span className="font-bold">{totalItems}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
      {itemsPerPage && onChangeItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-sofia-superDark">Filas por página</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onChangeItemsPerPage(Number(e.target.value))}
              className="bg-[#F6F6F6] border border-sofia-superDark rounded p-1 text-sm font-normal min-w-[60px]"
            >
              {rowsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <img src="/mvp/chevron-left.svg" alt="Anterior" className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page ? 'bg-sofia-superDark text-sofia-blancoPuro font-normal' : 'hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
        </div>
        
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
