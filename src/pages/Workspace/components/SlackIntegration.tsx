import React, { useEffect, useState } from "react";
import RawModal from "@components/RawModal";
import { NodeData } from "@interfaces/workflow";
import {
  changeChannelName,
  getChannelNameByIntegrationId,
} from "@services/integration";
import Loading from "@components/Loading";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

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
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [channelName, setChannelName] = useState<string>("");

  const getChannelName = async () => {
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    const respone = await getChannelNameByIntegrationId(
      selectedDepartmentId,
      selectOrganizationId,
      data.id
    );
    if (respone) {
      setChannelName(respone);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.id || !selectedDepartmentId || !selectOrganizationId) return;
    const respone = await changeChannelName(
      selectedDepartmentId,
      selectOrganizationId,
      data.id,
      channelName
    );
    if (respone) {
      onClose();
    }
  };

  useEffect(() => {
    if (!data.id) return;
    getChannelName();
  }, []);

  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div
        className={`flex flex-col w-[470px] ${loading ? "min-h-[300px]" : ""} bg-white p-[24px] rounded-[16px] justify-center`}
      >
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="w-full flex justify-between items-center mb-[24px]">
              <p className="text-sofia-superDark font-semibold text-[24px]">
                Integración de Slack
              </p>
              <IoClose
                className="w-[20px] h-[20px] cursor-pointer"
                onClick={onClose}
              />
            </div>
            <label
              htmlFor="channelName"
              className="text-sofia-superDark font-semibold text-[14px] mb-[8px]"
            >
              Nombre del canal
            </label>
            <input
              type="text"
              id="channelName"
              placeholder="Nombre del canal"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              className="flex w-full h-[56px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-sofia-darkBlue bg-[#FCFCFC] text-[14px] font-normal placeholder:text-[#A6A8AB]"
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

export default SlackIntegration;
