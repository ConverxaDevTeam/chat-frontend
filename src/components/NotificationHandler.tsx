import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@store";
import { onWebSocketEvent } from "@services/websocket.service";
import { toast } from "react-toastify";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  NotificationMessage,
  MessageReceivedNotification,
  NotificationType,
} from "@interfaces/notifications.interface";
import { incrementNotificationCount } from "../store/reducers/notifications";
import { handleHitlNotification } from "@hooks/useHitlNotificationHandler";

const renderMessageRecivedNotification = (
  conversationId: number,
  message: string,
  navigate: NavigateFunction
) => {
  toast.warning(
    <div
      onClick={() => navigate(`/conversation/detail/${conversationId}`)}
      className="cursor-pointer"
    >
      {message}
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};

const NotificationHandler = () => {
  const socket = useSelector((state: RootState) => state.auth.socket);
  const { selectOrganizationId, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = myOrganizations.find(
    org => org.organization?.id === selectOrganizationId
  )?.role;

  useEffect(() => {
    if (!socket) return;

    const handleNotification = async (
      notification: NotificationMessage<MessageReceivedNotification>
    ) => {
      const { type, message, data } = notification;

      switch (type) {
        case NotificationType.MESSAGE_RECEIVED: {
          dispatch(incrementNotificationCount());

          // Intentar manejar como notificación HITL primero
          console.log("🔍 DEBUG: Iniciando verificación notificación HITL", {
            conversationId: data.conversationId,
            message,
            userRole,
            selectOrganizationId,
          });

          const wasHandledAsHitl = await handleHitlNotification(
            data.conversationId,
            message,
            userRole,
            selectOrganizationId
          );

          console.log("🔍 DEBUG: Resultado handleHitlNotification:", {
            wasHandledAsHitl,
          });

          // Si no fue manejada como HITL, usar el comportamiento normal
          if (!wasHandledAsHitl) {
            renderMessageRecivedNotification(
              data.conversationId,
              message,
              navigate
            );
          }
          break;
        }
        default:
          console.warn("Tipo de notificación no manejado:", type);
      }
    };

    onWebSocketEvent<NotificationMessage<MessageReceivedNotification>>(
      "notification",
      handleNotification
    );

    return () => {
      // Cleanup listener when component unmounts
      if (socket) {
        socket.off("notification", handleNotification);
      }
    };
  }, [socket, navigate, dispatch, userRole, selectOrganizationId]);
  return null;
};

export default NotificationHandler;
