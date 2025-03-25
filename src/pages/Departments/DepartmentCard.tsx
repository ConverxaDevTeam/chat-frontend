import { FC } from "react";
import { IDepartment } from "../../interfaces/departments";
import { toast } from "react-toastify";
import CardItem from "../../components/Card/CardItem";
import { deleteDepartment } from "@services/department";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { useAppDispatch } from "@store/hooks";
import { removeDepartment } from "@store/reducers/department";

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
  const { showConfirmation } = useAlertContext();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
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
        onDelete(department.id);
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
    <div className="bg-[#F1F5F9] rounded-xl p-5 flex flex-col justify-between border-2 border-[#DBEAF2] w-full min-h-[250px]">
      <div className="text-center">
        <CardItem label="">
          <h3 className="text-xl font-bold text-gray-900">{department.name}</h3>
        </CardItem>
        <CardItem label="">
          <p className="text-[12px] 2xl:text-[12px] font-semibold text-app-gray">ID: {department.id}</p>
        </CardItem>
        <p className="text-gray-600 text-center mt-3 line-clamp-3">
          {department.description || "Sin descripción"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-1 text-gray-500 border-2 rounded-md text-sm font-semibold"
        >
          Eliminar
        </button>
        <button
          onClick={onUpdate}
          className="w-full px-4 py-1 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
