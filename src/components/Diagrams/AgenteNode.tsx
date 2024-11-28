import { memo, useEffect, useState } from 'react';
import DefaultNode from './DefaultNode';
import { MdOutlineSupportAgent } from "react-icons/md";
import { InputGroup } from '@components/forms/inputGroup';
import { Input } from '@components/forms/input';
import { TextArea } from '@components/forms/textArea';
import { agentService } from '@services/agent';
import { useForm, SubmitHandler } from 'react-hook-form';
import { get } from 'http';

interface AgenteNodeProps {
  data: {
    title: string;
    name: string;
    description: string;
    isSelected: boolean;
  };
  agentId?: number;
}

interface AgentFormValues {
  name: string;
  description: string;
}

const AgenteNode = ({ data, agentId }: AgenteNodeProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AgentFormValues>();

  useEffect(() => {
    if (!data.isSelected) return;
    const fetchAgent = async () => {
      if (!agentId) return;
      
      setIsLoading(true);
      try {
        const fetchedAgent = await agentService.getAgentById(agentId);
        setValue('name', fetchedAgent.name);
        setValue('description', fetchedAgent.config.instruccion);
      } catch (error) {
        console.error('Error fetching agent:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [agentId, data.isSelected]);

  const onSubmit: SubmitHandler<AgentFormValues> = async (formData) => {
    if (!agentId) return;
    
    setIsLoading(true);
    try {
      await agentService.updateAgent(agentId, formData);
      // Aquí podrías mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error updating agent:', error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultNode
      data={{
        ...data,
        name: "Agente",
        description: "Agente conversacional",
      }}
      icon={<MdOutlineSupportAgent size={24} className="w-8 h-8 text-gray-800" />}
      allowedConnections={['source', 'target']}
    >
      <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
        {isLoading ? (
          <p className="text-gray-600">Cargando agente...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <InputGroup
              label="Nombre"
              errors={errors.name}
            >
              <Input
                placeholder="Nombre del agente"
                register={register('name', { required: 'El nombre es obligatorio' })}
                error={errors.name?.message}
              />
            </InputGroup>
            <InputGroup
              label="Descripción"
              errors={errors.description}
            >
              <TextArea
                placeholder="Descripción del agente"
                register={register('description', {
                  required: 'La descripción es obligatoria',
                  minLength: {
                    value: 10,
                    message: 'La descripción debe tener al menos 10 caracteres',
                  },
                })}
                error={errors.description?.message}
              />
            </InputGroup>
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
