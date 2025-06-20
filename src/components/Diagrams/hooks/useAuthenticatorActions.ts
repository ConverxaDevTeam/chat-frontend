import { useCallback } from "react";
import { useAlertContext } from "../components/AlertContext";
import { authenticatorService } from "@/services/authenticator.service";
import { functionsService } from "@/services/functions.service";
import { AuthenticatorType } from "@interfaces/autenticators.interface";
import { useCounter } from "@hooks/CounterContext";

export const useCreateAuthenticator = () => {
  const { handleOperation } = useAlertContext();
  const { increment } = useCounter();

  return useCallback(
    async (authenticatorData: AuthenticatorType) => {
      const result = await handleOperation(
        async () => {
          const response = await authenticatorService.create(authenticatorData);
          if (!response) {
            throw new Error("Error al crear el autenticador");
          }
          return response;
        },
        {
          title: "Creando autenticador",
          successTitle: "Autenticador creado",
          successText: "Autenticador creado exitosamente",
          errorTitle: "Error al crear",
          loadingTitle: "Creando autenticador",
        }
      );

      if (result.success) {
        // Actualizar el diagrama usando el contador
        increment();
      }

      return result;
    },
    [handleOperation, increment]
  );
};

export const useUpdateAuthenticator = () => {
  const { handleOperation } = useAlertContext();
  const { increment } = useCounter();

  return useCallback(
    async (id: number, authenticatorData: AuthenticatorType) => {
      const result = await handleOperation(
        async () => {
          const response = await authenticatorService.update(
            id,
            authenticatorData
          );
          if (!response) {
            throw new Error("Error al actualizar el autenticador");
          }
          return response;
        },
        {
          title: "Actualizando autenticador",
          successTitle: "Autenticador actualizado",
          successText: "Autenticador actualizado exitosamente",
          errorTitle: "Error al actualizar",
          loadingTitle: "Actualizando autenticador",
        }
      );

      if (result.success) {
        // Actualizar el diagrama usando el contador
        increment();
      }

      return result;
    },
    [handleOperation, increment]
  );
};

export const useDeleteAuthenticator = () => {
  const { handleOperation } = useAlertContext();
  const { increment } = useCounter();

  return useCallback(
    async (id: number) => {
      const result = await handleOperation(
        async () => {
          await authenticatorService.remove(id);
          return true;
        },
        {
          title: "Eliminando autenticador",
          successTitle: "Autenticador eliminado",
          successText: "Autenticador eliminado exitosamente",
          errorTitle: "Error al eliminar",
          loadingTitle: "Eliminando autenticador",
        }
      );

      if (result.success) {
        // Actualizar el diagrama usando el contador
        increment();
      }

      return result;
    },
    [handleOperation, increment]
  );
};

export const useFetchAuthenticators = () => {
  const { handleOperation } = useAlertContext();

  return useCallback(
    async (organizationId: number) => {
      const result = await handleOperation(
        async () => {
          const response = await authenticatorService.fetchAll(organizationId);
          if (!response) {
            throw new Error("Error al cargar los autenticadores");
          }
          return response;
        },
        {
          title: "Cargando autenticadores",
          successTitle: "Autenticadores cargados",
          successText: "Se han cargado los autenticadores",
          errorTitle: "Error al cargar",
          loadingTitle: "Cargando autenticadores",
          showSuccess: false,
        }
      );

      return result;
    },
    [handleOperation]
  );
};

export const useAssignAuthenticator = () => {
  const { handleOperation } = useAlertContext();
  const { increment } = useCounter();

  return useCallback(
    async (functionId: number, authenticatorId: number | null) => {
      const result = await handleOperation(
        async () => {
          const response = await functionsService.assignAuthenticator(
            functionId,
            authenticatorId
          );
          if (response === undefined) {
            throw new Error("Error al asignar el autenticador");
          }
          return response;
        },
        {
          title: authenticatorId
            ? "Asignando autenticador"
            : "Removiendo autenticador",
          successTitle: authenticatorId
            ? "Autenticador asignado"
            : "Autenticador removido",
          successText: authenticatorId
            ? "Autenticador asignado exitosamente"
            : "Autenticador removido exitosamente",
          errorTitle: "Error al asignar",
          loadingTitle: authenticatorId
            ? "Asignando autenticador a función"
            : "Removiendo autenticador de función",
        }
      );

      if (result.success) {
        // Actualizar el diagrama usando el contador
        increment();
      }

      return result;
    },
    [handleOperation, increment]
  );
};

export const useAuthenticatorSuccess = () => {
  const { increment } = useCounter();

  return useCallback(() => {
    // Actualizar el diagrama usando el contador
    increment();
  }, [increment]);
};
