import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { logInAsync } from "@store/actions/auth";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import GoogleLoginButton from "@components/GoogleLoginButton";
import { usePostLoginRedirect } from "@hooks/usePostLoginRedirect";

const LogIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { authenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const { handlePostLoginRedirect, redirectPath } = usePostLoginRedirect();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setActive(true);
    dispatch(
      logInAsync({
        data,
        setActive,
        setError,
        dispatch,
        onSuccess: handlePostLoginRedirect,
      })
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (authenticated && !loading) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-whiite">
      <div className="flex flex-col w-[446px] px-[43px] pt-[53px] pb-[40px] rounded-[4px] border border-[#B8CCE0] border-inherit m-auto">
        <img
          className="mx-auto mb-[48px] h-[34px]"
          src="/mvp/logo-sofia.svg"
          alt="logo"
        />
        <h2 className="font-semibold text-[30px] text-sofia-superDark mb-[16px] text-center">
          Inicia sesión
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className=" bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal"
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              onChange={handleChange}
              value={data.email}
              name="email"
              required
            />
            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className=" bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border-[1px] text-[#717680] text-[14px] font-normal"
              type="password"
              id="password"
              placeholder="Contraseña"
              onChange={handleChange}
              value={data.password}
              name="password"
              required
            />
          </div>
          <div className="flex items-center justify-end mb-[24px]">
            <Link
              to="/reset-password"
              className="text-[14px] font-medium text-sofia-superDark hover:text-sofia-electricGreen hover:underline"
            >
              Olvidé mi contraseña
            </Link>
          </div>
          <button
            className="w-full rounded-[4px] py-[10px] px-[18px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[16px] disabled:bg-app-lightGray"
            type="submit"
            disabled={active}
          >
            Iniciar sesión
          </button>

          <div className="flex items-center justify-between mb-[16px]">
            <div className="w-[45%] h-[1px] bg-gray-300"></div>
            <span className="text-[14px] text-gray-500">o</span>
            <div className="w-[45%] h-[1px] bg-gray-300"></div>
          </div>

          <GoogleLoginButton
            setError={setError}
            onSuccess={handlePostLoginRedirect}
          />
          {error && (
            <p className="text-red-600 text-sm text-center max-h-5 px-2 mb-2">
              {error}
            </p>
          )}

          <div className="text-center mt-4">
            <span className="text-[14px] text-gray-600">
              ¿No tienes cuenta?{" "}
            </span>
            <Link
              to="/sign-up"
              className="text-[14px] font-semibold text-sofia-superDark hover:text-sofia-electricGreen hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </div>

      <p className="mx-auto text-[12px] mb-[38px] font-normal text-center text-sofia-superDark">
        Version 2.0
        <br /> SOF.IA LLM &copy; 2024 Derechos Reservados
      </p>
    </div>
  );
};

export default LogIn;
