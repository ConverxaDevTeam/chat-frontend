import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  count: number;
}

const initialState: NotificationState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    incrementNotificationCount: state => {
      state.count += 1;
      console.log("Notificación recibida, contador incrementado", state.count);
    },
  },
});

export const { incrementNotificationCount } = notificationSlice.actions;

export default notificationSlice.reducer;
