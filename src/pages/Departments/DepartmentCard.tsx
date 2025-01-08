import { FC } from "react";
import { IDepartment } from "../../interfaces/departments";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSweetAlert } from "../../hooks/useSweetAlert";
import TableCell from "../../components/Table/TableCell";
import { convertISOToReadable } from "../../utils/format";
import { deleteDepartment } from "@services/department";

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
  const { showConfirmation } = useSweetAlert();

  const handleDelete = async () => {
    const confirmed = await showConfirmation({
      title: "Eliminar Departamento",
      text: "¿Estás seguro de eliminar este departamento?",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmed) {
      try {
        await deleteDepartment(department.id);
        onDelete(department.id);
        toast.success("Departamento eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar departamento");
      }
    }
  };

  return (
    <tr className="h-[60px] text-[14px] border-b-[1px] hover:bg-gray-50">
      <TableCell width="w-[calc(100%/24*6)]">{department.id}</TableCell>
      <TableCell width="w-[calc(100%/24*10)]">{department.name}</TableCell>
      <TableCell width="w-[calc(100%/24*6)]">
        {convertISOToReadable(department.created_at)}
      </TableCell>
      <TableCell width="w-[calc(100%/24*2)]">
        <div className="flex gap-2 justify-end">
          <button
            onClick={onUpdate}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <FiTrash2 />
          </button>
        </div>
      </TableCell>
    </tr>
  );
};

export default DepartmentCard;
