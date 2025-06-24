import { useState, useEffect } from "react";

/**
 * Hook personalizado para gestionar la paginación
 * @param items
 * @param defaultItemsPerPage
 */
const usePagination = <T>(items: T[], defaultItemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const totalItems = items.length;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [items.length, totalPages, currentPage, itemsPerPage]);

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

  const handleChangeItemsPerPage = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedItems: paginatedItems(),
    goToPage,
    setCurrentPage,
    handleChangeItemsPerPage,
  };
};

export default usePagination;
