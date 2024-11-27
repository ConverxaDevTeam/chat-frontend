export interface CreateAgentDto {
  name: string;
  description?: string;
  // Agrega otros campos según tu modelo
}

export interface Agent {
  id: number;
  name: string;
  config: {
    instruccion: string;
  }
  // Agrega otros campos según tu entidad
}
