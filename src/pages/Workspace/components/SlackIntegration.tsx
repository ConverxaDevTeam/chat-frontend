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
      <div className="flex flex-col w-[600px] min-h-[300px] bg-white p-[24px] rounded-[16px] justify-center">
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Integración de Slack</p>
            <label
              htmlFor="channelName"
              className="text-sofia-superDark font-bold text-[14px] mt-[24px]"
            >
              Nombre del canal
            </label>
            <input
              type="text"
              id="channelName"
              placeholder="Nombre del canal"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              className="flex w-[149px] h-[37px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro text-xs font-normal placeholder:text-[#A6A8AB]"
            />
            <div className="flex justify-end mt-[24px]">
              <button
                type="button"
                className="text-sofia-superDark font-bold text-[14px] mr-[16px]"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-red-500 text-white font-bold text-[14px] px-[16px] py-[8px] rounded-[8px]"
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
