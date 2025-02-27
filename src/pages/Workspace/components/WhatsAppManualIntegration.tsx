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
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RiFileCopy2Line } from "react-icons/ri";
import { alertConfirm } from "@utils/alerts";
import { RxUpdate } from "react-icons/rx";

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
      selectedDepartmentId,
      selectOrganizationId,
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
      <div
        className={`flex flex-col w-[500px] ${loading ? "min-h-[300px]" : ""} bg-white p-[24px] rounded-[16px] justify-center`}
      >
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
            <div className="w-full flex justify-between items-center mb-[24px]">
              <p className="text-sofia-superDark font-semibold text-[24px]">
                Integración de Messenger Manual
              </p>
              <IoClose
                className="w-[20px] h-[20px] cursor-pointer"
                onClick={onClose}
              />
            </div>
            <label className="text-sofia-superDark font-bold text-[14px]">
              Webhook de Integración
            </label>
            <div className="flex gap-[8px] items-center">
              <p className="flex-1 bg-sofia-darkBlue p-[8px] rounded-lg">{`${baseUrl}/api/facebook/webhook/${info.id}`}</p>
              <RiFileCopy2Line
                className="cursor-pointer bg-sofia-darkBlue p-[8px] rounded-lg w-[36px] h-[36px] text-sofia-darkLight"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${baseUrl}/api/facebook/webhook/${info.id}`
                  );
                  alertConfirm("Copiado");
                }}
              />
            </div>
            <div className="flex gap-[8px] items-center">
              <label className="text-sofia-superDark font-bold text-[14px]">
                Codigo de webhook
              </label>
              <p
                className={`text-[12px] text-sofia-superDark py-[2px] px-[8px] rounded-lg ${
                  info.validated_webhook ? "bg-green-300" : "bg-red-300"
                }`}
              >
                {info.validated_webhook ? "Validado" : "No validado"}
              </p>
            </div>
            <div className="flex gap-[8px] items-center">
              <p className="flex-1 bg-sofia-darkBlue p-[8px] rounded-lg">
                {info.code_webhook}
              </p>
              <RiFileCopy2Line
                className="cursor-pointer bg-sofia-darkBlue p-[8px] rounded-lg w-[36px] h-[36px] text-sofia-darkLight"
                onClick={() => {
                  navigator.clipboard.writeText(info.code_webhook);
                  alertConfirm("Copiado");
                }}
              />
              <RxUpdate
                className="cursor-pointer bg-sofia-darkBlue p-[8px] rounded-lg w-[36px] h-[36px] text-sofia-darkLight"
                onClick={handleUpdateWebhook}
              />
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro text-[14px] font-normal placeholder:text-[#A6A8AB]"
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro text-[14px] font-normal placeholder:text-[#A6A8AB]"
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro text-[14px] font-normal placeholder:text-[#A6A8AB]"
            />
            <div className="flex gap-[24px] mt-[24px]">
              <button
                type="button"
                className="text-sofia-superDark font-bold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[8px] flex justify-center items-center"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="text-sofia-superDark font-bold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[8px] flex justify-center items-center"
                onClick={getIntegrationWhatsAppManualInfo}
              >
                Actualizar
              </button>
              <button
                type="submit"
                className="bg-sofia-electricGreen text-sofia-superDark font-bold text-[16px] rounded-[8px] flex-1"
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
