import { IntegrationType } from "@interfaces/integrations";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "agent";
  text: string;
}

interface Department {
  id: number;
}

interface AgentFunction {
  id: number;
  name: string;
  autenticador?: {
    id: number;
  };
}

interface Integration {
  id: number;
  type: IntegrationType;
}

interface Agent {
  id: number;
}

interface ChatState {
  messages: Message[];
  connected: boolean;
  department: Department | null;
  currentAgent: Agent | null;
  agentFunctions: AgentFunction[];
  integrations: Integration[];
}

const initialState: ChatState = {
  messages: [],
  connected: false,
  department: null,
  currentAgent: null,
  agentFunctions: [],
  integrations: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setWorkspaceData: (
      state,
      action: PayloadAction<{
        department: Department;
        agent: Agent;
        functions: AgentFunction[];
        integrations: Integration[];
      }>
    ) => {
      state.department = action.payload.department;
      state.currentAgent = action.payload.agent;
      state.agentFunctions = action.payload.functions;
      state.integrations = action.payload.integrations;
    },
    clearWorkspaceData: state => {
      state.department = null;
      state.currentAgent = null;
      state.agentFunctions = [];
      state.integrations = [];
    },
  },
});

export const {
  addMessage,
  setConnectionStatus,
  setWorkspaceData,
  clearWorkspaceData,
} = chatSlice.actions;

export default chatSlice.reducer;
