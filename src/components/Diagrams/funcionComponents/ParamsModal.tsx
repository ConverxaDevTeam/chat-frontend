import { Fragment, useState } from "react";
import Modal from "@components/Modal";
import {
  CreateFunctionParamDto,
  FunctionParam,
  ParamType,
} from "@interfaces/function-params.interface";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { paramsService } from "@services/params.service";
import { toast } from "react-toastify";

interface ParamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionData: {
    id: number;
    requestBody?: FunctionParam[];
  };
  params: FunctionParam[];
  setParams: (params: FunctionParam[]) => void;
}

export const ParamsModal = ({
  isOpen,
  onClose,
  functionData,
  params,
  setParams,
}: ParamsModalProps) => {
  const [showParamForm, setShowParamForm] = useState(false);
  const [editingParam, setEditingParam] = useState<FunctionParam | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParams = params.slice(startIndex, endIndex);
  const totalPages = Math.ceil(params.length / itemsPerPage);

  const handleAdd = () => {
    setEditingParam(null);
    setShowParamForm(true);
  };

  const handleEdit = (param: FunctionParam) => {
    setEditingParam(param);
    setShowParamForm(true);
  };

  const handleDelete = async (paramId: string) => {
    if (window.confirm("¿Está seguro de eliminar este parámetro?")) {
      try {
        setIsLoading(true);
        await paramsService.delete(functionData.id, paramId);
        toast.success("Parámetro eliminado exitosamente");
        // Actualizamos localmente
        setParams(params.filter(p => p.id !== paramId));
      } catch (error) {
        console.error("Error deleting param:", error);
        toast.error("Error al eliminar el parámetro");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (param: CreateFunctionParamDto) => {
    try {
      setIsLoading(true);
      if (editingParam) {
        const updatedParam = await paramsService.update(
          functionData.id,
          editingParam.id,
          param
        );
        // Actualizamos localmente
        setParams(
          params.map(p => (p.id === editingParam.id ? updatedParam : p))
        );
        toast.success("Parámetro actualizado exitosamente");
      } else {
        const newParam = await paramsService.create(
          param as FunctionParam,
          functionData.id
        );
        // Añadimos el nuevo parámetro localmente
        setParams([...params, newParam]);
        toast.success("Parámetro creado exitosamente");
      }
      setShowParamForm(false);
    } catch (error) {
      console.error("Error saving param:", error);
      toast.error("Error al guardar el parámetro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Parámetros de la Función ({params.length})
          </h2>
        </div>
      }
    >
      <Fragment>
        <div className="p-6 space-y-6">
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus size={16} />
            <span className="font-medium">
              Agregar Nuevo Parámetro ({params.length})
            </span>
          </button>

          <div className="grid gap-3">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando...</p>
              </div>
            ) : currentParams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay parámetros configurados</p>
                <p className="text-sm text-gray-400">
                  Haz clic en el botón superior para agregar uno nuevo
                </p>
              </div>
            ) : (
              currentParams.map(param => (
                <div
                  key={param.id}
                  className="grid grid-cols-[1fr,auto] gap-4 items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-100 transition-all duration-200 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">
                        {param.name}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        {param.type}
                      </span>
                    </div>
                    {param.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {param.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(param)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                      title="Editar parámetro"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(param.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      title="Eliminar parámetro"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {params.length > itemsPerPage && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {showParamForm && (
          <ParamFormModal
            isOpen={showParamForm}
            onClose={() => setShowParamForm(false)}
            param={editingParam}
            onSubmit={handleSubmit}
          />
        )}
      </Fragment>
    </Modal>
  );
};

interface ParamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  param?: FunctionParam | null;
  onSubmit: (param: CreateFunctionParamDto) => void;
}

const ParamFormModal = ({
  isOpen,
  onClose,
  param,
  onSubmit,
}: ParamFormModalProps) => {
  const [formData, setFormData] = useState<CreateFunctionParamDto>({
    name: param?.name || "",
    type: param?.type || ParamType.STRING,
    description: param?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {param ? "Editar" : "Añadir"} Parámetro
          </h2>
        </div>
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Nombre del parámetro"
              required
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={e =>
                setFormData({ ...formData, type: e.target.value as ParamType })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
              required
            >
              {Object.values(ParamType).map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
              placeholder="Describe el propósito de este parámetro"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              {param ? "Guardar" : "Añadir"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
