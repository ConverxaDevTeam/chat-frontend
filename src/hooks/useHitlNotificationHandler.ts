import { toast } from "react-toastify";
import React from "react";
import { OrganizationRoleType } from "@utils/interfaces";
import { getHitlTypes } from "@services/hitl.service";
import { assignConversationToHitl } from "@services/conversations";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const extractHitlTypeFromMessage = (message: string): string | null => {
  const match = message.match(/^\[([^\]]+)\]/);
  return match ? match[1].trim() : null;
};

const verifyHitlTypeExists = async (
  hitlTypeName: string,
  organizationId: number
): Promise<boolean> => {
  try {
    console.log("🔍 DEBUG: Llamando getHitlTypes", {
      hitlTypeName,
      organizationId,
    });
    const hitlTypes = await getHitlTypes(organizationId);
    console.log("🔍 DEBUG: Tipos HITL obtenidos", { hitlTypes });

    const exists = hitlTypes.some(
      type => type.name.toLowerCase() === hitlTypeName.toLowerCase()
    );
    console.log("🔍 DEBUG: Verificación de existencia completada", { exists });
    return exists;
  } catch (error) {
    console.error("🔍 DEBUG: Error verificando tipos HITL:", error);
    return false;
  }
};

const renderHitlNotificationContent = (
  hitlTypeName: string,
  message: string
) => {
  return React.createElement(
    "div",
    { className: "cursor-pointer" },
    React.createElement(
      "div",
      { className: "font-medium text-sm" },
      `Notificación HITL: ${hitlTypeName}`
    ),
    React.createElement(
      "div",
      { className: "text-xs text-gray-600 mt-1" },
      message
    ),
    React.createElement(
      "div",
      { className: "text-xs text-blue-600 mt-2 font-medium" },
      "Click para asignar automáticamente"
    )
  );
};

const handleAutoAssignment = async (
  conversationId: number,
  hitlTypeName: string
) => {
  console.log("🔍 DEBUG: handleAutoAssignment iniciada", {
    conversationId,
    hitlTypeName,
  });

  try {
    console.log("🔍 DEBUG: Llamando assignConversationToHitl...");
    const result = await assignConversationToHitl(conversationId);
    console.log("🔍 DEBUG: Resultado de assignConversationToHitl", { result });

    if (result.ok) {
      console.log("🔍 DEBUG: Asignación exitosa, mostrando toast de éxito");
      toast.success(
        `Conversación asignada automáticamente para tipo HITL: ${hitlTypeName}`,
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } else {
      // Manejar caso donde ya está asignado
      const errorMessage = result.message || "Error al asignar conversación";
      console.log("🔍 DEBUG: Asignación falló, mensaje de error", {
        errorMessage,
      });

      if (
        errorMessage.toLowerCase().includes("ya asignado") ||
        errorMessage.toLowerCase().includes("already assigned")
      ) {
        console.log("🔍 DEBUG: Conversación ya asignada, mostrando toast info");
        toast.info(`Esta conversación ya fue asignada a otro agente`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.log("🔍 DEBUG: Error genérico, mostrando toast error");
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  } catch (error: unknown) {
    console.log("🔍 DEBUG: Excepción capturada en handleAutoAssignment", {
      error,
    });
    const apiError = error as ApiError;
    const errorMessage = apiError?.response?.data?.message || apiError?.message;

    if (
      errorMessage?.toLowerCase().includes("ya asignado") ||
      errorMessage?.toLowerCase().includes("already assigned")
    ) {
      console.log(
        "🔍 DEBUG: Error de ya asignado en catch, mostrando toast info"
      );
      toast.info(`Esta conversación ya fue asignada a otro agente`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      console.log("🔍 DEBUG: Error genérico en catch, mostrando toast error");
      toast.error("Error al asignar conversación", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }
};

export const handleHitlNotification = async (
  conversationId: number,
  message: string,
  userRole: OrganizationRoleType | undefined,
  organizationId: number | null
): Promise<boolean> => {
  // Log persistente al inicio
  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "handler_started",
      conversationId,
      message,
      userRole,
      organizationId,
    })
  );

  console.log("🔍 DEBUG: handleHitlNotification iniciada", {
    conversationId,
    message,
    userRole,
    organizationId,
  });

  // Solo procesar si el usuario es HITL
  if (userRole !== OrganizationRoleType.HITL) {
    sessionStorage.setItem(
      "hitl_handler_debug",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        step: "not_hitl_user",
        userRole,
      })
    );
    console.log("🔍 DEBUG: Usuario no es HITL, saltando procesamiento", {
      userRole,
    });
    return false;
  }

  if (!organizationId) {
    sessionStorage.setItem(
      "hitl_handler_debug",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        step: "no_organization_id",
      })
    );
    console.log("🔍 DEBUG: No hay organizationId, saltando procesamiento");
    return false;
  }

  // Extraer tipo HITL del mensaje
  const hitlTypeName = extractHitlTypeFromMessage(message);
  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "extracted_hitl_type",
      hitlTypeName,
      message,
    })
  );
  console.log("🔍 DEBUG: Tipo HITL extraído del mensaje", {
    hitlTypeName,
    message,
  });

  if (!hitlTypeName) {
    sessionStorage.setItem(
      "hitl_handler_debug",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        step: "no_hitl_type_found",
      })
    );
    console.log("🔍 DEBUG: No se encontró tipo HITL en el mensaje");
    return false;
  }

  // Verificar que el tipo HITL existe en la organización
  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "before_verify_type",
      hitlTypeName,
    })
  );
  console.log("🔍 DEBUG: Verificando si tipo HITL existe en organización...");
  const typeExists = await verifyHitlTypeExists(hitlTypeName, organizationId);
  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "after_verify_type",
      typeExists,
    })
  );
  console.log("🔍 DEBUG: Resultado verificación tipo HITL", { typeExists });

  if (!typeExists) {
    sessionStorage.setItem(
      "hitl_handler_debug",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        step: "type_does_not_exist",
      })
    );
    console.log("🔍 DEBUG: Tipo HITL no existe en la organización");
    return false;
  }

  // Crear toast clickeable para auto-asignación
  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "creating_toast",
    })
  );
  console.log("🔍 DEBUG: Creando toast clickeable para auto-asignación");
  toast.warning(renderHitlNotificationContent(hitlTypeName, message), {
    position: "top-right",
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    onClick: () => {
      sessionStorage.setItem(
        "hitl_handler_debug",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          step: "toast_clicked",
          conversationId,
          hitlTypeName,
        })
      );
      console.log("🔍 DEBUG: Usuario hizo click en toast HITL", {
        conversationId,
        hitlTypeName,
      });
      handleAutoAssignment(conversationId, hitlTypeName);
    },
  });

  sessionStorage.setItem(
    "hitl_handler_debug",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      step: "toast_created_successfully",
    })
  );
  console.log("🔍 DEBUG: Toast creado exitosamente, retornando true");
  return true;
};
