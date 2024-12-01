import axiosInstance from '@config/axios';
import { Agent, CreateAgentDto } from '@interfaces/agents';

// URL base del backend desde las variables de entorno
const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL + '/api';


class AgentService {
  /**
   * Obtiene un agente por su ID.
   * @param id ID del agente.
   */
  async getAgentById(id: number): Promise<Agent> {
    const response = await axiosInstance.get<Agent>(`${BASE_URL}/agent/${id}`);
    return response.data;
  }

  /**
   * Crea un nuevo agente.
   * @param agent Datos del agente a crear.
   */
  async createAgent(agent: CreateAgentDto): Promise<Agent> {
    const response = await axiosInstance.post<Agent>(`${BASE_URL}/agent`, agent);
    return response.data;
  }

  /**
   * Actualiza un agente existente.
   * @param id ID del agente.
   * @param agent Datos del agente a actualizar.
   */
  async updateAgent(id: number, agent: Partial<CreateAgentDto>): Promise<Agent> {
    const response = await axiosInstance.put<Agent>(`${BASE_URL}/agent/${id}`, agent);
    return response.data;
  }
}

// Exporta una instancia del servicio para ser reutilizado
export const agentService = new AgentService();
