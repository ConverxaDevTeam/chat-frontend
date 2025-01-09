import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import chatSlice from "./reducers/chat";
import conversationsSlice from "./reducers/conversations";
import departmentSlice from "./reducers/department";

const reducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  conversations: conversationsSlice,
  department: departmentSlice,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
