import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { is } from "date-fns/locale";

interface CustomNodeProps {
  data: {
    name: string;
    description: string;
    isSelected: boolean;
  };
  allowedConnections: ("source" | "target")[]; // Determina qué tipo de conexiones estarán habilitadas
  icon?: React.ReactNode; // Ícono que se pasa como prop
  children?: React.ReactNode; // Contenido adicional a pasar como children
}
const CustomHandles = ({ allowedConnections }: { allowedConnections: ("source" | "target")[] }) => (
  <>
    {allowedConnections.includes("target") && (
      <>
        {Object.values(Position).map((position) => (
          <Handle
            key={position}
            type="target"
            id={`node-target-${position}`}
            position={position}
            className="w-6 h-6 bg-gray-500"
          />
        ))}
      </>
    )}
    {allowedConnections.includes("source") && (
      <>
        {Object.values(Position).map((position) => (
          <Handle
            key={position}
            type="source"
            id={`node-source-${position}`}
            position={position}
            className="w-6 h-6 bg-gray-500"
          />
        ))}
      </>
    )}
  </>
);

interface NodeBodyProps {
  children: React.ReactNode;
  name: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
}
function NodeBody({ children, isSelected, name, description, icon }: NodeBodyProps) {
  return <> 
    {/* Mostrar el ícono solo cuando no está seleccionado */}
    {!isSelected ? (
        <div className="flex justify-center items-center rounded-full w-16 h-16 bg-transparent text-black">
          {icon} {/* Ícono se pasa como prop y solo se muestra cuando no está seleccionado */}
        </div>
    ):
    (
      <div className="mt-4 text-center text-black">
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-sm">{description}</div>
        {/* Mostrar el contenido que se pase como children */}
        <div className="mt-4 bg-transparent rounded-md">
          {children} {/* Aquí se renderiza el contenido adicional */}
        </div>
      </div>
    )} 
  </>;
}


function DefaultNode({
  data,
  allowedConnections,
  icon,
  children,
}: CustomNodeProps): JSX.Element {
  const { name, description, isSelected } = data;

  return (
    <div className="flex flex-col items-center">
      { !isSelected && <div className="mb-2 text-black font-medium">{name}</div> }
      <div
        className={`flex flex-col justify-center items-center border-2 transition-all p-6 ${
          isSelected
            ? "w-72 h-auto bg-blue-500 text-white rounded-lg shadow-xl"
            : "w-20 h-20 bg-white text-black rounded-full"
        } font-medium`}
      >
        <NodeBody name={name} description={description} icon={icon} isSelected={isSelected}>
          {children}
        </NodeBody>
        <CustomHandles allowedConnections={allowedConnections} />
      </div>
  </div>
  );
}

export default memo(DefaultNode);
