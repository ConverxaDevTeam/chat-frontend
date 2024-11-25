import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { logInAsync } from "@store/actions/auth";
import { Navigate } from "react-router-dom";

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
    <div className="flex flex-col w-full h-full bg-app-background relative overflow-hidden">
      <div className="w-full h-full absolute bg-[url('demo/more.png')] bg-repeat z-10"></div>
      <div className="h-[66px] w-full flex items-center px-[12px] justify-between z-20">
        <img className="h-[40px]" src="demo/logo_black.svg" alt="logo" />
        <div className="flex items-center gap-[20px]">
          <p className="font-poppinsMedium text-app-dark text-[12px]">
            ¿Aún no tenés cuenta?
          </p>
          <button
            type="button"
            className="text-app-electricGreen rounded-[4px] h-[40px] px-[20px] text-[14px] font-poppinsSemiBold bg-app-dark"
          >
            Registrarse
          </button>
        </div>
      </div>
      <div className="w-[calc(100%+20px)] h-[525px] absolute -bottom-[10px] -left-[10px] opacity-30">
        <img className="w-full h-full" src="demo/slime.svg" alt="background" />
      </div>
      <div className="flex flex-col w-[520px] m-auto z-10 bg-app-white px-[56px] pt-[24px] rounded-lg border-[8px] border-app-dark relative">
        <h2 className="font-poppinsBold text-[28px]  text-app-dark mb-[16px]">
          ¡Bienvenido de vuelta!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              className="text-[11px] font-poppinsSemiBold text-app-dark mb-[8px]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="rounded-[4px] mb-[16px] h-[34px] px-[12px] border-1 text-[12px] font-poppinsRegular"
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              value={data.email}
              name="email"
              required
            />
            <label
              className="text-[11px] font-poppinsSemiBold text-app-dark mb-[8px]"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="rounded-[4px] mb-[8px] h-[34px] px-[12px] border-1 text-[12px] font-poppinsRegular"
              type="password"
              id="password"
              placeholder="Contraseña"
              onChange={handleChange}
              value={data.password}
              name="password"
              required
            />
          </div>

          <p className="text-[13px] text-right font-poppinsSemiBold text-sofiaCall-dark mb-[12px]">
            ¿Olvidaste tu contraseña?
          </p>
          <button
            className="w-full rounded-[4px] h-[50px] bg-app-dark border-[1px] border-sofiaCall-dark text-sofiaCall-electricGreen text-[14px] font-poppinsSemiBold mb-[24px] disabled:bg-app-lightGray"
            type="submit"
            disabled={active}
          >
            Iniciar sesion
          </button>
          {error && (
            <p className="text-app-error text-sm font-poppinsRegular text-center max-h-5 px-2 mb-2">
              {error}
            </p>
          )}
          <p className="text-[12px] text-app-text font-poppinsRegular text-center">
            Al hacer clic en el botón de arriba, acepta nuestros Términos de
            servicio y Política de privacidad.
          </p>
          <img
            className="h-[40px] ml-[40px] mt-[24px]"
            src="demo/logo_black.svg"
            alt="logo"
          />
          <img
            className="h-[8px] absolute -bottom-[8px] mx-auto"
            src="demo/line.png"
            alt="line"
          />
        </form>
      </div>
    </div>
  );
};

export default LogIn;
