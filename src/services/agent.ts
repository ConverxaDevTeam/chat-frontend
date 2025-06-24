import { apiUrls } from "@config/config";
import { Agent, CreateAgentDto } from "@interfaces/agents";
import { axiosInstance } from "@store/actions/auth";

// URL base del backend desde las variables de entorno

class AgentService {
  /**
   * Obtiene un agente por su ID.
   * @param id ID del agente.
   */
  async getById(id: number): Promise<Agent> {
    const response = await axiosInstance.get<Agent>(apiUrls.agents.byId(id));
    return response.data;
  }

  /**
   * Crea un nuevo agente.
   * @param agent Datos del agente a crear.
   */
  async create(agent: CreateAgentDto): Promise<Agent> {
    const response = await axiosInstance.post<Agent>(
      apiUrls.agents.base(),
      agent
    );
    return response.data;
  }

  /**
   * Actualiza un agente existente.
   * @param id ID del agente.
   * @param agent Datos del agente a actualizar.
   */
  async update(id: number, agent: Partial<CreateAgentDto>): Promise<Agent> {
    const response = await axiosInstance.put<Agent>(
      apiUrls.agents.byId(id),
      agent
    );
    return response.data;
  }

  /**
   * Actualiza la capacidad de escalar a humano de un agente.
   * @param id ID del agente.
   * @param canEscalate Si el agente puede escalar a humano.
   */
  async updateEscalateToHuman(
    id: number,
    canEscalate: boolean
  ): Promise<Agent> {
    const response = await axiosInstance.put<Agent>(
      apiUrls.agents.escalateToHuman(id),
      { canEscalateToHuman: canEscalate }
    );
    return response.data;
  }
}

// Exporta una instancia del servicio para ser reutilizado
export const agentService = new AgentService();
