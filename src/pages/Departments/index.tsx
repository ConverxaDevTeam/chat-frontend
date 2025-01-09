import { useEffect, FC, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import DepartmentCard from "./DepartmentCard";
import { IDepartment } from "../../interfaces/departments";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Table from "../../components/Table/Table";
import TableHeader from "../../components/Table/TableHeader";
import DepartmentModal from "./DepartmentModal";
import { getDepartments } from "@services/department";

const columns = [
  { key: "id", label: "ID", width: "w-[calc(100%/24*6)]" },
  { key: "name", label: "Nombre", width: "w-[calc(100%/24*10)]" },
  { key: "created_at", label: "Fecha Creación", width: "w-[calc(100%/24*6)]" },
  { key: "actions", label: "Acciones", width: "w-[calc(100%/24*2)]" },
];

const Departments: FC = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    IDepartment | undefined
  >();
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchDepartments = async () => {
    if (!selectOrganizationId) return;
    setLoading(true);
    try {
      const data = await getDepartments(selectOrganizationId);
      setDepartments(data);
    } catch (error) {
      toast.error("Error al cargar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [selectOrganizationId]);

  const handleOpenModal = (department?: IDepartment) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(undefined);
    setIsModalOpen(false);
  };

  const handleSuccess = (department: IDepartment) => {
    if (selectedDepartment) {
      setDepartments(prev =>
        prev.map(dep => (dep.id === department.id ? department : dep))
      );
    } else {
      setDepartments(prev => [...prev, department]);
    }
  };

  const handleDelete = (id: number) => {
    setDepartments(prev => prev.filter(dep => dep.id !== id));
  };

  if (!selectOrganizationId) {
    return <div>Selecciona una organización</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiPlus /> Nuevo Departamento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <p>Cargando...</p>
        </div>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        department={selectedDepartment}
        organizationId={selectOrganizationId}
      />
    </div>
  );
};

export default Departments;
