import { FunctionParam } from "@interfaces/function-params.interface";
import { FaEdit, FaTrash } from "react-icons/fa";

// Types
interface ParamListProps {
  params: FunctionParam[];
  onEdit: (param: FunctionParam, index: number) => void;
  onDelete: (index: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ParamItemProps {
  param: FunctionParam;
  onEdit: () => void;
  onDelete: () => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Param Item Component
const ParamItem = ({ param, onEdit, onDelete }: ParamItemProps) => (
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
    <div>
      <span className="font-semibold">{param.name}</span>
      <span className="text-sm text-gray-500 ml-2">({param.type})</span>
      {param.description && (
        <p className="text-sm text-gray-600 mt-1">{param.description}</p>
      )}
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-1 text-blue-600 hover:text-blue-800"
        title="Editar parámetro"
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="p-1 text-red-600 hover:text-red-800"
        title="Eliminar parámetro"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

// Param List Component
const ParamListContent = ({
  params,
  startIndex,
  onEdit,
  onDelete,
}: {
  params: FunctionParam[];
  startIndex: number;
  onEdit: (param: FunctionParam, index: number) => void;
  onDelete: (index: number) => void;
}) => (
  <div className="space-y-2">
    {params.map((param, index) => (
      <ParamItem
        key={`${param.name}-${index}`}
        param={param}
        onEdit={() => onEdit(param, startIndex + index)}
        onDelete={() => onDelete(startIndex + index)}
      />
    ))}
  </div>
);

// Main Component
export const ParamList = ({
  params,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
}: ParamListProps) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParams = params.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <ParamListContent
        params={currentParams}
        startIndex={startIndex}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
