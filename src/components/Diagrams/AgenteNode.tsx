import { memo } from 'react';
import DefaultNode from './DefaultNode';

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
      data={data}
      allowedConnections={['source', 'target']} // Conexiones de entrada y salida
    />
  );
};

export default memo(AgenteNode);
