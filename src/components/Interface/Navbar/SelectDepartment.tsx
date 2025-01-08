import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store";
import Select from "@components/Select";
import { getDepartments } from "@services/department";
import { IDepartment } from "@interfaces/departments";
import {
  setSelectedDepartmentId,
  clearSelectedDepartment,
} from "@store/reducers/department";

interface SelectDepartmentProps {
  mobileResolution?: boolean;
}

const SelectDepartment: FC<SelectDepartmentProps> = ({ mobileResolution }) => {
  const dispatch = useDispatch();
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

  const handleChange = (id: number) => {
    dispatch(setSelectedDepartmentId(id));
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
