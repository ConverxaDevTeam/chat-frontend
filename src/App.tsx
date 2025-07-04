import Interface from "@components/Interface";
import Loading from "@components/Loading";
import NotificationHandler from "@components/NotificationHandler";
import ProtectedAuth from "@components/ProtectedAuth";
import ConversationDetail from "@pages/ConversationDetail";
import Conversations from "@pages/Conversations";
import Dashboard from "@pages/Home";
import LogIn from "@pages/LogIn";
import SignUp from "@pages/SignUp";
import InitialSetup from "@pages/InitialSetup";
import Organizations from "@pages/Organizations";
import Users from "@pages/Users";
import Workspace from "@pages/Workspace";
import Departments from "@pages/Departments";
import ChatUsers from "@pages/ChatUsers";
import TemplateCreation from "@pages/TemplateCreation";
import HitlPage from "@pages/Hitl";
import { AppDispatch, RootState } from "@store";
import { verifySessionAsync } from "@store/actions/auth";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastConfig } from "@config/toast";
import "react-toastify/dist/ReactToastify.css";
import { OrganizationRoleType } from "@utils/interfaces";
import { RequestResetPassword } from "@pages/auth/RequestResetPassword";
import { ChangePassword } from "@pages/auth/ChangePassword";
import { AlertProvider } from "@components/Diagrams/components/AlertContext";
import InitialSetupCheck from "@components/InitialSetupCheck";

const App = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(verifySessionAsync({ dispatch }));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <NotificationHandler />
      <ToastContainer {...toastConfig} />
      <AlertProvider>
        <Routes>
          <Route index element={<LogIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<RequestResetPassword />} />
          <Route path="/reset-password/change" element={<ChangePassword />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
          <Route
            path="/*"
            element={
              <ProtectedAuth>
                <Interface />
              </ProtectedAuth>
            }
          >
            <Route
              index
              element={
                <InitialSetupCheck>
                  <Dashboard />
                </InitialSetupCheck>
              }
            />
            <Route
              path="dashboard"
              element={
                <InitialSetupCheck>
                  <Dashboard />
                </InitialSetupCheck>
              }
            />
            <Route path="users" element={<Users />} />
            <Route
              path="organizations"
              element={
                <ProtectedAuth roles={[OrganizationRoleType.ING_PREVENTA]}>
                  <Organizations />
                </ProtectedAuth>
              }
            />
            <Route path="conversations" element={<Conversations />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="departments" element={<Departments />} />
            <Route
              path="chat-users"
              element={
                <ProtectedAuth
                  roles={[
                    OrganizationRoleType.OWNER,
                    OrganizationRoleType.USER,
                  ]}
                >
                  <ChatUsers />
                </ProtectedAuth>
              }
            />
            <Route path="templateCreation" element={<TemplateCreation />} />
            <Route
              path="organizations/:organizationId/hitl-types"
              element={<HitlPage />}
            />
            <Route
              path="conversation/detail/:id"
              element={<ConversationDetail />}
            />
            <Route
              path="conversation/detail/:id/user/:userId"
              element={<ConversationDetail />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AlertProvider>
    </Fragment>
  );
};

export default App;
