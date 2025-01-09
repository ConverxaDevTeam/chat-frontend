import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import DepartmentCard from "./DepartmentCard";
import Table from "@components/Table/Table";
import TableHeader from "@components/Table/TableHeader";
import DepartmentModal from "./DepartmentModal";
import { getDepartments } from "@services/department";
import PageContainer from "@components/PageContainer";
import { IDepartment } from "@interfaces/departments";
import { toast } from "react-toastify";

const columns = [
  { key: "id", label: "ID", width: "w-[calc(100%/24*6)]" },
  { key: "name", label: "Nombre", width: "w-[calc(100%/24*6)]" },
  { key: "description", label: "Descripción", width: "w-[calc(100%/24*6)]" },
  { key: "actions", label: "Acciones", width: "w-[calc(100%/24*6)]" },
];

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
      title="Departamentos"
      buttonText="Nuevo Departamento"
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
      <Table>
        <TableHeader columns={columns} />
        <tbody>
          {departments.map(department => (
            <DepartmentCard
              key={department.id}
              department={department}
              onUpdate={() => handleOpenModal(department)}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default Departments;
