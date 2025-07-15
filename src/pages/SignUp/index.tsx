import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { Navigate, Link } from "react-router-dom";
import GoogleLoginButton from "@components/GoogleLoginButton";
import { signUpAsync } from "@store/actions/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@components/forms/input";
import { usePostLoginRedirect } from "@hooks/usePostLoginRedirect";

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const { handlePostLoginRedirect } = usePostLoginRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormValues>();

  const password = watch("password");

  const onSubmit: SubmitHandler<SignUpFormValues> = formData => {
    setError(null);
    setActive(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...dataToSubmit } = formData;
    dispatch(
      signUpAsync({
        data: dataToSubmit,
        setActive,
        setError,
        dispatch,
        onSuccess: handlePostLoginRedirect,
      })
    );
  };

  if (authenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-whiite">
      <div className="flex flex-col w-[446px] px-[43px] pt-[43px] pb-[40px] rounded-[4px] border border-[#B8CCE0] border-inherit m-auto">
        <img
          className="mx-auto mb-[18px] h-[34px]"
          src="/mvp/logo-sofia.svg"
          alt="logo"
        />
        <h2 className="font-semibold text-[30px] text-sofia-superDark mb-[16px] text-center">
          Crear cuenta
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="first_name"
            >
              Nombre
            </label>
            <Input
              type="text"
              placeholder="Ingresa tu nombre"
              register={register("first_name", {
                required: "El nombre es obligatorio",
              })}
              error={errors.first_name?.message}
              className="bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal h-auto"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm -mt-3 mb-3">
                {errors.first_name.message}
              </p>
            )}

            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="last_name"
            >
              Apellido
            </label>
            <Input
              type="text"
              placeholder="Ingresa tu apellido"
              register={register("last_name", {
                required: "El apellido es obligatorio",
              })}
              error={errors.last_name?.message}
              className="bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal h-auto"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm -mt-3 mb-3">
                {errors.last_name.message}
              </p>
            )}

            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              register={register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un email válido",
                },
              })}
              error={errors.email?.message}
              className="bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal h-auto"
            />
            {errors.email && (
              <p className="text-red-500 text-sm -mt-3 mb-3">
                {errors.email.message}
              </p>
            )}

            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="password"
            >
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="Contraseña (mínimo 8 caracteres)"
              register={register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
              error={errors.password?.message}
              className="bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal h-auto"
            />
            {errors.password && (
              <p className="text-red-500 text-sm -mt-3 mb-3">
                {errors.password.message}
              </p>
            )}

            <label
              className="text-[14px] font-medium text-[#414651] mb-[6px]"
              htmlFor="confirmPassword"
            >
              Confirmar contraseña
            </label>
            <Input
              type="password"
              placeholder="Confirma tu contraseña"
              register={register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: value =>
                  value === password || "Las contraseñas no coinciden",
              })}
              error={errors.confirmPassword?.message}
              className="bg-[#FCFCFC] rounded-[4px] mb-[16px] py-[10px] px-[14px] border text-[#717680] text-[14px] font-normal h-auto"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm -mt-3 mb-3">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            className="w-full rounded-[4px] py-[10px] px-[18px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[16px] disabled:bg-app-lightGray"
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
              ¿Ya tienes cuenta?{" "}
            </span>
            <Link
              to="/"
              className="text-[14px] font-semibold text-sofia-superDark hover:text-sofia-electricGreen hover:underline"
            >
              Inicia sesión
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

export default SignUp;
