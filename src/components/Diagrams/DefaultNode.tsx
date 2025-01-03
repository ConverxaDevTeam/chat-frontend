import React, { useRef } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, NodeStyle } from "@interfaces/workflow";
import { NeumorphicButton } from "../NeumorphicButton";

interface CustomNodeProps extends NodeProps {
  data: NodeData;
  allowedConnections: ("source" | "target")[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  headerActions?: React.ReactNode;
}

interface NodeLabelProps {
  name: string;
  selected?: boolean;
}

const NodeLabel: React.FC<NodeLabelProps> = ({ name, selected }) => {
  if (selected) return null;

  return (
    <div className="absolute bottom-[96px] left-1/2 -translate-x-1/2 z-10">
      <div className="w-[200px] break-words text-center flex flex-col-reverse">
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
    </div>
  );
};

const NodeHandles: React.FC<{
  allowedConnections: ("source" | "target")[];
}> = ({ allowedConnections }) => (
  <>
    {allowedConnections.includes("target") && (
      <Handle
        type="target"
        position={Position.Top}
        id={`node-target-${Position.Top}`}
        style={{
          opacity: 0,
          // Posicionamos el handle en el centro
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    )}
    {allowedConnections.includes("source") && (
      <Handle
        type="source"
        position={Position.Top}
        id={`node-source-${Position.Top}`}
        style={{
          opacity: 0,
          // Posicionamos el handle en el centro
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    )}
  </>
);

interface NodeContentProps {
  children?: React.ReactNode;
  name: string;
  description: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  headerActions?: React.ReactNode;
}

const NodeContent: React.FC<NodeContentProps> = ({
  children,
  isSelected,
  name,
  description,
  icon,
  headerActions,
}) => {
  if (!isSelected) {
    return (
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-transparent text-black">
        {icon}
      </div>
    );
  }

  return (
    <div className="mt-4 text-center text-black max-w-[600px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-lg">{name}</span>
        </div>
        {headerActions}
      </div>
      <div className="text-sm overflow-hidden truncate max-h-[4.5rem]">
        {description}
      </div>
      <div className="mt-4 bg-transparent rounded-md">{children}</div>
    </div>
  );
};

const DefaultNode: React.FC<CustomNodeProps> = ({
  data,
  selected,
  allowedConnections = [],
  icon,
  children,
  width = 72,
  headerActions,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { name, description, style } = data;

  const nodeContent = (
    <NodeContent
      name={name}
      description={description}
      icon={icon}
      isSelected={selected ?? false}
      headerActions={headerActions}
    >
      {children}
    </NodeContent>
  );

  return (
    <div className="relative" ref={ref}>
      <NodeLabel name={name} selected={selected} />
      {(() => {
        switch (style) {
          case NodeStyle.CENTRAL:
            return (
              <div
                className={`flex flex-col justify-center items-center border-2 transition-all p-6 ${
                  selected
                    ? `w-${width} h-auto bg-blue-500 text-white rounded-lg shadow-xl`
                    : "w-20 h-20 bg-white text-black rounded-full"
                } font-medium`}
              >
                {nodeContent}
                <NodeHandles allowedConnections={allowedConnections} />
              </div>
            );
          default:
            return (
              <>
                <NodeHandles allowedConnections={allowedConnections} />
                <NeumorphicButton withContainer={false}>
                  {nodeContent}
                </NeumorphicButton>
              </>
            );
        }
      })()}
    </div>
  );
};

export default DefaultNode;
