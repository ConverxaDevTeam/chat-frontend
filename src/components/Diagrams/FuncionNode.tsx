import { memo, useState } from "react";
import { MdCode } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";
import { FunctionInfo } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

const FuncionNode = memo(
  (props: CustomTypeNodeProps<FunctionData<HttpRequestFunction>>) => {
    const { data } = props;
    const [isModalOpen, setIsModalOpen] = useState(!data.functionId);

    const handleClose = () => setIsModalOpen(false);
    const handleEdit = () => setIsModalOpen(true);

    return (
      <>
        <DefaultNode
          {...props}
          icon={<MdCode size={24} className="w-8 h-8 text-gray-800" />}
          allowedConnections={["source", "target"]}
        >
          <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
            <FunctionInfo functionData={data} onEdit={handleEdit} />
          </div>
        </DefaultNode>

        <FunctionEditModal
          isOpen={isModalOpen}
          onClose={handleClose}
          functionId={data.functionId}
          initialData={data}
          onSuccess={handleClose}
        />
      </>
    );
  }
);

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
