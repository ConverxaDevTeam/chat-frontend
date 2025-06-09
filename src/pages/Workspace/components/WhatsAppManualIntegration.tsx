import Loading from "@components/Loading";
import RawModal from "@components/RawModal";
import { baseUrl } from "@config/config";
import { NodeData } from "@interfaces/workflow";
import {
  changeCodeIntegrationManual,
  getIntegrationWhatsAppManual,
  updateIntegrationWhatsAppManual,
} from "@services/integration";
import { RootState } from "@store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { alertConfirm } from "@utils/alerts";
import { useCounter } from "@hooks/CounterContext";

interface WhatsAppManualIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  data: NodeData;
}

interface IntegrationMessengerManualAPI {
  id: string;
  phone_number_id: string;
  waba_id: string;
  token: string;
  code_webhook: string;
  validated_webhook: boolean;
}

const WhatsAppManualIntegration: React.FC<WhatsAppManualIntegrationProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { increment } = useCounter();
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<IntegrationMessengerManualAPI>({
    id: "",
    phone_number_id: "",
    waba_id: "",
    token: "",
    code_webhook: "",
    validated_webhook: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    const response = await updateIntegrationWhatsAppManual(
      selectOrganizationId,
      selectedDepartmentId,
      data.id,
      {
        phone_number_id: info.phone_number_id,
        waba_id: info.waba_id,
        token: info.token,
      }
    );
    if (response) {
      alertConfirm("Se ha guardado la información");
      getIntegrationWhatsAppManualInfo();
      // Actualizar el diagrama usando el contador
      increment();
    }
  };

  const getIntegrationWhatsAppManualInfo = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    setLoading(true);
    const response = await getIntegrationWhatsAppManual(
      selectOrganizationId,
      selectedDepartmentId,
      data.id
    );
    if (response) {
      setInfo({
        id: response.id,
        phone_number_id: response.phone_number_id || "",
        waba_id: response.waba_id || "",
        token: response.token || "",
        code_webhook: response.code_webhook,
        validated_webhook: response.validated_webhook,
      });
    }

    setLoading(false);
  };

  const handleUpdateWebhook = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    const response = await changeCodeIntegrationManual(
      selectOrganizationId,
      selectedDepartmentId,
      data.id
    );
    if (response) {
      setInfo({
        ...info,
        code_webhook: response,
        validated_webhook: false,
      });
    }
  };

  useEffect(() => {
    if (!data.id) return;
    getIntegrationWhatsAppManualInfo();
  }, []);

  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[500px] bg-white p-[24px] rounded-[4px] justify-center">
        {loading ? (
          <div className="w-full min-h-[300px] flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
            <div className="w-full flex justify-between items-center mb-3">
              <p className="text-sofia-superDark font-semibold text-[24px]">
                Integración manual de WhatsApp
              </p>
              <img
                src="/mvp/vector-x.svg"
                alt="Cerrar"
                className="w-[14px] h-[14px] cursor-pointer"
                onClick={onClose}
              />
            </div>
            <hr className="border-t border-gray-300 -mx-6 mb-[24px]" />
            <label className="text-sofia-superDark font-bold text-[14px]">
              Webhook de Integración
            </label>
            <div className="flex gap-[8px] items-center w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  readOnly
                  value={`${baseUrl}/api/facebook/webhook/${info.id}`}
                  className="flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-lg border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal pr-12"
                />
                <img
                  src="/mvp/copy.svg"
                  alt="Copy"
                  className="cursor-pointer p-[8px] rounded-lg w-[36px] h-[36px] text-sofia-darkLight absolute right-2 top-1/2 transform -translate-y-1/2"
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
              <label className="text-sofia-superDark font-bold text-[14px]">
                Codigo de webhook
              </label>
              <div className="flex items-center gap-1">
                <p
                  className={`text-[12px] text-white py-[2px] px-[8px] rounded-[4px] ${
                    info.validated_webhook ? "bg-[#3AC0A0]" : "bg-[#FF616D]"
                  }`}
                >
                  {info.validated_webhook ? "Validado" : "No validado"}
                </p>
                {!info.validated_webhook && (
                  <p
                    className={`text-[12px] text-white py-[2px] px-[8px] rounded-[4px] bg-[#3AC0A0] flex items-center gap-2 cursor-pointer`}
                    onClick={() => {
                      getIntegrationWhatsAppManualInfo();
                      // También incrementamos el contador al verificar la conexión
                      increment();
                    }}
                  >
                    <span>Verificar conexión</span>
                    <img
                      src="/mvp/rotate-ccw-key.svg"
                      alt="Actualizar"
                      className="w-[16px] h-[16px]"
                    />
                  </p>
                )}
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={info.code_webhook}
                readOnly
                className="w-full border border-sofia-darkBlue p-[8px] pr-[90px] rounded-lg"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-[8px]">
                <img
                  src="/mvp/copy.svg"
                  alt="Copy"
                  className="cursor-pointer p-[8px] rounded-lg w-[36px] h-[36px]"
                  onClick={() => {
                    navigator.clipboard.writeText(info.code_webhook);
                    alertConfirm("Copiado");
                  }}
                />
                <img
                  src="/mvp/refresh-cw.svg"
                  alt="Refresh"
                  className="cursor-pointer p-[8px] rounded-lg w-[36px] h-[36px]"
                  onClick={handleUpdateWebhook}
                />
              </div>
            </div>
            <label
              htmlFor="phone_number_id"
              className="text-sofia-superDark font-bold text-[14px]"
            >
              Identificador de número de teléfono
            </label>
            <input
              type="text"
              id="phone_number_id"
              placeholder="Identificador de número de teléfono"
              onChange={e =>
                setInfo({ ...info, phone_number_id: e.target.value })
              }
              value={info.phone_number_id}
              required
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-sofia-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
            />
            <label
              htmlFor="waba_id"
              className="text-sofia-superDark font-bold text-[14px]"
            >
              Identificador de la cuenta de WhatsApp Business
            </label>
            <input
              type="text"
              id="waba_id"
              placeholder="Identificador de la cuenta de WhatsApp Business"
              onChange={e => setInfo({ ...info, waba_id: e.target.value })}
              value={info.waba_id}
              required
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-sofia-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
            />
            <label
              htmlFor="token"
              className="text-sofia-superDark font-bold text-[14px]"
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-sofia-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
            />
            <div className="flex gap-[16px] p-[16px] mt-[24px]">
              <button
                type="button"
                className="text-sofia-superDark font-semibold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[4px] flex justify-center items-center"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-sofia-superDark text-white font-semibold text-[16px] rounded-[4px] flex-1"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </RawModal>
  );
};

export default WhatsAppManualIntegration;
