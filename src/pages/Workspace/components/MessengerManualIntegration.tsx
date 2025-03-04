import Loading from "@components/Loading";
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
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const [loading, setLoading] = useState<boolean>(true);
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
    const response = await updateIntegrationMessangerManual(
      selectOrganizationId,
      selectedDepartmentId,
      data.id,
      info.page_id,
      info.token
    );
    if (response) {
      alertConfirm("Se ha guardado la información");
      getIntegrationMessangerManualInfo();
    }
  };

  const getIntegrationMessangerManualInfo = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    setLoading(true);
    const response = await getIntegrationMessangerManual(
      selectOrganizationId,
      selectedDepartmentId,
      data.id
    );
    if (response) {
      setInfo({
        id: response.id,
        page_id: response.page_id || "",
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
    getIntegrationMessangerManualInfo();
  }, []);

  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div
        className={`flex flex-col w-[500px] ${loading ? "min-h-[300px]" : ""} bg-white p-[24px] rounded-[4px] justify-center`}
      >
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
            <div className="w-full flex justify-between items-center mb-[24px]">
              <p className="text-sofia-superDark font-semibold text-[24px]">
                Integración manual de Messenger
              </p>
              <img
                src="/mvp/vector-x.svg"
                alt="Cerrar"
                className="w-[14px] h-[14px] cursor-pointer" 
                onClick={onClose}
              />
            </div>
            <label className="text-sofia-superDark font-bold text-[14px]">
              Webhook de Integración
            </label>
            <div className="flex gap-[8px] items-center w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  readOnly
                  value={`${baseUrl}/api/facebook/webhook/${info.id}`}
                  className="flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal pr-12"
                />
                <img
                  src="/mvp/copy.svg"
                  alt="Copy"
                  className="cursor-pointer p-[8px] rounded-[4px] w-[36px] h-[36px] text-sofia-darkLight absolute top-1/2 right-2 -translate-y-1/2"
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
                className="w-full border border-sofia-darkBlue p-[8px] pr-[90px] rounded-[4px]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-[8px]">
                <img
                  src="/mvp/copy.svg"
                  alt="Copy"
                  className="cursor-pointer p-[8px] rounded-[4px] w-[36px] h-[36px] text-sofia-darkLight"
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
              className="text-sofia-superDark font-bold text-[14px]"
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-[4px] border border-sofia-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
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
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-[4px] border border-sofia-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
            />
            <div className="flex gap-[24px] mt-[24px]">
              <button
                type="button"
                className="text-sofia-superDark font-semibold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[4px] flex justify-center items-center"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-sofia-electricGreen text-sofia-superDark font-semibold text-[16px] flex-1 h-[48px] border rounded-[4px] flex justify-center items-center"
                onClick={getIntegrationMessangerManualInfo}
              >
                Actualizar
              </button>
              <button
                type="submit"
                className="bg-sofia-superDark text-white font-semibold text-[16px] rounded-[4px] h-[48px] flex-1"
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

export default MessengerManualIntegration;
