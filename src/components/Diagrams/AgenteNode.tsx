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
    <div>
      <label className="block text-sm font-medium text-gray-700 text-left mb-1">
        Instrucciones
      </label>
      <textarea
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
        placeholder="ordenes del agente"
        rows={4}
      ></textarea>
    </div>

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
