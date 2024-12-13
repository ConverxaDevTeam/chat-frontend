import { IConversation } from "@pages/Workspace/components/ChatPreview";
import { createSlice } from "@reduxjs/toolkit";
import {
  newMessageChat,
  uploadConversation,
} from "@store/actions/conversations";

interface ConversationsState {
  conversations: IConversation[];
}

const initialState: ConversationsState = {
  conversations: [],
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(newMessageChat, (state, action) => {
        const conversationIndex = state.conversations.findIndex(
          conversation => conversation.id === action.payload.conversationId
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].messages.push(
            action.payload.message
          );
        }
      })
      .addCase(uploadConversation, (state, action) => {
        const conversationIndex = state.conversations.findIndex(
          conversation => conversation.id === action.payload.id
        );

        if (conversationIndex !== -1) {
          state.conversations[conversationIndex] = action.payload;
        } else {
          state.conversations.push(action.payload);
        }
      });
  },
});

export default conversationsSlice.reducer;
