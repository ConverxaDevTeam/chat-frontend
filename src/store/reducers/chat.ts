import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "agent";
  text: string;
}

interface ChatState {
  messages: Message[];
  connected: boolean;
  agentId: string | null;
}

const initialState: ChatState = {
  messages: [],
  connected: false,
  agentId: null,
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
    setAgentId: (state, action: PayloadAction<string | null>) => {
      state.agentId = action.payload;
    },
  },
});

export const { addMessage, setConnectionStatus, setAgentId } = chatSlice.actions;
export default chatSlice.reducer;
