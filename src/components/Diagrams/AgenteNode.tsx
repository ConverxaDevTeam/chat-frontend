import { useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { AgentData, CustomTypeNodeProps } from "@interfaces/workflow";
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
        }}
        icon={
          <MdOutlineSupportAgent size={24} className="w-8 h-8 text-gray-800" />
        }
        allowedConnections={["source", "target"]}
      >
        <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
          <AgentInfo
            isLoading={isLoading}
            agentData={agentData}
            onEdit={() => setIsModalOpen(true)}
            nodeId={props.id}
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
