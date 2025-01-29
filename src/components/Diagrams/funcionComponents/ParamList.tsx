import { FunctionParam } from "@interfaces/function-params.interface";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DataListItem } from "@components/common/DataList";

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
  <DataListItem
    fields={[
      {
        label: "Nombre",
        value: param.name,
      },
      {
        label: "Tipo",
        value: param.type,
      },
      ...(param.description
        ? [
            {
              label: "Descripción",
              value: param.description,
            },
          ]
        : []),
    ]}
    actions={
      <>
        <button
          onClick={onEdit}
          className="text-sofia-superDark hover:text-sofia-electricGreen"
          title="Editar parámetro"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={onDelete}
          className="text-sofia-superDark hover:text-sofia-electricGreen"
          title="Eliminar parámetro"
        >
          <FaTrash size={16} />
        </button>
      </>
    }
  />
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
  <div className="grid gap-4">
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
