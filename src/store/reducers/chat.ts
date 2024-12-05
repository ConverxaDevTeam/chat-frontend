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
}

const initialState: ChatState = {
  messages: [],
  connected: false,
  department: null,
  currentAgent: null,
  agentFunctions: [],
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
      }>
    ) => {
      state.department = action.payload.department;
      state.currentAgent = action.payload.agent;
      state.agentFunctions = action.payload.functions;
    },
    clearWorkspaceData: state => {
      state.department = null;
      state.currentAgent = null;
      state.agentFunctions = [];
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
