import React from "react";
import { FiEdit, FiTrash2, FiTag } from "react-icons/fi";
import { FunctionTemplate } from "@interfaces/template.interface";

interface FunctionTemplateCardProps {
  template: FunctionTemplate;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, template: Partial<FunctionTemplate>) => Promise<void>;
}

const FunctionTemplateCard: React.FC<FunctionTemplateCardProps> = ({
  template,
  onDelete,
  onEdit,
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de eliminar este template?")) {
      await onDelete(template.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementación de edición - se podría abrir un modal específico
    onEdit(template.id, template);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {template.name}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs">
            {template.category?.name || "Sin categoría"}
          </span>
          {template.application && (
            <span className="ml-2 bg-purple-100 text-purple-800 py-1 px-2 rounded text-xs">
              {template.application.name}
            </span>
          )}
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {template.tags.slice(0, 3).map((tag, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                <FiTag size={12} className="mr-1" />
                {tag}
              </div>
            ))}
            {template.tags.length > 3 && (
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{template.tags.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionTemplateCard;
