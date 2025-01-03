import { useState } from "react";
import {
  AgentData,
  CustomTypeNodeProps,
  NodeStyle,
} from "@interfaces/workflow";
import DefaultNode from "./DefaultNode";
import { AgentInfo } from "./agenteComponents/AgentInfo";
import { AgentEditModal } from "./agenteComponents/AgentEditModal";
import { useAgentData } from "./hooks/useAgentData";

const AgenteNode = (props: CustomTypeNodeProps<AgentData>) => {
  const { data, selected } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, agentData, refreshAgentData } = useAgentData(
    data.agentId,
    selected ?? false
  );

  const handleEditSuccess = () => {
    setIsModalOpen(false);
    refreshAgentData();
  };

  return (
    <>
      <DefaultNode
        {...props}
        data={{
          ...data,
          name: "Agente",
          description: "Agente conversacional",
          style: NodeStyle.CENTRAL,
        }}
        icon={<img src="/icon.svg" alt="Agente" />}
        allowedConnections={["source", "target"]}
      >
        <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
          <AgentInfo
            isLoading={isLoading}
            agentData={agentData}
            onEdit={() => setIsModalOpen(true)}
            nodeId={props.id}
            agentId={data.agentId}
          />
        </div>
      </DefaultNode>

      <AgentEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agentId={data.agentId}
        initialData={agentData || undefined}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default AgenteNode;
