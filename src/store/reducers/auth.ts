import { createSlice } from "@reduxjs/toolkit";
import { IAuthState, WizardStatus } from "../../utils/interfaces";

import {
  getUserAsync,
  logInAsync,
  googleLoginAsync,
  signUpAsync,
  verifySessionAsync,
  logOutAsync,
  connectSocketAsync,
  disconnectSocketAsync,
  getMyOrganizationsAsync,
  setOrganizationId,
} from "../actions/auth";

interface ExtendedAuthState extends IAuthState {
  conversationCounts: Record<number, number>;
}

const initialState: ExtendedAuthState = {
  authenticated: false,
  loading: true,
  user: null,
  selectOrganizationId: null,
  myOrganizations: [],
  socket: null,
  conversationCounts: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateConversationCount: (
      state,
      action: { payload: { organizationId: number; count: number } }
    ) => {
      const { organizationId, count } = action.payload;
      state.conversationCounts[organizationId] = count;
    },
    updateWizardStatus: (
      state,
      action: {
        payload: { organizationId: number; wizardStatus: WizardStatus };
      }
    ) => {
      const { organizationId, wizardStatus } = action.payload;
      const orgIndex = state.myOrganizations.findIndex(
        org => org.organization.id === organizationId
      );

      if (orgIndex !== -1) {
        state.myOrganizations[orgIndex].organization.wizardStatus =
          wizardStatus;
      }
    },
  },
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
      .addCase(googleLoginAsync.fulfilled, state => {
        state.authenticated = true;
      })
      .addCase(googleLoginAsync.rejected, state => {
        state.authenticated = false;
      })
      .addCase(signUpAsync.fulfilled, state => {
        state.authenticated = true;
      })
      .addCase(signUpAsync.rejected, state => {
        state.authenticated = false;
      })
      .addCase(logOutAsync.fulfilled, state => {
        state.authenticated = false;
        state.user = null;
        state.selectOrganizationId = null;
      })
      .addCase(logOutAsync.rejected, state => {
        state.authenticated = false;
        state.user = null;
        state.selectOrganizationId = null;
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
      .addCase(getMyOrganizationsAsync.fulfilled, (state, action) => {
        state.myOrganizations = action.payload;

        // Si no hay selectOrganizationId y solo hay una organización, establecerla automáticamente
        if (!state.selectOrganizationId && action.payload.length === 1) {
          const organizationId = action.payload[0].organization.id;
          state.selectOrganizationId = organizationId;
          localStorage.setItem("organizationSelect", String(organizationId));
        }
      })
      .addCase(getMyOrganizationsAsync.rejected, state => {
        state.myOrganizations = [];
      })
      .addCase(setOrganizationId, (state, action) => {
        state.selectOrganizationId = action.payload;
      });
  },
});

export const { updateConversationCount, updateWizardStatus } =
  authSlice.actions;

export default authSlice.reducer;
