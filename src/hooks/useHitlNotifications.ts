import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { HitlNotification } from "@interfaces/hitl.interface";
import { toast } from "react-toastify";

interface UseHitlNotificationsProps {
  organizationId: number;
  onNotificationReceived?: (notification: HitlNotification) => void;
}

export const useHitlNotifications = ({
  organizationId,
  onNotificationReceived,
}: UseHitlNotificationsProps) => {
  const [hitlNotifications, setHitlNotifications] = useState<
    HitlNotification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const { socket } = useSelector((state: RootState) => state.auth);

  const handleHitlNotification = useCallback(
    (data: HitlNotification) => {
      const notification: HitlNotification = {
        type: data.type,
        message: data.message,
        conversationId: data.conversationId,
        hitlType: data.hitlType,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      // Add to notifications list
      setHitlNotifications(prev => [notification, ...prev]);

      // Increment unread count
      setUnreadCount(prev => prev + 1);

      // Show toast notification
      toast.info(
        `Nueva intervención HITL requerida: ${notification.hitlType}`,
        {
          onClick: () => {
            // Navigate to conversation when toast is clicked
            window.location.href = `/conversation/detail/${notification.conversationId}`;
          },
          autoClose: 8000,
          closeOnClick: true,
        }
      );

      // Call external handler if provided
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    },
    [onNotificationReceived]
  );

  useEffect(() => {
    if (socket && organizationId) {
      setIsConnected(socket.connected);

      // Listen for HITL notifications
      socket.on("hitl-notification", handleHitlNotification);

      // Listen for connection status changes
      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen for assignment updates
      socket.on(
        "hitl-assignment-updated",
        (data: { hitlTypeId: number; action: "assigned" | "removed" }) => {
          toast.info(
            `Asignación HITL actualizada: ${
              data.action === "assigned"
                ? "Usuario asignado"
                : "Usuario removido"
            }`,
            {
              autoClose: 3000,
            }
          );
        }
      );

      return () => {
        socket.off("hitl-notification", handleHitlNotification);
        socket.off("connect");
        socket.off("disconnect");
        socket.off("hitl-assignment-updated");
      };
    }
  }, [socket, organizationId, handleHitlNotification]);

  const markAsRead = useCallback((notificationIndex: number) => {
    setHitlNotifications(prev =>
      prev.map((notification, index) =>
        index === notificationIndex
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setHitlNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setHitlNotifications([]);
    setUnreadCount(0);
  }, []);

  const getNotificationsByType = useCallback(
    (hitlType: string) => {
      return hitlNotifications.filter(
        notification => notification.hitlType === hitlType
      );
    },
    [hitlNotifications]
  );

  const getUnreadNotifications = useCallback(() => {
    return hitlNotifications.filter(notification => !notification.read);
  }, [hitlNotifications]);

  return {
    hitlNotifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getNotificationsByType,
    getUnreadNotifications,
  };
};
