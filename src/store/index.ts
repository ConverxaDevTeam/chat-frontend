import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";

const reducer = combineReducers({
  auth: authSlice,
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
