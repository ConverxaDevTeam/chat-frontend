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
  contextMenuOptions?: ContextMenuOption[];
  contextMenuVersion?: "v1" | "v2";
}

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
  isSelected: boolean;
  icon: React.ReactNode;
  contextMenuOptions?: ContextMenuOption[];
  contextMenuVersion?: "v1" | "v2";
  menuPosition?: {
    x: number;
    y: number;
  };
  showContextMenu: boolean;
  handleCloseContextMenu: () => void;
}

const NodeContent: React.FC<NodeContentProps> = ({
  isSelected,
  icon,
  contextMenuOptions,
  contextMenuVersion = "v1",
  menuPosition,
  showContextMenu,
  handleCloseContextMenu,
}) => {
  const renderIcon = () => {
    return (
      <div className="flex justify-center items-center rounded-full w-16 h-16 bg-transparent text-black">
        {icon}
      </div>
    );
  };

  if (!isSelected || (isSelected && !showContextMenu)) {
    return renderIcon();
  }

  if (contextMenuOptions && showContextMenu) {
    return (
      <Fragment>
        {renderIcon()}
        {contextMenuVersion === "v1" ? (
          <DiagramContextMenu
            options={contextMenuOptions}
            x={menuPosition?.x ?? 0}
            y={menuPosition?.y ?? 0}
            onClose={handleCloseContextMenu}
          />
        ) : (
          <DiagramContextMenuV2
            options={contextMenuOptions}
            x={menuPosition?.x ?? 0}
            y={menuPosition?.y ?? 0}
            onClose={handleCloseContextMenu}
          />
        )}
      </Fragment>
    );
  }

  return renderIcon();
};

const DefaultNode: React.FC<CustomNodeProps> = ({
  data,
  selected,
  allowedConnections = [],
  icon,
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

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuWasClosed, setMenuWasClosed] = useState(false);
  const { name } = data;
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
    if (selected && !menuWasClosed) {
      setShowContextMenu(true);
    } else if (!selected) {
      setShowContextMenu(false);
      setMenuWasClosed(false);
    }
  }, [selected, menuWasClosed]);

  const handleNodeClick = () => {
    if (selected && menuWasClosed) {
      setShowContextMenu(true);
      setMenuWasClosed(false);
    }
  };

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
      icon={icon}
      isSelected={selected ?? false}
      contextMenuOptions={contextMenuOptions}
      contextMenuVersion={contextMenuVersion}
      menuPosition={menuPosition}
      showContextMenu={showContextMenu}
      handleCloseContextMenu={() => {
        setShowContextMenu(false);
        setMenuWasClosed(true);
      }}
    />
  );

  return (
    <div className="relative" ref={ref} onClick={handleNodeClick}>
      {style !== NodeStyle.SMALL && (
        <div
          className={`
            absolute
            left-1/2
            -translate-x-1/2
            z-10
            ${style === NodeStyle.CENTRAL ? "top-[108px]" : ""}
            ${style === NodeStyle.NEUMORPHIC ? "top-[124px]" : ""}
          `}
        >
          <div className="w-[100px] text-center">
            <p className="text-xs font-normal text-sofia-superDark line-clamp-2 overflow-hidden">
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
                <NodeHandles allowedConnections={allowedConnections} />
                <NeumorphicButton
                  externalProps={{
                    radius: "full",
                    className:
                      "bg-[#DBEAF3] shadow-[0px_0px_3px_0px_rgba(148,163,184,0.50),0px_0px_3px_0px_#C9D9E8,-2px_-2px_10px_0px_rgba(201,217,232,0.80)_inset]",
                  }}
                  internalProps={{
                    radius: "full",
                    className:
                      "bg-[#F4FAFF] shadow-[0px_2px_16px_0px_rgba(148,163,184,0.50),4px_4px_16px_0px_#C9D9E8,-2px_-2px_10px_0px_rgba(201,217,232,0.80)_inset]",
                    width: "91px",
                    height: "91px",
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
