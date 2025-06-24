import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useAppDispatch } from "@store/hooks";
import {
  setSelectedDepartmentId,
  fetchDepartments,
  clearSelectedDepartment,
} from "@store/reducers/department";

interface DepartmentTabsProps {
  mobileResolution?: boolean;
  className?: string;
}

const DepartmentTabs: React.FC<DepartmentTabsProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const { selectedDepartmentId, departments, loadingDepartments } = useSelector(
    (state: RootState) => state.department
  );

  const visibleDepartments = 10;

  const { hiddenDepartmentIds } = useSelector(
    (state: RootState) => state.department
  );

  const filteredDepartments = departments.filter(
    department => !hiddenDepartmentIds.includes(department.id.toString())
  );

  useEffect(() => {
    if (selectOrganizationId) {
      dispatch(fetchDepartments(selectOrganizationId));
    } else {
      dispatch(clearSelectedDepartment());
    }
  }, [selectOrganizationId, dispatch]);

  const handleSelectDepartment = (departmentId: number) => {
    dispatch(setSelectedDepartmentId(departmentId));
  };

  const handleNext = () => {
    if (visibleIndex + visibleDepartments < departments.length) {
      setVisibleIndex(visibleIndex + visibleDepartments);
    }
  };

  const handlePrev = () => {
    if (visibleIndex - visibleDepartments >= 0) {
      setVisibleIndex(visibleIndex - visibleDepartments);
    }
  };

  if (!selectOrganizationId || loadingDepartments) {
    return null;
  }

  if (departments.length === 0) {
    return null;
  }

  const showNavButtons = filteredDepartments.length > visibleDepartments;

  const visibleDepartmentsList = filteredDepartments.slice(
    visibleIndex,
    visibleIndex + visibleDepartments
  );

  const hasNext =
    visibleIndex + visibleDepartments < filteredDepartments.length;
  const hasPrev = visibleIndex > 0;

  const getContainerWidth = () => {
    if (filteredDepartments.length <= 1) return "w-auto min-w-[50px]";
    if (filteredDepartments.length <= 3) return "w-auto min-w-[100px]";
    if (filteredDepartments.length <= 5) return "w-auto min-w-[150px]";
    if (filteredDepartments.length <= 8) return "w-auto min-w-[200px]";
    return "w-[560px]";
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`relative rounded-md overflow-hidden bg-[#E9E9E9] ${getContainerWidth()}`}
      >
        <div ref={containerRef} className="flex relative">
          {showNavButtons && hasPrev && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#E9E9E9] z-[999] flex items-center justify-center">
              <button
                onClick={handlePrev}
                className="rounded-full p-1 z-[9999]"
              >
                <img
                  src="/mvp/chevron-left.svg"
                  alt="Anterior"
                  className="w-4 h-4"
                />
              </button>
            </div>
          )}

          {showNavButtons && hasPrev && <div className="w-8"></div>}

          <div className="flex">
            {visibleDepartmentsList.map(department => (
              <button
                key={department.id}
                className={`px-1 py-1 text-sm font-medium bg-[#E9E9E9] text-[#343E4F]`}
                onClick={() => handleSelectDepartment(department.id)}
              >
                <span
                  className={`px-2 py-1 rounded max-w-[120px] inline-block ${selectedDepartmentId === department.id ? "bg-white" : ""}`}
                >
                  <span className="truncate block" title={department.name}>
                    {department.name}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {showNavButtons && hasNext && <div className="w-8"></div>}

          {showNavButtons && hasNext && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#E9E9E9] z-[999] flex items-center justify-center">
              <button
                onClick={handleNext}
                className="rounded-full p-1 z-[9999]"
              >
                <img
                  src="/mvp/chevron-right.svg"
                  alt="Siguiente"
                  className="w-4 h-4"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentTabs;
