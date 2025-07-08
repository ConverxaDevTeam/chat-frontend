import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrls } from "../../config/config";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { useLocation, useNavigate } from "react-router-dom";

type ChangePasswordForm = {
  newPassword: string;
};

export const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const resetForm = useForm<ChangePasswordForm>();

  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const email = params.get("email");

  useEffect(() => {
    if (!code || !email) {
      toast.error("Link inválido");
      navigate("/reset-password");
    }
  }, [code, email, navigate]);

  const handleResetPassword = async (data: ChangePasswordForm) => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrls.resetPassword(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to reset password");

      toast.success("Contraseña actualizada exitosamente");
      window.location.href = "/";
    } catch (error) {
      toast.error("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

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
            Cambiar Contraseña
          </h2>

          <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
            <InputGroup
              label="Nueva Contraseña"
              errors={resetForm.formState.errors.newPassword}
            >
              <Input
                type="password"
                placeholder="Nueva contraseña"
                register={resetForm.register("newPassword", {
                  required: "Contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                })}
              />
            </InputGroup>

            <button
              className="w-full rounded-[8px] py-[10px] bg-sofia-electricGreen text-sofia-superDark text-[16px] font-semibold mb-[24px] mt-4 disabled:bg-app-lightGray"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        </div>
      </div>

      <p className="mx-auto text-[12px] mb-[38px] font-normal text-center text-sofia-superDark">
        Version 2.0
        <br /> SOF.IA LLM 2024 Derechos Reservados
      </p>
    </div>
  );
};
