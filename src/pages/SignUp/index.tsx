import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { Navigate, Link } from "react-router-dom";
import GoogleLoginButton from "@components/GoogleLoginButton";
import { signUpAsync } from "@store/actions/auth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
    dispatch(signUpAsync({ data: formData, setActive, setError, dispatch }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (authenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-sofia-background">
      <div className="flex flex-col w-[446px] bg-custom-gradient p-[12px] rounded-2xl border-[1px] border-[#B8CCE0] border-inherit m-auto">
        <div className="bg-[#F1F5F9] rounded-lg px-[32px] pt-[53px] pb-[40px] [box-shadow:0px_4px_8px_0px_rgba(201,_217,_232,_0.8)]">
          <img
            className="mx-auto mb-[48px]"
            src="/mvp/logo-sofia.svg"
            alt="logo"
          />
          <h2 className="font-semibold text-[30px] text-sofia-superDark mb-[16px] text-center">
            Crear cuenta
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label
                className="text-[14px] font-medium text-[#414651] mb-[6px]"
                htmlFor="first_name"
              >
                Nombre
              </label>
              <input
                className="rounded-lg mb-[16px] py-[10px] px-[14px] border-[1px] text-[#717680] text-[16px] font-normal"
                type="text"
                id="first_name"
                placeholder="Ingresa tu nombre"
                onChange={handleChange}
                value={formData.first_name}
                name="first_name"
                required
              />
              
              <label
                className="text-[14px] font-medium text-[#414651] mb-[6px]"
                htmlFor="last_name"
              >
                Apellido
              </label>
              <input
                className="rounded-lg mb-[16px] py-[10px] px-[14px] border-[1px] text-[#717680] text-[16px] font-normal"
                type="text"
                id="last_name"
                placeholder="Ingresa tu apellido"
                onChange={handleChange}
                value={formData.last_name}
                name="last_name"
                required
              />
              
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
                value={formData.email}
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
                placeholder="Contraseña (mínimo 8 caracteres)"
                onChange={handleChange}
                value={formData.password}
                name="password"
                required
                minLength={8}
              />
            </div>
            
            <button
              className="w-full rounded-[8px] py-[10px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[16px] disabled:bg-app-lightGray"
              type="submit"
              disabled={active}
            >
              Registrarse
            </button>
            
            <div className="flex items-center justify-between mb-[16px]">
              <div className="w-[45%] h-[1px] bg-gray-300"></div>
              <span className="text-[14px] text-gray-500">o</span>
              <div className="w-[45%] h-[1px] bg-gray-300"></div>
            </div>
            
            <GoogleLoginButton setError={setError} />
            
            {error && (
              <p className="text-red-600 text-sm text-center max-h-5 px-2 mb-2">
                {error}
              </p>
            )}
            
            <div className="text-center mt-4">
              <span className="text-[14px] text-gray-600">¿Ya tienes cuenta? </span>
              <Link
                to="/"
                className="text-[14px] font-medium text-sofia-superDark hover:text-sofia-electricGreen hover:underline"
              >
                Inicia sesión
              </Link>
            </div>
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

export default SignUp;
