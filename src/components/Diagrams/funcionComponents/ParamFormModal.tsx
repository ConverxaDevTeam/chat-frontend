import Modal from "@components/Modal";
import {
  CreateFunctionParamDto,
  FunctionParam,
  ParamType,
} from "@interfaces/function-params.interface";
import { useParamForm } from "../hooks/useParamForm";

interface ParamFormModalProps {
  isShown: boolean;
  onClose: () => void;
  param?: FunctionParam | null;
  onSubmit: (param: CreateFunctionParamDto) => void;
}

export const ParamFormModal = ({
  isShown,
  onClose,
  param,
  onSubmit,
}: ParamFormModalProps) => {
  const { formData, handleInputChange, resetForm } = useParamForm(param);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
    onClose();
  };

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={
        <h2 className="text-xl font-semibold">
          {param ? "Editar Parámetro" : "Nuevo Parámetro"}
        </h2>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.values(ParamType).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="required"
            checked={formData.required}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Requerido</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {param ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
