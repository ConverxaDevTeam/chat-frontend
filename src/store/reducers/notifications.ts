import {
  createReducer,
  createAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getNotifications } from "@services/notifications.service";

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
export const loadNotifications = createAction<number>("notifications/load");

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (organizationId: number, { dispatch }) => {
    console.log("fetch notifications", organizationId);
    const notifications = await getNotifications(organizationId);
    dispatch(loadNotifications(notifications.length));
  }
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
    })
    .addCase(loadNotifications, (state, action) => {
      state.count = action.payload;
    });
});

export default notificationsReducer;
