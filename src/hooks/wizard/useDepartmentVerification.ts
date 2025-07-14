import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { getDepartments } from "@services/department";
import { IDepartment } from "@interfaces/departments";

export interface DepartmentVerificationResult {
  hasDepartments: boolean;
  needsDepartment: boolean;
  departments: IDepartment[];
  currentDepartment: IDepartment | null;
  loading: boolean;
  error: string | null;
}

export const useDepartmentVerification = (
  organizationId?: number
): DepartmentVerificationResult => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const orgId = organizationId || selectOrganizationId;

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!orgId) {
        // Si no hay organización, resetear estados
        setDepartments([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const departmentsData = await getDepartments(orgId);
        setDepartments(departmentsData || []);
      } catch (err) {
        setError("Error al cargar departamentos");
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [orgId]);

  const hasDepartments = departments.length > 0;
  const currentDepartment = hasDepartments ? departments[0] : null;
  // Si no hay orgId, no necesita departamento (paso anterior no completado)
  const needsDepartment = !orgId ? false : !hasDepartments;

  return {
    hasDepartments,
    needsDepartment,
    departments,
    currentDepartment,
    loading,
    error,
  };
};
