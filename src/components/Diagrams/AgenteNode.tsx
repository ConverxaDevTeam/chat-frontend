import { useEffect, useState } from "react";
import DefaultNode from "./DefaultNode";
import {
  MdOutlineSupportAgent,
  MdEdit,
  MdAddCircleOutline,
} from "react-icons/md";
import { agentService } from "@services/agent";
import { AgentNodeProps } from "@interfaces/workflow";
import { AgenteForm } from "./agenteComponents/AgenteForm";
import Modal from "@components/Modal";

const AgenteNode = (props: AgentNodeProps) => {
  const { data, selected } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentData, setAgentData] = useState<{
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!selected) return;
    console.log("Agent ID:", data.agentId);
    const fetchAgent = async () => {
      if (!data.agentId) return;

      setIsLoading(true);
      try {
        const fetchedAgent = await agentService.getAgentById(data.agentId);
        setAgentData({
          name: fetchedAgent.name,
          description: fetchedAgent.config.instruccion,
        });
      } catch (error) {
        console.error("Error fetching agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [data.agentId, selected]);

  const handleEditSuccess = () => {
    setIsModalOpen(false);
    // Recargar los datos del agente
    if (data.agentId) {
      agentService.getAgentById(data.agentId).then(agent => {
        setAgentData({
          name: agent.name,
          description: agent.config.instruccion,
        });
      });
    }
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
          {isLoading ? (
            <p className="text-gray-600">Cargando agente...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Nombre</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {agentData?.name || "Sin nombre"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Descripción
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {agentData?.description || "Sin descripción"}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <MdEdit className="mr-1" /> Editar
                </button>
                <button
                  onClick={() => {
                    /* TODO: Implementar agregar funciones */
                  }}
                  className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <MdAddCircleOutline className="mr-1" /> Agregar Funciones
                </button>
              </div>
            </div>
          )}
        </div>
      </DefaultNode>

      <Modal
        isShown={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={<h2 className="text-xl font-bold">Editar Agente</h2>}
      >
        <AgenteForm
          agentId={data.agentId || -1}
          initialData={agentData || undefined}
          onSuccess={handleEditSuccess}
        />
      </Modal>
    </>
  );
};

export default AgenteNode;
