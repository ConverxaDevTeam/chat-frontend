import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import Select from "@components/Select";
import { getDepartments } from "@services/department";
import { IDepartment } from "@interfaces/departments";
import {
  setSelectedDepartmentId,
  clearSelectedDepartment,
} from "@store/reducers/department";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";

interface SelectDepartmentProps {
  mobileResolution?: boolean;
}

const SelectDepartment: FC<SelectDepartmentProps> = ({ mobileResolution }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const { selectedDepartmentId } = useSelector(
    (state: RootState) => state.department
  );
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectOrganizationId) return;
      try {
        const data = await getDepartments(selectOrganizationId);
        setDepartments(data);

        // Si hay departamentos y ninguno está seleccionado, seleccionar el primero
        if (data.length > 0 && !selectedDepartmentId) {
          dispatch(setSelectedDepartmentId(data[0].id));
        }
        // Si no hay departamentos, mostrar Swal
        else if (data.length === 0) {
          Swal.fire({
            title: "No hay departamentos",
            text: "Es necesario crear un departamento para continuar",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Ir a Departamentos",
            cancelButtonText: "Cancelar",
          }).then(result => {
            if (result.isConfirmed) {
              navigate("/departments");
            }
          });
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [selectOrganizationId]);

  // Clear selected department when organization changes
  useEffect(() => {
    dispatch(clearSelectedDepartment());
  }, [selectOrganizationId, dispatch]);

  const handleChange = async (id: unknown) => {
    dispatch(setSelectedDepartmentId(Number(id)));
  };

  const options = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
  }));

  return (
    <Select
      value={selectedDepartmentId || undefined}
      options={options}
      onChange={handleChange}
      placeholder="Seleccionar Departamento"
      mobileResolution={mobileResolution}
    />
  );
};

export default SelectDepartment;
