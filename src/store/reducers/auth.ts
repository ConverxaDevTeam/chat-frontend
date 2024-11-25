import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../utils/interfaces";
import {
  getUserAsync,
  logInAsync,
  verifySessionAsync,
  logOutAsync,
  connectSocketAsync,
  disconnectSocketAsync,
  setThemeAction,
} from "../actions/auth";
import { getTheme } from "@utils/changeTheme";

const initialState: IAuthState = {
  authenticated: false,
  loading: true,
  user: null,
  selectOrganization: null,
  socket: null,
  theme: getTheme(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifySessionAsync.fulfilled, state => {
        state.authenticated = true;
        state.loading = false;
      })
      .addCase(verifySessionAsync.rejected, state => {
        state.authenticated = false;
        state.loading = false;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getUserAsync.rejected, state => {
        state.user = null;
        state.authenticated = false;
      })
      .addCase(logInAsync.fulfilled, state => {
        state.authenticated = true;
      })
      .addCase(logInAsync.rejected, state => {
        state.authenticated = false;
      })
      .addCase(logOutAsync.fulfilled, state => {
        state.authenticated = false;
        state.user = null;
      })
      .addCase(logOutAsync.rejected, state => {
        state.authenticated = false;
        state.user = null;
      })
      .addCase(connectSocketAsync.fulfilled, (state, action) => {
        state.socket = action.payload;
      })
      .addCase(disconnectSocketAsync.fulfilled, state => {
        state.socket = null;
      })
      .addCase(disconnectSocketAsync.rejected, state => {
        state.socket = null;
      })
      .addCase(connectSocketAsync.rejected, state => {
        state.socket = null;
      })
      .addCase(setThemeAction, (state, action) => {
        state.theme = action.payload;
      });
  },
});

export default authSlice.reducer;
