import { memo } from "react";
import { MdCode } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";

const FuncionNode = memo((props: CustomTypeNodeProps) => {
  const { data } = props;

  return (
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
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Nombre</h3>
            <p className="mt-1 text-sm text-gray-900">
              {data.name || "Nueva Función"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Descripción</h3>
            <p className="mt-1 text-sm text-gray-900">
              {data.description || "Función personalizada"}
            </p>
          </div>
        </div>
      </div>
    </DefaultNode>
  );
});

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
