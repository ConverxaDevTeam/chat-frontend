import { FC } from "react";
import { IDepartment } from "../../interfaces/departments";
import { toast } from "react-toastify";
import { useSweetAlert } from "../../hooks/useSweetAlert";
import CardItem from "../../components/Card/CardItem";
import { deleteDepartment } from "@services/department";
import DepartmentConfirmationModal from "./DepartmentConfirmationModal";

interface DepartmentCardProps {
  department: IDepartment;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

const DepartmentCard: FC<DepartmentCardProps> = ({
  department,
  onUpdate,
  onDelete,
}) => {
  const { showConfirmation, isOpen, modalOptions, handleConfirm, handleCancel } = useSweetAlert();

  const handleDelete = async () => {
    const confirmed = await showConfirmation({
      title: "¿Estás seguro de querer eliminar este departamento?",
      text: "Esta acción no se podrá deshacer",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      type: "department",
    });

    if (confirmed) {
      try {
        await deleteDepartment(department.id);
        onDelete(department.id);
        toast.success("Departamento eliminado exitosamente");
      } catch (error: any) {
        // const errorMessage = error?.response?.data?.message || error.message || "";
      if (error.response?.status === 500) {
        toast.error("Este departamento no se puede eliminar debido a que tiene agente asignado");
      } else {
        toast.error("Error al eliminar departamento");
      }
      }
    }
  };

  return (

    <div className="bg-[#f5faff] rounded-xl p-6 flex flex-col justify-between border-2 border-[#d3eafa] w-full min-h-[250px]">
      <div className="text-center">
        <CardItem label="">
          <h3 className="text-xl font-bold text-gray-900">{department.name}</h3>
        </CardItem>
        <CardItem label="">
          <p className="text-gray-500 font-bold">ID: {department.id}</p>
        </CardItem>
        <p className="text-gray-600  text-center mt-3">
          Responde preguntas de clientes de un marketplace de productos variados
          (electrónica, moda, hogar, y más) de forma clara.
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-1 text-gray-500 border-2 rounded-md text-sm font-semibold"
        >
          <span className="hidden sm:block">Eliminar</span>
        </button>
        <button
          onClick={onUpdate}
          className="w-full px-4 py-1 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
        >
          <span className="hidden sm:block">Editar</span>
        </button>
      </div>
      {modalOptions && (
        <DepartmentConfirmationModal
          isOpen={isOpen}
          title={modalOptions.title}
          text={modalOptions.text}
          confirmText={modalOptions.confirmButtonText}
          cancelText={modalOptions.cancelButtonText}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default DepartmentCard;
