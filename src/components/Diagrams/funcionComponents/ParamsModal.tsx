import { useState } from "react";
import Modal from "@components/Modal";
import {
  FunctionParam,
  CreateFunctionParamDto,
} from "@interfaces/function-params.interface";
import { FaPlus } from "react-icons/fa";
import { ParamList } from "./ParamList";
import { ParamFormModal } from "./ParamFormModal";
import { useParamManagement } from "../hooks/useParamManagement";

interface ParamsModalProps {
  isShown: boolean;
  onClose: () => void;
  functionData: {
    id: number;
    requestBody?: FunctionParam[];
  };
  params: FunctionParam[];
  setParams: (params: FunctionParam[]) => void;
}

export const ParamsModal = ({
  isShown,
  onClose,
  functionData,
  params,
  setParams,
}: ParamsModalProps) => {
  const [showParamForm, setShowParamForm] = useState(false);
  const [editingParam, setEditingParam] = useState<{
    param: FunctionParam;
    index: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(params.length / itemsPerPage);

  const { isLoading, createParam, updateParam, deleteParam } =
    useParamManagement({
      functionId: functionData.id,
      params,
      setParams,
    });

  const handleAdd = () => {
    setEditingParam(null);
    setShowParamForm(true);
  };

  const handleEdit = (param: FunctionParam, index: number) => {
    setEditingParam({ param, index });
    setShowParamForm(true);
  };

  const handleSubmit = async (param: CreateFunctionParamDto) => {
    if (editingParam) {
      await updateParam(editingParam.index, param);
    } else {
      await createParam(param);
    }
    setShowParamForm(false);
  };

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={<h2 className="text-xl font-semibold">Parámetros</h2>}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <FaPlus className="mr-2" />
            Agregar Parámetro
          </button>
        </div>

        <ParamList
          params={params}
          onEdit={handleEdit}
          onDelete={deleteParam}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ParamFormModal
          isShown={showParamForm}
          onClose={() => setShowParamForm(false)}
          param={editingParam?.param}
          onSubmit={handleSubmit}
        />
      </div>
    </Modal>
  );
};
