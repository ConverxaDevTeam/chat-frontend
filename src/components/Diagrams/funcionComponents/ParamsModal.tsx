import { Fragment, useState } from "react";
import Modal from "@components/Modal";
import { FunctionParam } from "@interfaces/function-params.interface";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface ParamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params?: FunctionParam[];
  onParamAdd?: (param: FunctionParam) => void;
  onParamEdit?: (param: FunctionParam) => void;
  onParamDelete?: (paramId: string) => void;
}

export const ParamsModal = ({
  isOpen,
  onClose,
  params = [],
  onParamAdd,
  onParamEdit,
  onParamDelete,
}: ParamsModalProps) => {
  const [showParamForm, setShowParamForm] = useState(false);
  const [editingParam, setEditingParam] = useState<FunctionParam | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Parámetros de la Función</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            <FaPlus size={12} />
            Añadir
          </button>
        </div>
      }
    >
      <Fragment>
        <div className="space-y-4">
          {/* Lista de parámetros */}
          <div className="space-y-2">
            {currentParams.map(param => (
              <div
                key={param.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <h3 className="font-medium">{param.name}</h3>
                  <p className="text-sm text-gray-600">{param.description}</p>
                  <span className="text-xs text-gray-500">{param.type}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(param)}
                    className="p-1 text-gray-600 hover:text-primary-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => onParamDelete?.(param.id!)}
                    className="p-1 text-gray-600 hover:text-red-500"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal de formulario de parámetro */}
        {showParamForm && (
          <ParamFormModal
            isOpen={showParamForm}
            onClose={() => setShowParamForm(false)}
            param={editingParam}
            onSubmit={param => {
              if (editingParam) {
                onParamEdit?.({ ...param, id: editingParam.id });
              } else {
                onParamAdd?.(param);
              }
              setShowParamForm(false);
            }}
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
  onSubmit: (param: FunctionParam) => void;
}

const ParamFormModal = ({
  isOpen,
  onClose,
  param,
  onSubmit,
}: ParamFormModalProps) => {
  const [formData, setFormData] = useState<FunctionParam>({
    name: param?.name || "",
    type: param?.type || "",
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
        <h2 className="text-lg font-semibold">
          {param ? "Editar" : "Añadir"} Parámetro
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
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
          >
            {param ? "Guardar" : "Añadir"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
