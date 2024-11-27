import { memo, useEffect, useState } from 'react';
import DefaultNode from './DefaultNode';
import { MdOutlineSupportAgent } from "react-icons/md";
import { InputGroup } from '@components/inputGroup';
import { agentService } from '@services/agent';
import { useForm, SubmitHandler } from 'react-hook-form';

interface AgenteNodeProps {
  data: {
    title: string;
    name: string;
    description: string;
    isSelected: boolean;
  };
}

interface AgentFormValues {
  name: string;
  description: string;
}

const AgenteNode = ({ data }: AgenteNodeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<number>(1);

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AgentFormValues>();

  // Crear agente automáticamente si no existe
  useEffect(() => {
    const fetchOrCreateAgent = async () => {
      return
      try {
        setIsLoading(true);
        const fetchedAgent = await agentService.getAgentById(agentId); // ID estático como ejemplo
        setValue('name', fetchedAgent.name);
        setValue('description', fetchedAgent?.config?.instruccion ?? '');
        setAgentId(fetchedAgent.id);
      } catch (error) {
          console.error('Error al obtener o crear el agente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrCreateAgent();
  }, [setValue]);

  // Manejar la edición del agente
  const onSubmit: SubmitHandler<AgentFormValues> = async (data) => {
    try {
      setIsLoading(true);
      const updatedAgent = await agentService.updateAgent(agentId, {
        name: data.name,
        description: data.description,
      });
      console.log('Agente actualizado:', updatedAgent);
    } catch (error) {
      console.error('Error al actualizar el agente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultNode
      data={{
        ...data,
        name: data.name || "Agente",
        description: data.description || "Agente conversacional",
      }}
      icon={<MdOutlineSupportAgent size={24} className="w-8 h-8 text-gray-800" />}
      allowedConnections={['source', 'target']}
      width="w-96"
    >
      <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
        {isLoading ? (
          <p className="text-gray-600">Cargando agente...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <InputGroup
              label="Nombre"
              placeholder="Nombre del agente"
              register={register('name', { required: 'El nombre es obligatorio' })}
              errors={errors.name}
            />
            <InputGroup
              label="Descripción"
              placeholder="Descripción del agente"
              register={register('description', {
                required: 'La descripción es obligatoria',
                minLength: {
                  value: 10,
                  message: 'La descripción debe tener al menos 10 caracteres',
                },
              })}
              errors={errors.description}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 justify-self-end shadow"
            >
              Guardar
            </button>
          </form>
        )}
      </div>
    </DefaultNode>
  );
};

export default memo(AgenteNode);
