import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IDepartment } from "../../interfaces/departments";
import { createDepartment, updateDepartment } from "@services/department";
import { useAppDispatch } from "@store/hooks";
import {
  addDepartment,
  updateDepartmentInStore,
} from "@store/reducers/department";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (department: IDepartment) => void;
  department?: IDepartment;
  organizationId: number;
}

interface FormInputs {
  name: string;
  description: string;
}

const DepartmentModal: FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  department,
  organizationId,
}) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (isOpen && department) {
      setValue("name", department.name);
      setValue("description", department.description || "");
    } else {
      reset({ name: "", description: "" });
    }
  }, [isOpen, department, setValue, reset]);

  const handleClose = () => {
    reset({ name: "", description: "" });
    onClose();
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      const result = department
        ? await updateDepartment(department.id, data.name, data.description)
        : await createDepartment(organizationId, data.name, data.description);

      if (!department) {
        dispatch(addDepartment(result));
      } else {
        dispatch(updateDepartmentInStore(result));
      }

      onSuccess({ ...department, ...result });
      toast.success(
        `Departamento ${department ? "actualizado" : "creado"} exitosamente`
      );
      handleClose();
    } catch (error) {
      toast.error(
        `Error al ${department ? "actualizar" : "crear"} departamento`
      );
    }
  };

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-[4px] p-6 w-full max-w-md relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-7 right-7 text-gray-900 hover:text-gray-600 font-semibold"
        >
          <img src="/mvp/vector-x.svg" alt="Cerrar" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {department ? "Editar" : "Nuevo"} departamento
        </h2>
        <hr className="border-t border-gray-150 mb-4 -mx-6" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre
            </label>
            <input
              {...register("name", { required: "Nombre es requerido" })}
              className="w-full p-3 border rounded-[4px] focus:outline-none mb-2"
              placeholder="Nombre del departamento"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Descripción
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border rounded-[4px] focus:outline-none"
              rows={4}
              placeholder="Ingrese una descripción para el departamento"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-full p-4 mt-5 bg-[#001130] text-white rounded-[4px] text-base font-normal transition-all leading-none"
            >
              {department ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
