import { memo, useState, useEffect } from "react";
import { MdCode } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, FunctionData } from "@interfaces/workflow";
import { FunctionInfo } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";

const FuncionNode = memo((props: CustomTypeNodeProps<FunctionData>) => {
  const { data } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading] = useState(false);

  // Abrir el modal automáticamente si es un nuevo nodo (sin functionId)
  useEffect(() => {
    if (!data.functionId) {
      setIsModalOpen(true);
    }
  }, [data.functionId]);

  const handleEditSuccess = () => {
    setIsModalOpen(false);
    // TODO: Implement refresh function data
  };

  return (
    <>
      <DefaultNode
        {...props}
        data={{
          ...data,
          name: "Función",
          description: "Función personalizada",
        }}
        icon={<MdCode size={24} className="w-8 h-8 text-gray-800" />}
        allowedConnections={["source", "target"]}
      >
        <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
          <FunctionInfo
            isLoading={isLoading}
            functionData={{
              name: data.name,
              description: data.description,
              type: data.type || "API_REQUEST",
            }}
            onEdit={() => setIsModalOpen(true)}
          />
        </div>
      </DefaultNode>

      <FunctionEditModal
        isOpen={isModalOpen}
        onClose={() => {
          // Si es un nodo nuevo y se cierra el modal sin guardar, podríamos
          // querer eliminarlo o manejarlo de alguna manera especial
          setIsModalOpen(false);
        }}
        functionId={data.functionId}
        initialData={{
          name: data.name,
          description: data.description,
          config: data.config || {},
        }}
        onSuccess={handleEditSuccess}
      />
    </>
  );
});

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
