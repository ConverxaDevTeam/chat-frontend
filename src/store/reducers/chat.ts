import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "agent";
  text: string;
}

interface Department {
  id: number;
}


interface Agent {
  id: number;
}

interface ChatState {
  messages: Message[];
  connected: boolean;
  department: Department | null;
  currentAgent: Agent | null;
}

const initialState: ChatState = {
  messages: [],
  connected: false,
  department: null,
  currentAgent: null,
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
      }>
    ) => {
      state.department = action.payload.department;
      state.currentAgent = action.payload.agent;
    },
    clearWorkspaceData: (state) => {
      state.department = null;
      state.currentAgent = null;
    },
  },
});

export const { 
  addMessage, 
  setConnectionStatus, 
  setWorkspaceData,
  clearWorkspaceData 
} = chatSlice.actions;

export default chatSlice.reducer;
