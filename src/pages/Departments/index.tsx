import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import DepartmentModal from "./DepartmentModal";
import DepartmentCard from "./DepartmentCard";
import { getDepartments, deleteDepartment } from "@services/department";
import PageContainer from "@components/PageContainer";
import { IDepartment } from "@interfaces/departments";
import { toast } from "react-toastify";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { useAppDispatch } from "@store/hooks";
import { removeDepartment } from "@store/reducers/department";

const Departments = () => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment>();
  const { showConfirmation } = useAlertContext();
  const dispatch = useAppDispatch();

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

  const handleDelete = async (department: IDepartment) => {
    const confirmed = await showConfirmation({
      title: "¿Estás seguro de querer eliminar este departamento?",
      text: "Esta acción no se podrá deshacer",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmed) {
      try {
        await deleteDepartment(department.id);
        dispatch(removeDepartment(department.id));
        setDepartments(prev => prev.filter(dep => dep.id !== department.id));
        toast.success("Departamento eliminado exitosamente");
      } catch (error: unknown) {
        if (
          (error as { response?: { status: number } })?.response?.status === 500
        ) {
          toast.error(
            "Este departamento no se puede eliminar debido a que tiene agente asignado"
          );
        } else {
          toast.error("Error al eliminar departamento");
        }
      }
    }
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
      <div className="w-full">
        <div className="w-full border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[16px] flex">
            <div className="w-[25%]">
              <div className="flex gap-[10px] items-center pl-[16px] ">
                <p className="font-medium leading-normal">Nombre</p>
                <img src="/mvp/arrow-down-up.svg" alt="Ordenar" className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[35%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Descripción</p>
                <img src="/mvp/arrow-down-up.svg" alt="Ordenar" className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">ID</p>
                <img src="/mvp/arrow-down-up.svg" alt="Ordenar" className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[10%]">
              <div className="flex gap-[10px] items-center justify-center">
                <p className="font-medium leading-normal">Visualizar</p>
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex gap-[10px] items-center justify-center">
                <p className="font-medium leading-normal">Acciones</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-app-lightGray shadow-sm">
            {departments.map(department => (
              <DepartmentCard
                key={department.id}
                department={department}
                onUpdate={() => handleOpenModal(department)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Departments;
