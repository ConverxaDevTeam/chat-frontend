import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { logInAsync } from "@store/actions/auth";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setActive(true);
    dispatch(logInAsync({ data, setActive, setError, dispatch }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (authenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-sofia-background">
      <div className="flex flex-col w-[446px] bg-custom-gradient p-[12px] rounded-2xl border-[1px] border-[#B8CCE0] border-inherit m-auto">
        <div className="bg-[#F1F5F9] rounded-lg px-[32px] pt-[53px] pb-[40px] [box-shadow:0px_4px_8px_0px_rgba(201,_217,_232,_0.8)]">
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
                className="rounded-lg mb-[16px] py-[10px] px-[14px] border-[1px] text-[#717680] text-[16px] font-normal"
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
                className="rounded-lg mb-[16px] py-[10px] px-[14px] border-[1px] text-[#717680] text-[16px] font-normal"
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
              className="w-full rounded-[8px] py-[10px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[24px] disabled:bg-app-lightGray"
              type="submit"
              disabled={active}
            >
              Iniciar sesión
            </button>
            {error && (
              <p className="text-red-600 text-sm text-center max-h-5 px-2 mb-2">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>

      <p className="mx-auto text-[12px] mb-[38px] font-normal text-center text-sofia-superDark">
        Version 2.0
        <br /> SOF.IA LLM &copy; 2024 Derechos Reservados
      </p>
    </div>
  );
};

export default LogIn;
