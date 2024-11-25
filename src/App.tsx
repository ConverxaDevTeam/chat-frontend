import Loading from "@components/Loading";
import ProtectedAuth from "@components/ProtectedAuth";
import Home from "@pages/Home";
import Interface from "@pages/Interface";
import LogIn from "@pages/LogIn";
import Organizations from "@pages/Organizations";
import { AppDispatch, RootState } from "@store";
import { verifySessionAsync } from "@store/actions/auth";
import { setThemeClass } from "@utils/changeTheme";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const App = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, theme } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(verifySessionAsync({ dispatch }));
  }, []);

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

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
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="organizations" element={<Organizations />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
