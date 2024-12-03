import { memo, useState } from "react";
import { MdCode } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";
import { FunctionInfo } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";
import { ParamsModal } from "./funcionComponents/ParamsModal";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { FunctionParam } from "@interfaces/function-params.interface";

const FuncionNode = memo(
  (props: CustomTypeNodeProps<FunctionData<HttpRequestFunction>>) => {
    const { data } = props;
    const [isModalOpen, setIsModalOpen] = useState(!data.functionId);
    const [showParamsModal, setShowParamsModal] = useState(false);
    const [params, setParams] = useState<FunctionParam[]>(
      data.config?.requestBody || []
    );

    const handleClose = () => setIsModalOpen(false);
    const handleEdit = () => setIsModalOpen(true);

    const handleAddParam = (param: FunctionParam) => {
      setParams([...params, { ...param, id: crypto.randomUUID() }]);
      // TODO: Implement save params to backend
    };

    const handleEditParam = (param: FunctionParam) => {
      setParams(params.map(p => (p.id === param.id ? param : p)));
      // TODO: Implement save params to backend
    };

    const handleDeleteParam = (paramId: string) => {
      setParams(params.filter(p => p.id !== paramId));
      // TODO: Implement save params to backend
    };

    return (
      <>
        <DefaultNode
          {...props}
          icon={<MdCode size={24} className="w-8 h-8 text-gray-800" />}
          allowedConnections={["source", "target"]}
        >
          <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
            <FunctionInfo functionData={data} onEdit={handleEdit} />
            <button
              onClick={() => setShowParamsModal(true)}
              className="w-full px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Ver Parámetros ({params.length})
            </button>
          </div>
        </DefaultNode>

        <FunctionEditModal
          isOpen={isModalOpen}
          onClose={handleClose}
          functionId={data.functionId}
          initialData={data}
          onSuccess={handleClose}
        />

        <ParamsModal
          isOpen={showParamsModal}
          onClose={() => setShowParamsModal(false)}
          params={params}
          onParamAdd={handleAddParam}
          onParamEdit={handleEditParam}
          onParamDelete={handleDeleteParam}
        />
      </>
    );
  }
);

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
