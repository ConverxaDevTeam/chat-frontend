import { createAction } from "@reduxjs/toolkit";
import { IConversation, IMessage } from "@utils/interfaces";

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
