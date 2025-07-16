import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";
import { toast } from "react-toastify";
import { SetupFormData, SetupStepId } from "../types";
import { OrganizationType } from "@interfaces/organization.interface";
import { createDepartment, getWorkspaceData } from "@services/department";
import { createKnowledgeBase } from "@services/knowledgeBase.service";
import {
  updateIntegrationWebChat,
  getIntegrationWebChat,
} from "@services/integration";
import { editOrganization } from "@services/organizations";
import { agentService } from "@services/agent";

export const useSetupWizard = (
  currentOrganizationId?: number | null,
  currentDepartmentId?: number | null,
  currentAgentId?: number | null,
  currentIntegrationId?: number | null,
  onResourceCreated?: (type: string, id: number) => void
) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided IDs directly - no local state
  const organizationId = currentOrganizationId;
  const departmentId = currentDepartmentId;
  const agentId = currentAgentId;
  const [integrationId, setIntegrationId] = useState<number | null>(
    currentIntegrationId || null
  );

  const processStep = async (
    step: SetupStepId,
    formData: SetupFormData
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      switch (step) {
        case "organization":
          return await processOrganizationStep(formData.organization);

        case "department":
          return await createDepartmentStep(formData.department);

        case "agent":
          return await updateAgentStep(formData.agent);

        case "knowledge":
          return await createKnowledgeStep(formData.knowledge);

        case "chat":
          return await updateChatConfigStep(formData.chat, formData);

        case "integration":
          return await updateIntegrationStep(formData.integration);

        case "final":
          return true; // Final step doesn't process anything

        default:
          return false;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al procesar el paso";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const processOrganizationStep = async (
    data: SetupFormData["organization"]
  ) => {
    // If organizationId exists, update instead of create
    if (organizationId) {
      return await updateOrganizationStep(data);
    }
    return await createOrganizationStep(data);
  };

  const createOrganizationStep = async (
    data: SetupFormData["organization"]
  ) => {
    if (!user?.email) {
      throw new Error("Email del usuario requerido");
    }

    // Use existing organization service but we need to get the ID
    // Since the service only returns boolean, we need to make a direct call
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("type", OrganizationType.FREE);
    formData.append("email", user.email);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await axiosInstance.post(
      apiUrls.createOrganization(),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.ok && response.data.organization) {
      const orgId = response.data.organization.id;

      toast.success("Organización creada exitosamente");

      // Notify parent about new organization
      if (onResourceCreated) {
        onResourceCreated("organization", orgId);
      }

      return true;
    }

    throw new Error(response.data.message || "Error al crear la organización");
  };

  const updateOrganizationStep = async (
    data: SetupFormData["organization"]
  ) => {
    if (!organizationId || !user?.id) {
      throw new Error("ID de organización y usuario requeridos");
    }

    const editData = {
      owner_id: user.id,
      name: data.name,
      description: data.description,
      logo: data.logo,
    };

    try {
      await editOrganization(organizationId, editData);
      toast.success("Organización actualizada exitosamente");
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear organización";
      throw new Error(errorMessage);
    }
  };

  const createDepartmentStep = async (data: SetupFormData["department"]) => {
    if (!organizationId) {
      throw new Error("No se ha creado la organización");
    }

    const response = await createDepartment(
      organizationId,
      data.name,
      data.description
    );

    if (response?.id) {
      toast.success("Departamento creado exitosamente");

      // Notify parent about new department
      if (onResourceCreated) {
        onResourceCreated("department", response.id);
      }

      // Get workspace data to retrieve the automatically created agent
      try {
        const workspaceData = await getWorkspaceData(response.id);
        if (workspaceData?.department?.agente?.id) {
          // Store auto-created agent ID locally but don't update wizard status yet
          // This prevents skipping the agent configuration step
          // if (onResourceCreated) {
          //   onResourceCreated("agent", workspaceData.department.agente.id);
          // }
        }
      } catch (error) {
        console.error("Error getting workspace data:", error);
      }
      return true;
    }

    throw new Error("Error al crear el departamento");
  };

  const updateAgentStep = async (data: SetupFormData["agent"]) => {
    if (!agentId) {
      throw new Error("No se ha creado el agente");
    }

    try {
      const agentData = {
        name: data.name,
        config: {
          instruccion: data.instruction,
        },
      };

      await agentService.update(agentId, agentData);
      toast.success("Agente actualizado exitosamente");
      return true;
    } catch (error: unknown) {
      console.error("Error updating agent:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar paso de integración";
      throw new Error(errorMessage);
    }
  };

  const createKnowledgeStep = async (data: SetupFormData["knowledge"]) => {
    if (!agentId) {
      throw new Error("No se ha creado el agente");
    }

    // Skip if no files are provided
    if (data.files.length === 0) {
      return true;
    }

    let hasErrors = false;

    for (const file of data.files) {
      try {
        await createKnowledgeBase(agentId, file);
      } catch (error) {
        hasErrors = true;
        console.error("Error uploading file:", file.name, error);
      }
    }

    if (!hasErrors) {
      toast.success("Base de conocimiento creada exitosamente");
    } else {
      toast.warning("Algunos archivos no se pudieron cargar");
    }

    return true;
  };

  const updateChatConfigStep = async (
    data: SetupFormData["chat"],
    formData: SetupFormData
  ) => {
    if (!integrationId) {
      throw new Error(
        "Integration ID is required. ChatConfigStep should have loaded it."
      );
    }

    if (!departmentId || !organizationId) {
      throw new Error("Department ID and Organization ID are required");
    }

    // Get current integration data to preserve existing settings
    const currentData = await getIntegrationWebChat(
      departmentId,
      organizationId
    );

    if (!currentData?.config) {
      throw new Error("No se pudo obtener la configuración de la integración");
    }

    // Update chat configuration
    const updateData = {
      cors: currentData.config.cors || [],
      title: data.title,
      name: formData.agent.name || currentData.config.name || "SOF.IA",
      sub_title: data.subtitle,
      description: data.description,
      bg_color: currentData.config.bg_color || "#ffffff",
      text_title: currentData.config.text_title || "#000000",
      bg_chat: currentData.config.bg_chat || "#f5f5f5",
      text_color: currentData.config.text_color || "#000000",
      bg_assistant: currentData.config.bg_assistant || "#e0e0e0",
      bg_user: currentData.config.bg_user || "#007bff",
      button_color: currentData.config.button_color || "#007bff",
      button_text: currentData.config.button_text || "#ffffff",
      text_date: currentData.config.text_date || "#666666",
      logo: currentData.config.logo,
    };

    const result = await updateIntegrationWebChat(integrationId, updateData);

    if (result) {
      toast.success("Configuración del chat actualizada");
      return true;
    }

    throw new Error("Error al actualizar la configuración del chat");
  };

  const updateIntegrationStep = async (data: SetupFormData["integration"]) => {
    if (!integrationId || !departmentId || !organizationId) {
      throw new Error(
        "No se puede guardar la configuración: faltan datos de integración"
      );
    }

    try {
      // Get current integration data using the service
      const currentData = await getIntegrationWebChat(
        departmentId,
        organizationId
      );

      if (!currentData?.config) {
        throw new Error(
          "No se pudo obtener la configuración de la integración"
        );
      }

      const updateData = {
        cors: data.domains || [], // Guardar dominios (o array vacío si no hay)
        title: currentData.config.title || "",
        name: currentData.config.name || "",
        sub_title: currentData.config.sub_title || "",
        description: currentData.config.description || "",
        bg_color: currentData.config.bg_color || "#ffffff",
        text_title: currentData.config.text_title || "#000000",
        bg_chat: currentData.config.bg_chat || "#f5f5f5",
        text_color: currentData.config.text_color || "#000000",
        bg_assistant: currentData.config.bg_assistant || "#e0e0e0",
        bg_user: currentData.config.bg_user || "#007bff",
        button_color: currentData.config.button_color || "#007bff",
        button_text: currentData.config.button_text || "#ffffff",
        text_date: currentData.config.text_date || "#666666",
        logo: currentData.config.logo,
      };

      const result = await updateIntegrationWebChat(integrationId, updateData);

      if (!result) {
        throw new Error("Error al actualizar la configuración de integración");
      }

      toast.success(
        data.domains.length > 0
          ? "Dominios configurados correctamente"
          : "Configuración de integración guardada"
      );
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al guardar la configuración de integración";
      toast.error(errorMessage);
      throw error; // Re-throw para que falle y no pase de página
    }
  };

  const clearWizardState = () => {
    setIntegrationId(null);
    localStorage.removeItem("wizardState");
  };

  return {
    isLoading,
    error,
    processStep,
    organizationId,
    departmentId,
    agentId,
    integrationId,
    setIntegrationId,
    clearWizardState,
  };
};
