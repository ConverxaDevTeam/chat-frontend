import RawModal from "@components/RawModal";
import { baseUrl } from "@config/config";
import { NodeData } from "@interfaces/workflow";
import {
  changeCodeIntegrationManual,
  getIntegrationMessangerManual,
  updateIntegrationMessangerManual,
} from "@services/integration";
import { RootState } from "@store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { alertConfirm } from "@utils/alerts";
import { useCounter } from "@hooks/CounterContext";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface MessengerManualIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  data: NodeData;
}

interface IntegrationMessengerManualAPI {
  id: string;
  page_id: string;
  token: string;
  code_webhook: string;
  validated_webhook: boolean;
}

const MessengerManualIntegration: React.FC<MessengerManualIntegrationProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { increment } = useCounter();
  const { handleOperation } = useAlertContext();
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const [info, setInfo] = useState<IntegrationMessengerManualAPI>({
    id: "",
    page_id: "",
    token: "",
    code_webhook: "",
    validated_webhook: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;

    const result = await handleOperation(
      async () => {
        const response = await updateIntegrationMessangerManual(
          selectOrganizationId,
          selectedDepartmentId,
          data.id!,
          info.page_id,
          info.token
        );
        if (!response) {
          throw new Error("Error al guardar la configuración");
        }
        return response;
      },
      {
        title: "Guardando configuración",
        successTitle: "Configuración guardada",
        successText: "Se ha guardado la información de Messenger",
        errorTitle: "Error al guardar",
        loadingTitle: "Guardando configuración de Messenger",
      }
    );

    if (result.success) {
      getIntegrationMessangerManualInfo();
      // Actualizar el diagrama usando el contador
      increment();
    }
  };

  const getIntegrationMessangerManualInfo = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;

    const result = await handleOperation(
      async () => {
        const response = await getIntegrationMessangerManual(
          selectOrganizationId,
          selectedDepartmentId,
          data.id!
        );
        if (!response) {
          throw new Error("Error al cargar la configuración");
        }
        return response;
      },
      {
        title: "Cargando configuración",
        successTitle: "Configuración cargada",
        successText: "Se ha cargado la configuración de Messenger",
        errorTitle: "Error al cargar",
        loadingTitle: "Cargando configuración de Messenger",
        showSuccess: false,
      }
    );

    if (result.success && result.data) {
      setInfo({
        id: result.data.id,
        page_id: result.data.page_id || "",
        token: result.data.token || "",
        code_webhook: result.data.code_webhook,
        validated_webhook: result.data.validated_webhook,
      });
    }
  };

  const handleUpdateWebhook = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;

    const result = await handleOperation(
      async () => {
        const response = await changeCodeIntegrationManual(
          selectOrganizationId,
          selectedDepartmentId,
          data.id!
        );
        if (!response) {
          throw new Error("Error al actualizar el código webhook");
        }
        return response;
      },
      {
        title: "Actualizando webhook",
        successTitle: "Webhook actualizado",
        successText: "Se ha generado un nuevo código webhook",
        errorTitle: "Error al actualizar webhook",
        loadingTitle: "Actualizando código webhook",
      }
    );

    if (result.success && result.data) {
      setInfo({
        ...info,
        code_webhook: result.data,
        validated_webhook: false,
      });
      // Actualizar el diagrama usando el contador cuando se actualiza el webhook
      increment();
    }
  };

  useEffect(() => {
    if (!data.id) return;
    getIntegrationMessangerManualInfo();
  }, []);

  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[500px] bg-white p-[24px] rounded-[4px] justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-app-superDark font-semibold text-[24px]">
              Integración manual de Messenger
            </p>
            <img
              src="/mvp/vector-x.svg"
              alt="Cerrar"
              className="w-[14px] h-[14px] cursor-pointer"
              onClick={onClose}
            />
          </div>
          <hr className="border-t border-gray-300 -mx-6 mb-[24px]" />
          <label className="text-app-superDark font-bold text-[14px]">
            Webhook de Integración
          </label>
          <div className="flex gap-[8px] items-center w-full">
            <div className="relative w-full">
              <input
                type="text"
                readOnly
                value={`${baseUrl}/api/facebook/webhook/${info.id}`}
                className="flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-app-darkBlue text-app-superDark text-[14px] font-normal leading-normal pr-12"
              />
              <img
                src="/mvp/copy.svg"
                alt="Copy"
                className="cursor-pointer p-[8px] rounded-[4px] w-[36px] h-[36px] text-app-darkLight absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${baseUrl}/api/facebook/webhook/${info.id}`
                  );
                  alertConfirm("Copiado");
                }}
              />
            </div>
          </div>
          <div className="flex gap-[8px] items-center">
            <label className="text-app-superDark font-bold text-[14px]">
              Codigo de webhook
            </label>
            <p
              className={`text-[12px] text-white py-[2px] px-[8px] rounded-[4px] ${
                info.validated_webhook ? "bg-[#3AC0A0]" : "bg-[#FF616D]"
              }`}
            >
              {info.validated_webhook ? "Validado" : "No validado"}
            </p>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={info.code_webhook}
              readOnly
              className="w-full border border-app-darkBlue p-[8px] pr-[90px] rounded-[4px]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-[8px]">
              <img
                src="/mvp/copy.svg"
                alt="Copy"
                className="cursor-pointer p-[8px] rounded-[4px] w-[36px] h-[36px] text-app-darkLight"
                onClick={() => {
                  navigator.clipboard.writeText(info.code_webhook);
                  alertConfirm("Copiado");
                }}
              />
              <img
                src="/mvp/refresh-cw.svg"
                alt="Refresh"
                className="cursor-pointer p-[8px] rounded-[4px] w-[36px] h-[36px]"
                onClick={handleUpdateWebhook}
              />
            </div>
          </div>
          <label
            htmlFor="page_id"
            className="text-app-superDark font-bold text-[14px]"
          >
            Identificador de pagina
          </label>
          <input
            type="text"
            id="page_id"
            placeholder="Identificador de pagina"
            onChange={e => setInfo({ ...info, page_id: e.target.value })}
            value={info.page_id}
            required
            className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-[4px] border border-app-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
          />
          <label
            htmlFor="token"
            className="text-app-superDark font-bold text-[14px]"
          >
            token
          </label>
          <input
            type="text"
            id="token"
            placeholder="token"
            onChange={e => setInfo({ ...info, token: e.target.value })}
            value={info.token}
            required
            className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-[4px] border border-app-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
          />
          <div className="flex gap-[24px] mt-[24px]">
            <button
              type="button"
              className="text-app-superDark font-semibold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[4px] flex justify-center items-center"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-app-electricGreen text-app-superDark font-semibold text-[16px] flex-1 h-[48px] border rounded-[4px] flex justify-center items-center"
              onClick={getIntegrationMessangerManualInfo}
            >
              Actualizar
            </button>
            <button
              type="submit"
              className="bg-app-superDark text-white font-semibold text-[16px] rounded-[4px] h-[48px] flex-1"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </RawModal>
  );
};

export default MessengerManualIntegration;
