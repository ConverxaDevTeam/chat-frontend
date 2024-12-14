import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { onWebSocketEvent } from "@services/websocket.service";
import { toast } from "react-toastify";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  NotificationMessage,
  MessageReceivedNotification,
  NotificationType,
} from "@interfaces/notifications.interface";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (
      notification: NotificationMessage<MessageReceivedNotification>
    ) => {
      const { type, message, data } = notification;

      switch (type) {
        case NotificationType.MESSAGE_RECEIVED:
          renderMessageRecivedNotification(
            data.conversationId,
            message,
            navigate
          );
          break;
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
  }, [socket, navigate]);
  return null;
};

export default NotificationHandler;
