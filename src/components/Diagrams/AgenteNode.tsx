import { memo } from 'react';
import DefaultNode from './DefaultNode';
import { MdOutlineSupportAgent } from "react-icons/md";
import { InputGroup } from '@components/workspace/components/inputGroup';

interface AgenteNodeProps {
  data: {
    title: string;
    name: string;
    description: string;
    isSelected: boolean;
  };
}

const AgenteNode = ({ data }: AgenteNodeProps) => {
  return (
    <DefaultNode
  data={{
    ...data,
    name: "Agente",
    description: "Agente conversacional",
  }}
  icon={<MdOutlineSupportAgent size={24} className="w-8 h-8 text-gray-800" />}
  allowedConnections={['source', 'target']}
  width="w-96"
>
  <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
    <InputGroup label="Nombre" placeholder="Nombre del agente" />
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 justify-self-end shadow"
    >
      Guardar
    </button>
  </div>
</DefaultNode>

  );
};

export default memo(AgenteNode);
