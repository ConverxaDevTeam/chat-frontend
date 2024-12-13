import {
  IConversation,
  IMessage,
} from "@pages/Workspace/components/ChatPreview";
import { createAction } from "@reduxjs/toolkit";

export const newMessageChat = createAction(
  "conversations/newMessageChat",
  (payload: { message: IMessage; conversationId: number }) => {
    return { payload };
  }
);

export const uploadConversation = createAction(
  "conversations/uploadConversation",
  (payload: IConversation) => {
    return { payload };
  }
);
