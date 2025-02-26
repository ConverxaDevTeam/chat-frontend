import { useState } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeData } from "@interfaces/workflow";
import Modal from "@components/Modal";
import NewIntegration from "./NewIntegration";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { ConfigWebChat } from "@pages/Workspace/components/CustomizeChat";
import { ContextMenuOption } from "./DiagramContextMenu";
import { IntegrationType } from "@interfaces/integrations";
import { useCounter } from "@hooks/CounterContext";

export interface ConfigWhatsApp {
  name_app: string | null;
  phone: string | null;
  token_expire: string | null;
}

export interface ConfigMessenger {
  page_id: string;
  app_id: string;
  app_secret: string;
}

export interface IIntegration {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegrationType;
  config: ConfigWebChat | ConfigWhatsApp | ConfigMessenger;
}

const IntegracionesNode = ({
  data,
  selected,
  ...rest
}: CustomTypeNodeProps<NodeData>) => {
  const { increment } = useCounter();
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const contextMenuOptions: ContextMenuOption[] = [
    {
      child: (
        <div className="group relative">
          <img src="/mvp/circle-plus.svg" alt="Nueva Integración" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-5 hidden group-hover:block bg-gray-800 text-white text-lm px-2 py-1 rounded whitespace-nowrap">
            Agregar integración
          </div>
        </div>
      ),
      onClick: () => setIsMenuVisible(true),
    },
    // Add more options here if needed
  ];

  const getDataIntegrations = () => {
    increment();
  };
  return (
    <>
      <Modal
        isShown={isMenuVisible}
        children={
          <NewIntegration
            setIsMenuVisible={setIsMenuVisible}
            getDataIntegrations={getDataIntegrations}
            departmentId={selectedDepartmentId}
          />
        }
        onClose={toggleMenu}
        header={<h2 className="text-xl font-bold">Agregar Integración</h2>}
      />
      <DefaultNode
        selected={selected}
        data={{
          ...data,
          name: "Canales",
          description: "Conecta la plataforma con otras herramientas.",
        }}
        allowedConnections={["source", "target"]}
        icon={<img src="/mvp/cable.svg" alt="Integraciones" />}
        contextMenuOptions={contextMenuOptions}
        {...rest}
      >
        {/* <div className="bg-transparent rounded-md text-black flex flex-col gap-[10px]">
          <button
            onClick={toggleMenu}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <HiPlusCircle className="w-6 h-6" size={24} color="blue" />
            Agregar Integración
          </button>
          {integrations
            .filter(
              integration => integration.type !== IntegrationType.CHAT_WEB
            )
            .map(integration => (
              <ButtonIntegrationActive
                key={integration.id}
                integration={integration}
              />
            ))}
        </div> */}
      </DefaultNode>
    </>
  );
};

export default IntegracionesNode;
