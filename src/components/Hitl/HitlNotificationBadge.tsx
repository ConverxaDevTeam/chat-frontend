import React, { useState } from "react";
import { HitlNotification } from "@interfaces/hitl.interface";
import { useHitlNotifications } from "@hooks/useHitlNotifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@store";
// import { handleHitlNotification } from "@hooks/useHitlNotificationHandler";

interface HitlNotificationBadgeProps {
  organizationId: number;
  className?: string;
}

export const HitlNotificationBadge: React.FC<HitlNotificationBadgeProps> = ({
  organizationId,
  className = "",
}) => {
  console.log("🔍 DEBUG: HitlNotificationBadge montado", { organizationId });

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { myOrganizations } = useSelector((state: RootState) => state.auth);
  const userRole = myOrganizations.find(
    org => org.organization?.id === organizationId
  )?.role;

  const {
    hitlNotifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
  } = useHitlNotifications({ organizationId });

  const handleNotificationClick = async (
    event: React.MouseEvent,
    notification: HitlNotification,
    index: number
  ) => {
    try {
      console.log("🔍 DEBUG: CLICK INICIAL - Antes de cualquier cosa");

      // Log persistente para detectar recargas
      sessionStorage.setItem(
        "hitl_debug_log",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          action: "click_captured",
          notification: notification,
          userRole: userRole,
          organizationId: organizationId,
        })
      );

      console.log("🔍 DEBUG: Evento click capturado");
      event.preventDefault();
      event.stopPropagation();

      console.log("🔍 DEBUG: Click en notificación HITL", {
        notification,
        index,
        userRole,
        organizationId,
      });

      console.log("🔍 DEBUG: Marcando como leído...");
      markAsRead(index);

      console.log("🔍 DEBUG: Navegando a conversación...");
      navigate(`/conversation/detail/${notification.conversationId}`);

      setShowDropdown(false);
    } catch (error) {
      console.error("🔍 DEBUG: Error en handleNotificationClick:", error);
      sessionStorage.setItem(
        "hitl_debug_error",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          error: error.toString(),
          stack: error.stack,
        })
      );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  const recentNotifications = hitlNotifications.slice(0, 5);

  // Verificar si hay logs de debug persistentes al cargar
  React.useEffect(() => {
    const debugLog = sessionStorage.getItem("hitl_debug_log");
    if (debugLog) {
      console.log(
        "🔍 DEBUG: Log persistente encontrado:",
        JSON.parse(debugLog)
      );
      // Mantener el log por 10 segundos más para debugging
      setTimeout(() => {
        sessionStorage.removeItem("hitl_debug_log");
      }, 10000);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5h5m-5-15v6a3 3 0 01-3 3H9a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3z"
          />
        </svg>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection status indicator */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Notificaciones HITL
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Marcar como leídas
                </button>
              )}
            </div>

            {/* Connection Status */}
            <div
              className={`px-4 py-2 text-sm ${
                isConnected
                  ? "text-green-700 bg-green-50"
                  : "text-red-700 bg-red-50"
              }`}
            >
              {isConnected
                ? "🟢 Conectado - Recibiendo notificaciones"
                : "🔴 Desconectado"}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg
                    className="mx-auto w-12 h-12 text-gray-300 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5h5m-5-15v6a3 3 0 01-3 3H9a3 3 0 01-3-3V7a3 3 0 013 3z"
                    />
                  </svg>
                  <p>No hay notificaciones HITL</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Las nuevas intervenciones aparecerán aquí
                  </p>
                </div>
              ) : (
                recentNotifications.map((notification, index) => (
                  <div
                    key={`${notification.timestamp}-${index}`}
                    onClick={event => {
                      console.log("🔍 DEBUG: DIV onClick ejecutado");
                      handleNotificationClick(event, notification, index);
                    }}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.read ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.hitlType}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Conversación #{notification.conversationId}
                          </span>
                          {!notification.read && (
                            <span className="text-xs text-blue-600 font-medium">
                              Nueva
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {hitlNotifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(`/organizations/${organizationId}/hitl-types`);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ver todas las notificaciones
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
