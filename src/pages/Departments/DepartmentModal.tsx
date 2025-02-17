import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IDepartment } from "../../interfaces/departments";
import { createDepartment, updateDepartment } from "@services/department";

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

      onSuccess(result);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-7 right-7 text-gray-900 hover:text-gray-600 font-semibold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">
          {department ? "Editar" : "Nuevo"} departamento
        </h2>
        <hr className="border-t border-gray-300 mb-4" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {department && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">ID</label>
              <input
                type="text"
                value={department.id}
                disabled
                className="w-full p-3 border text-gray-400 rounded-lg cursor-not-allowed"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              {...register("name", { required: "Nombre es requerido" })}
              className="w-full p-3 border rounded-lg focus:outline-none  focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Nombre del departamento"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
            <input className="w-full p-3 border text-gray-400 rounded-lg cursor-not-allowed mb-2"
              placeholder="Descripción"
              disabled
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-full px-4 py-3 mt-5 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
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
