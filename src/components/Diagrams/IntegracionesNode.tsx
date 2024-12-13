import React, { useState } from "react";
import DefaultNode from "./DefaultNode";
import { HiLink, HiPlusCircle } from "react-icons/hi";
import AddWebchat from "@pages/Workspace/components/AddWebChat";
import { CustomTypeNodeProps, NodeData } from "@interfaces/workflow";

const SubMenu: React.FC<{ openModal: () => void }> = ({ openModal }) => {
  return (
    <div className="mt-4">
      <ul className="mt-2 space-y-2">
        <li
          className="cursor-pointer p-2 rounded-md hover:bg-blue-100 transition-all"
          onClick={openModal}
        >
          Webchat
        </li>
      </ul>
    </div>
  );
};

const IntegracionesNode = ({
  data,
  selected,
  ...rest
}: CustomTypeNodeProps<NodeData>) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <DefaultNode
        selected={selected}
        data={{
          ...data,
          name: "Integraciones",
          description: "Conecta la plataforma con otras herramientas.",
        }}
        allowedConnections={["source"]}
        icon={<HiLink size={24} className="w-8 h-8 text-gray-800" />}
        {...rest}
      >
        <div className="mt-4 bg-transparent rounded-md text-black">
          <button
            onClick={toggleMenu}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <HiPlusCircle className="w-6 h-6" size={24} color="blue" />
            Agregar Integración
          </button>

          {isMenuVisible && <SubMenu openModal={() => setIsModalOpen(true)} />}
        </div>
      </DefaultNode>
      <AddWebchat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default IntegracionesNode;
