import { useState, useEffect } from "react";
import {
  getSessions,
  deleteSessionById,
  getSessionId,
} from "../../../store/actions/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { formatDateFullString } from "../../../utils/format";

interface ISession {
  id: number;
  expiredAt: Date;
  ip: string;
  browser: string;
  operatingSystem: string;
}

const ListSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sessions, setSessions] = useState<ISession[]>([]);
  const sessionID = getSessionId();

  const getSessionsList = async () => {
    const response = await getSessions(dispatch);
    if (response) {
      setSessions(response);
    }
  };

  const deleteSession = async (id: number) => {
    const response = await deleteSessionById(id);
    if (response) {
      getSessionsList();
    }
  };

  useEffect(() => {
    getSessionsList();
  }, []);

  return (
    <div className="flex flex-col max-h-64 overflow-auto gap-3">
      <table className="w-full divide-y font-poppinsRegular divide-gray-200 leading-[18px] text-[14px]">
        <thead>
          <tr className="text-center">
            <th className="px-4 py-2 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              Tiempo
            </th>
            <th className="px-6 py-2 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              IP
            </th>
            <th className="px-4 py-2 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              Navegador
            </th>
            <th className="px-4 py-2 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              Sistema Operativo
            </th>
            <th className="px-4 py-2 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              Remover
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map(session => {
            return (
              <tr key={session.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatDateFullString(session.expiredAt)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{session.ip}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {session.browser}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {session.operatingSystem}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => deleteSession(session.id)}
                    className="w-[146px] bg-sofiaCall-dark h-[36px] rounded-full flex justify-center items-center gap-[8px] text-sofiaCall-electricGreen border-[1px] border-sofiaCall-dark disabled:bg-opacity-0 disabled:border-[#BBBBBB] disabled:text-[#BBBBBB]"
                  >
                    <p className="font-poppinsMedium leading-[8px] text-[12px]">
                      {session.id === sessionID
                        ? "Cerrar Actual Sesión"
                        : "Cerrar"}
                    </p>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListSession;
