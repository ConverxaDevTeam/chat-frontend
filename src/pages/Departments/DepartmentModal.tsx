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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {department ? "Editar" : "Nuevo"} Departamento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name", { required: "Nombre es requerido" })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del departamento"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del departamento"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sofia-electricGreen text-black rounded hover:bg-opacity-50 transition-all"
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
