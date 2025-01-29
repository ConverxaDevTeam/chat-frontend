import React, { Fragment, useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData, NodeStyle } from "@interfaces/workflow";
import { NeumorphicButton } from "../NeumorphicButton";
import DiagramContextMenu, { ContextMenuOption } from "./DiagramContextMenu";
import { SmallNode } from "./nodes/SmallNode";
import { updateNodePosition } from "@services/node";
import { DiagramContextMenuV2 } from "./components/DiagramContextMenuV2";

interface CustomNodeProps extends NodeProps {
  data: NodeData;
  allowedConnections: ("source" | "target")[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  headerActions?: React.ReactNode;
  contextMenuOptions?: ContextMenuOption[];
  contextMenuVersion?: "v1" | "v2";
}

interface NodeLabelProps {
  name: string;
  selected?: boolean;
}

const NodeLabel: React.FC<NodeLabelProps> = ({ name, selected }) => {
  if (selected) return null;

  return (
    <div className="absolute top-[116px] left-1/2 -translate-x-1/2 z-10">
      <div className="w-[100px] text-center">
        <p className="text-center font-quicksand text-xs font-normal text-sofia-superDark line-clamp-2 overflow-hidden">
          {name}
        </p>
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
  contextMenuOptions?: ContextMenuOption[];
  contextMenuVersion?: "v1" | "v2";
  menuPosition?: {
    x: number;
    y: number;
  };
}

const NodeContent: React.FC<NodeContentProps> = ({
  children,
  isSelected,
  name,
  description,
  icon,
  headerActions,
  contextMenuOptions,
  contextMenuVersion = "v1",
  menuPosition,
}) => {
  const renderIcon = () => {
    return (
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-transparent text-black">
        {icon}
      </div>
    );
  };

  if (!isSelected) {
    return renderIcon();
  }

  if (contextMenuOptions) {
    return (
      <Fragment>
        {renderIcon()}
        {contextMenuVersion === "v1" ? (
          <DiagramContextMenu
            options={contextMenuOptions}
            x={menuPosition?.x ?? 0}
            y={menuPosition?.y ?? 0}
            onClose={() => {}}
          />
        ) : (
          <DiagramContextMenuV2
            options={contextMenuOptions}
            x={menuPosition?.x ?? 0}
            y={menuPosition?.y ?? 0}
            onClose={() => {}}
          />
        )}
      </Fragment>
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
  headerActions,
  contextMenuOptions,
  contextMenuVersion,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [menuPosition, setMenuPosition] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >();

  const { name, description, style } = data;

  useEffect(() => {
    if (ref.current) {
      const { left, top, width } = ref.current.getBoundingClientRect();
      setMenuPosition({ x: left + width + 25, y: top });
    }
  }, [selected]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const [type, id] = props.id.split("-");
      if (type === "function") {
        updateNodePosition(Number(id), {
          x: props.positionAbsoluteX,
          y: props.positionAbsoluteY,
          type: "function",
        });
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [props.positionAbsoluteX, props.positionAbsoluteY]);

  const nodeContent = (
    <NodeContent
      name={name}
      description={description}
      icon={icon}
      isSelected={selected ?? false}
      headerActions={headerActions}
      contextMenuOptions={contextMenuOptions}
      contextMenuVersion={contextMenuVersion}
      menuPosition={menuPosition}
    >
      {children}
    </NodeContent>
  );

  return (
    <div className="relative" ref={ref}>
      {style !== NodeStyle.SMALL && (
        <NodeLabel name={name} selected={selected} />
      )}
      {(() => {
        switch (style) {
          case NodeStyle.CENTRAL:
            return (
              <Fragment>
                <NodeHandles allowedConnections={allowedConnections} />
                <NeumorphicButton
                  externalProps={{
                    radius: "full",
                    className: "pb-5",
                  }}
                  internalProps={{
                    radius: "full",
                    className: "bg-node-gradient",
                  }}
                  height="140px"
                  width="140px"
                >
                  {nodeContent}
                </NeumorphicButton>
              </Fragment>
            );
          case NodeStyle.SMALL:
            return (
              <Fragment>
                <NodeHandles allowedConnections={allowedConnections} />
                <SmallNode>{nodeContent}</SmallNode>
              </Fragment>
            );
          default:
            return (
              <Fragment>
                <NodeHandles allowedConnections={allowedConnections} />
                <NeumorphicButton
                  externalProps={{
                    className: "rounded-[32px] pb-8",
                  }}
                  height="165px"
                >
                  {nodeContent}
                </NeumorphicButton>
              </Fragment>
            );
        }
      })()}
    </div>
  );
};

export default DefaultNode;
