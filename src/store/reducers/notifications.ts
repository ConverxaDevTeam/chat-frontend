import { createReducer, createAction } from "@reduxjs/toolkit";

interface NotificationState {
  count: number;
}

const initialState: NotificationState = {
  count: 0,
};

export const incrementNotificationCount = createAction(
  "notifications/increment"
);
export const decrementNotificationCount = createAction(
  "notifications/decrement"
);
export const setNotificationCount = createAction<number>(
  "notifications/setCount"
);

const notificationsReducer = createReducer(initialState, builder => {
  builder
    .addCase(incrementNotificationCount, state => {
      state.count += 1;
      console.log("Notificación recibida, contador incrementado", state.count);
    })
    .addCase(decrementNotificationCount, state => {
      state.count = Math.max(0, state.count - 1);
    })
    .addCase(setNotificationCount, (state, action) => {
      state.count = action.payload;
    });
});

export default notificationsReducer;
