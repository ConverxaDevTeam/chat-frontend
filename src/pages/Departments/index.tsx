import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import DepartmentCard from "./DepartmentCard";
import DepartmentModal from "./DepartmentModal";
import { getDepartments } from "@services/department";
import PageContainer from "@components/PageContainer";
import { IDepartment } from "@interfaces/departments";
import { toast } from "react-toastify";

const Departments = () => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment>();

  const getAllDepartments = async () => {
    if (!selectOrganizationId) return;
    try {
      const response = await getDepartments(selectOrganizationId);
      if (response) {
        setDepartments(response);
      }
    } catch (error) {
      toast.error("Error al cargar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, [selectOrganizationId]);

  const handleOpenModal = (department?: IDepartment) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    getAllDepartments();
  };

  const handleDelete = async (id: number) => {
    setDepartments(prev => prev.filter(dep => dep.id !== id));
  };

  return (
    <PageContainer
      buttonText="+ Crear Departamento"
      onButtonClick={() => handleOpenModal()}
      loading={loading}
      appends={
        selectOrganizationId ? (
          <DepartmentModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
            department={selectedDepartment}
            organizationId={selectOrganizationId}
          />
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map(department => (
          <DepartmentCard
            key={department.id}
            department={department}
            onUpdate={() => handleOpenModal(department)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Departments;
