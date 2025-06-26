import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrls } from "../../config/config";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Link } from "react-router-dom";

type RequestResetForm = {
  email: string;
};

export const RequestResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const requestForm = useForm<RequestResetForm>();

  const handleRequestReset = async (data: RequestResetForm) => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrls.requestResetPassword(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to request password reset");

      toast.success("Código enviado a tu correo");
    } catch (error) {
      toast.error("Error al solicitar el código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex flex-col w-[446px] p-[12px] rounded border border-[#B8CCE0] border-inherit m-auto">
        <div className="bg-white px-[32px] pt-[53px] pb-[40px]">
          <img
            className="mx-auto mb-[48px] h-[34px]"
            src="/logo.svg"
            alt="logo"
          />
          <h2 className="font-semibold text-[30px] text-sofia-superDark mb-[16px] text-center">
            Restablecer contraseña
          </h2>

          <form onSubmit={requestForm.handleSubmit(handleRequestReset)}>
            <InputGroup
              label="Email"
              errors={requestForm.formState.errors.email}
            >
              <Input
                type="email"
                placeholder="Ingresa tu correo"
                register={requestForm.register("email", {
                  required: "Email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
              />
            </InputGroup>

            <button
              className="w-full rounded py-[10px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[24px] mt-4 disabled:bg-app-lightGray"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar código"}
            </button>
            <div className="text-center">
              <Link
                to="/"
                className="text-[14px] font-medium text-sofia-superDark hover:text-sofia-electricGreen hover:underline"
              >
                Volver a inicio de sesión
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
