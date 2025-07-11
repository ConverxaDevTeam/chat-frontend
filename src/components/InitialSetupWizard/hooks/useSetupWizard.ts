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
import { updateIntegrationWebChat } from "@services/integration";

export const useSetupWizard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IDs created during the process
  // Load saved state from localStorage
  const savedState = localStorage.getItem("wizardState");
  const parsedState = savedState ? JSON.parse(savedState) : null;

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
          return await createOrganizationStep(formData.organization);

        case "department":
          return await createDepartmentStep(formData.department);

        case "agent":
          // Agent is created automatically with department, just return true
          return true;

        case "knowledge":
          return await createKnowledgeStep(formData.knowledge);

        case "chat":
          return await updateChatConfigStep(formData.chatConfig);

        case "interface":
          return await updateInterfaceStep(formData.interface);

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

  const createOrganizationStep = async (
    data: SetupFormData["organization"]
  ) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("type", OrganizationType.FREE);

    // Add user email
    if (user?.email) {
      formData.append("email", user.email);
    }

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
      setOrganizationId(response.data.organization.id);
      toast.success("Organización creada exitosamente");

      // Save wizard state to localStorage
      localStorage.setItem(
        "wizardState",
        JSON.stringify({
          organizationId: response.data.organization.id,
          currentStep: "department",
          lastUpdated: new Date().toISOString(),
        })
      );

      return true;
    }

    throw new Error(response.data.message || "Error al crear la organización");
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

  // Agent is created automatically with department, no need for this function

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

  const updateChatConfigStep = async (data: SetupFormData["chatConfig"]) => {
    if (!integrationId || !organizationId || !departmentId) {
      if (!departmentId || !organizationId) {
        throw new Error("Department ID and Organization ID are required");
      }
      // Get or create integration first
      const integResponse = await axiosInstance.get(
        apiUrls.getIntegrationWebChat(departmentId, organizationId)
      );

      if (integResponse.data?.id) {
        setIntegrationId(integResponse.data.id);

        // Update chat configuration
        const updateData = {
          cors: integResponse.data.cors || [],
          title: data.title,
          name: data.title,
          sub_title: data.subtitle,
          description: data.description,
          bg_color: integResponse.data.bg_color || "#ffffff",
          text_title: integResponse.data.text_title || "#000000",
          bg_chat: integResponse.data.bg_chat || "#f5f5f5",
          text_color: integResponse.data.text_color || "#000000",
          bg_assistant: integResponse.data.bg_assistant || "#e0e0e0",
          bg_user: integResponse.data.bg_user || "#007bff",
          button_color: integResponse.data.button_color || "#007bff",
          button_text: integResponse.data.button_text || "#ffffff",
          text_date: integResponse.data.text_date || "#666666",
          logo: integResponse.data.logo,
        };

        const result = await updateIntegrationWebChat(
          integResponse.data.id,
          updateData
        );

        if (result) {
          toast.success("Configuración del chat actualizada");
          return true;
        }
      }
    }

    return true; // Allow to continue even if update fails
  };

  const updateInterfaceStep = async (data: SetupFormData["interface"]) => {
    if (!integrationId) {
      return true; // Skip if no integration
    }

    // Get current integration data first
    const integResponse = await axiosInstance.get(
      `/api/integration/${integrationId}`
    );

    const currentData = integResponse.data;
    const updateData = {
      cors: currentData.cors || [],
      title: currentData.title || "",
      name: currentData.name || "",
      sub_title: currentData.sub_title || "",
      description: currentData.description || "",
      bg_color: data.backgroundColor,
      text_title: currentData.text_title || "#000000",
      bg_chat: currentData.bg_chat || "#f5f5f5",
      text_color: data.textColor,
      bg_assistant: currentData.bg_assistant || "#e0e0e0",
      bg_user: currentData.bg_user || "#007bff",
      button_color: data.primaryColor,
      button_text: currentData.button_text || "#ffffff",
      text_date: currentData.text_date || "#666666",
      logo: currentData.logo,
    };

    const result = await updateIntegrationWebChat(integrationId, updateData);

    if (result) {
      toast.success("Interfaz personalizada");
    }

    return true;
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
    clearWizardState,
    savedState: parsedState,
  };
};
