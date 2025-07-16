import React, { useEffect, useState } from "react";
import RawModal from "@components/RawModal";
import { NodeData } from "@interfaces/workflow";
import {
  changeChannelName,
  getChannelNameByIntegrationId,
} from "@services/integration";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { useCounter } from "@hooks/CounterContext";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface SlackIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  data: NodeData;
}

const SlackIntegration: React.FC<SlackIntegrationProps> = ({
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
  const [channelName, setChannelName] = useState<string>("");

  const getChannelName = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;

    const result = await handleOperation(
      async () => {
        const response = await getChannelNameByIntegrationId(
          selectOrganizationId,
          selectedDepartmentId,
          data.id!
        );
        if (!response) {
          throw new Error("Error al cargar el nombre del canal");
        }
        return response;
      },
      {
        title: "Cargando configuración",
        successTitle: "Configuración cargada",
        successText: "Se ha cargado la configuración de Slack",
        errorTitle: "Error al cargar",
        loadingTitle: "Cargando configuración de Slack",
        showSuccess: false,
      }
    );

    if (result.success && result.data) {
      setChannelName(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;

    const result = await handleOperation(
      async () => {
        const response = await changeChannelName(
          selectOrganizationId,
          selectedDepartmentId,
          data.id!,
          channelName
        );
        if (!response) {
          throw new Error("Error al cambiar el nombre del canal");
        }
        return response;
      },
      {
        title: "Guardando configuración",
        successTitle: "Canal actualizado",
        successText: "Se ha actualizado el nombre del canal de Slack",
        errorTitle: "Error al guardar",
        loadingTitle: "Guardando configuración de Slack",
      }
    );

    if (result.success) {
      // Actualizar el diagrama usando el contador
      increment();
      onClose();
    }
  };

  useEffect(() => {
    if (!data.id) return;
    getChannelName();
  }, []);

  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[470px] bg-white p-[24px] rounded-[4px] justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="w-full flex justify-between items-center mb-[24px]">
            <p className="text-app-superDark font-semibold text-[24px]">
              Integración de Slack
            </p>
            <img
              src="/mvp/vector-x.svg"
              alt="Cerrar"
              className="w-[14px] h-[14px] cursor-pointer"
              onClick={onClose}
            />
          </div>
          <label
            htmlFor="channelName"
            className="text-app-superDark font-semibold text-[14px] mb-[8px]"
          >
            Nombre del canal
          </label>
          <input
            type="text"
            id="channelName"
            placeholder="Nombre del canal"
            value={channelName}
            onChange={e => setChannelName(e.target.value)}
            className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-darkBlue text-[14px] font-normal placeholder:text-[#A6A8AB]"
          />
          <div className="flex gap-[16px] mt-[24px]">
            <button
              type="button"
              className="text-app-superDark font-semibold text-[16px] flex-1 h-[48px] border border-app-gray rounded-[4px] flex justify-center items-center"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-app-electricGreen text-app-superDark font-semibold text-[16px] rounded-[4px] flex-1"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </RawModal>
  );
};

export default SlackIntegration;
