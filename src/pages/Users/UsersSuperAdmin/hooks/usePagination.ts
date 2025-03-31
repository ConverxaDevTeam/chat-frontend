import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar la paginación
 * @param totalItems
 * @param itemsPerPage
 */
const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [items.length, totalPages, currentPage]);
  
  const paginatedItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };
  
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  return {
    currentPage,
    totalPages,
    paginatedItems: paginatedItems(),
    goToPage,
    setCurrentPage
  };
};

export default usePagination;
