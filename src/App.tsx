import Interface from "@components/Interface";
import Loading from "@components/Loading";
import ProtectedAuth from "@components/ProtectedAuth";
import Dashboard from "@pages/Home";
import LogIn from "@pages/LogIn";
import Organizations from "@pages/Organizations";
import Workspace from "@pages/Workspace";
import { AppDispatch, RootState } from "@store";
import { verifySessionAsync } from "@store/actions/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

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
    <Routes>
      <Route index element={<LogIn />} />
      <Route
        path="/*"
        element={
          <ProtectedAuth>
            <Interface />
          </ProtectedAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="workspace" element={<Workspace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
