import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import Select from "@components/Select";
import {
  setSelectedDepartmentId,
  fetchDepartments,
  clearSelectedDepartment,
} from "@store/reducers/department";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface SelectDepartmentProps {
  mobileResolution?: boolean;
}

const SelectDepartment: FC<SelectDepartmentProps> = ({ mobileResolution }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const { selectedDepartmentId, departments, loadingDepartments } = useSelector(
    (state: RootState) => state.department
  );
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { showConfirmation } = useAlertContext();

  useEffect(() => {
    if (selectOrganizationId) {
      dispatch(fetchDepartments(selectOrganizationId));
    } else {
      dispatch(clearSelectedDepartment());
    }
  }, [selectOrganizationId]);

  useEffect(() => {
    if (
      !loadingDepartments &&
      departments.length === 0 &&
      selectOrganizationId
    ) {
      showConfirmation({
        title: "No hay departamentos",
        text: "Es necesario crear un departamento para crear agentes",
        confirmButtonText: "Ir a departamentos",
        cancelButtonText: "Cancelar",
        onConfirm: async () => {
          navigate("/departments");
          return true;
        },
      });
    }
  }, [departments, loadingDepartments]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectDepartment = (departmentId: unknown) => {
    if (departmentId === selectedDepartmentId) {
      return;
    }
    dispatch(setSelectedDepartmentId(Number(departmentId)));
  };

  const options = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
  }));

  if (loadingDepartments || (!loadingDepartments && options.length === 0)) {
    return null;
  }

  return (
    <div ref={selectRef} className="w-[200px]">
      <Select
        value={selectedDepartmentId || undefined}
        onChange={handleSelectDepartment}
        options={options}
        placeholder="Seleccionar Departamento"
        mobileResolution={mobileResolution}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default SelectDepartment;
