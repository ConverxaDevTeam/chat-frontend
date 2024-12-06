import { FunctionParam } from "@interfaces/function-params.interface";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ParamListProps {
  params: FunctionParam[];
  onEdit: (param: FunctionParam, index: number) => void;
  onDelete: (index: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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
      <div className="space-y-2">
        {currentParams.map((param, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
              <span className="font-semibold">{param.name}</span>
              <span className="text-sm text-gray-500 ml-2">({param.type})</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(param, startIndex + index)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(startIndex + index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};
