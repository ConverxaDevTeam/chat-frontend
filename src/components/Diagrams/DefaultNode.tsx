import React, { Fragment, useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps, useEdges } from "@xyflow/react";
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

const NodeHandles: React.FC<{
  allowedConnections: ("source" | "target")[];
  nodeId: string;
}> = ({ allowedConnections, nodeId }) => {
  const edges = useEdges();
  
  const connectedHandles = edges.reduce((acc, edge) => {
    if (edge.source === nodeId && edge.sourceHandle) {
      const position = edge.sourceHandle.includes('top') ? Position.Top :
                      edge.sourceHandle.includes('right') ? Position.Right :
                      edge.sourceHandle.includes('bottom') ? Position.Bottom :
                      edge.sourceHandle.includes('left') ? Position.Left : null;
      
      if (position) {
        acc.push({ type: 'source', position });
      }
    }
    if (edge.target === nodeId && edge.targetHandle) {
      const position = edge.targetHandle.includes('top') ? Position.Top :
                      edge.targetHandle.includes('right') ? Position.Right :
                      edge.targetHandle.includes('bottom') ? Position.Bottom :
                      edge.targetHandle.includes('left') ? Position.Left : null;
      
      if (position) {
        acc.push({ type: 'target', position });
      }
    }
    return acc;
  }, [] as Array<{ type: 'source' | 'target', position: Position }>);

  // Solo renderizar los handles que tienen conexiones
  return (
    <>
      {allowedConnections.includes("target") && connectedHandles
        .filter(handle => handle.type === 'target')
        .map(handle => (
          <Handle
            key={`target-${handle.position}`}
            type="target"
            position={handle.position}
            id={`node-target-${handle.position}`}
            className="w-3 h-3 bg-white border-2 border-blue-400 rounded-full"
            style={{
              top: handle.position === Position.Top ? "-2px" : handle.position === Position.Bottom ? "auto" : "50%",
              bottom: handle.position === Position.Bottom ? "-2px" : "auto",
              left: handle.position === Position.Left ? "-2px" : handle.position === Position.Right ? "auto" : "50%",
              right: handle.position === Position.Right ? "-2px" : "auto",
              transform: handle.position === Position.Left || handle.position === Position.Right ? "translate(0, -50%)" : "translate(-50%, 0)"
            }}
          />
        ))}
      {allowedConnections.includes("source") && connectedHandles
        .filter(handle => handle.type === 'source')
        .map(handle => (
          <Handle
            key={`source-${handle.position}`}
            type="source"
            position={handle.position}
            id={`node-source-${handle.position}`}
            className="w-3 h-3 bg-white border-2 border-green-400 rounded-full"
            style={{
              top: handle.position === Position.Top ? "-2px" : handle.position === Position.Bottom ? "auto" : "50%",
              bottom: handle.position === Position.Bottom ? "-2px" : "auto",
              left: handle.position === Position.Left ? "-2px" : handle.position === Position.Right ? "auto" : "50%",
              right: handle.position === Position.Right ? "-2px" : "auto",
              transform: handle.position === Position.Left || handle.position === Position.Right ? "translate(0, -50%)" : "translate(-50%, 0)"
            }}
          />
        ))}
    </>
  );
};

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

  const { name, description } = data;
  const style: NodeStyle = data.style || NodeStyle.NEUMORPHIC;

  useEffect(() => {
    if (ref.current) {
      const { left, top, width } = ref.current.getBoundingClientRect();
      setMenuPosition({ x: left + width + 25, y: top });
    }
  }, [
    selected,
    ref.current?.getBoundingClientRect().left,
    ref.current?.getBoundingClientRect().top,
  ]);

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
    <div
      className="relative"
      ref={ref}
    >
      {style !== NodeStyle.SMALL && (
        <div
          className={`
            absolute
            left-1/2
            -translate-x-1/2
            z-10
            ${style === NodeStyle.CENTRAL ? "top-[108px]" : ""}
            ${style === NodeStyle.NEUMORPHIC ? "top-[115px]" : ""}
          `}
        >
          <div className="w-[100px] text-center">
            <p className="text-xs font-normal text-sofia-superDark line-clamp-1 overflow-hidden">
              {name}
            </p>
          </div>
        </div>
      )}
      {(() => {
        switch (style) {
          case NodeStyle.CENTRAL:
            return (
              <Fragment>
                <NodeHandles allowedConnections={allowedConnections} nodeId={props.id}/>
                <NeumorphicButton
                  externalProps={{
                    radius: "full",
                    className: "pb-5",
                  }}
                  internalProps={{
                    radius: "full",
                    className: "bg-[#D0FBF8]",
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
                <NodeHandles allowedConnections={allowedConnections} nodeId={props.id}/>
                <SmallNode>{nodeContent}</SmallNode>
              </Fragment>
            );
          default:
            return (
              <Fragment>
                <NodeHandles allowedConnections={allowedConnections} nodeId={props.id}/>
                <NeumorphicButton
                  externalProps={{
                    className: "rounded-[32px] pb-8",
                  }}
                  height="155px"
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
