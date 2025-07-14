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

export const useSetupWizard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved state from localStorage for wizard continuation
  const savedState = localStorage.getItem("wizardState");
  const parsedState = savedState ? JSON.parse(savedState) : null;

  // IDs created during the process
  const [organizationId, setOrganizationId] = useState<number | null>(
    parsedState?.organizationId || null
  );
  const [departmentId, setDepartmentId] = useState<number | null>(
    parsedState?.departmentId || null
  );
  const [agentId, setAgentId] = useState<number | null>(
    parsedState?.agentId || null
  );
  const [integrationId, setIntegrationId] = useState<number | null>(
    parsedState?.integrationId || null
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
          return await updateChatConfigStep(formData.chatConfig, formData);

        case "integration":
          return await updateIntegrationStep(formData.integration);

        case "final":
          return true; // Final step doesn't process anything

        default:
          return false;
      }
    } catch (error: any) {
      setError(error.message || "Error al procesar el paso");
      toast.error(error.message || "Error al procesar el paso");
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

      setOrganizationId(orgId);
      toast.success("Organización creada exitosamente");

      // Save wizard state to localStorage for continuation
      const wizardState = {
        organizationId: orgId,
        currentStep: "department",
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("wizardState", JSON.stringify(wizardState));

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
    } catch (error: any) {
      throw new Error(error.message || "Error al actualizar la organización");
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
      setDepartmentId(response.id);

      // Get workspace data to retrieve the automatically created agent
      try {
        const workspaceData = await getWorkspaceData(response.id);
        if (workspaceData?.department?.agente?.id) {
          setAgentId(workspaceData.department.agente.id);

          // Update wizard state in localStorage
          localStorage.setItem(
            "wizardState",
            JSON.stringify({
              organizationId,
              departmentId: response.id,
              agentId: workspaceData.department.agente.id,
              currentStep: "agent",
              lastUpdated: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Error getting workspace data:", error);
      }

      toast.success("Departamento creado exitosamente");
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
    } catch (error: any) {
      console.error("Error updating agent:", error);
      throw new Error(error.message || "Error al actualizar el agente");
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
    data: SetupFormData["chatConfig"],
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
    if (!integrationId) {
      return true; // Skip if no integration
    }

    if (data.domains.length > 0) {
      // Get current integration data first
      const integResponse = await axiosInstance.get(
        `/api/integration/${integrationId}`
      );

      const currentData = integResponse.data;
      const updateData = {
        cors: data.domains,
        title: currentData.title || "",
        name: currentData.name || "",
        sub_title: currentData.sub_title || "",
        description: currentData.description || "",
        bg_color: currentData.bg_color || "#ffffff",
        text_title: currentData.text_title || "#000000",
        bg_chat: currentData.bg_chat || "#f5f5f5",
        text_color: currentData.text_color || "#000000",
        bg_assistant: currentData.bg_assistant || "#e0e0e0",
        bg_user: currentData.bg_user || "#007bff",
        button_color: currentData.button_color || "#007bff",
        button_text: currentData.button_text || "#ffffff",
        text_date: currentData.text_date || "#666666",
        logo: currentData.logo,
      };

      const result = await updateIntegrationWebChat(integrationId, updateData);

      if (result) {
        toast.success("Dominios configurados");
      }
    }

    return true;
  };

  const clearWizardState = () => {
    localStorage.removeItem("wizardState");
    setOrganizationId(null);
    setDepartmentId(null);
    setAgentId(null);
    setIntegrationId(null);
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
    savedState: parsedState,
  };
};
