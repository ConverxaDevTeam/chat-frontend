import React, { useEffect, useState } from "react";
import { StepComponentProps } from "../types";
import { useForm, UseFormRegister } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import ChatPreview from "@pages/Workspace/components/ChatPreview";
import StepContainer from "../components/StepContainer";
import DeleteButton from "@pages/Workspace/components/DeleteButton";
import EditButton from "@pages/Workspace/components/EditButton";
import ImageCropModal from "@pages/Workspace/components/ImageCropModal";
import {
  Integracion,
  ConfigWebChat,
} from "@pages/Workspace/components/CustomizeChat";
import {
  getIntegrationWebChat,
  updateIntegrationLogo,
  deleteIntegrationLogo,
} from "@services/integration";

interface IntegrationConfig {
  title: string;
  name: string;
  sub_title: string;
  description: string;
}

interface AvatarUploaderProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

const AvatarUploader = ({
  integration,
  setIntegration,
}: AvatarUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string>("/mvp/avatar.svg");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCroppedImage = async (croppedImage: Blob) => {
    if (!integration.id) return;

    setIsSaving(true);
    try {
      const success = await updateIntegrationLogo(integration.id, croppedImage);

      if (success) {
        const imageUrl = URL.createObjectURL(croppedImage);
        setIntegration({
          ...integration,
          config: {
            ...integration.config,
            logo: imageUrl,
          },
        });
      } else {
      }
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!integration.id) return;

    setIsSaving(true);
    try {
      const success = await deleteIntegrationLogo(integration.id);

      if (success) {
        setIntegration({
          ...integration,
          config: {
            ...integration.config,
            logo: "/mvp/avatar.svg",
          },
        });
      } else {
      }
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] font-bold leading-[16px] text-[#001126]">
        Avatar
      </label>
      <div className="relative">
        <img
          src={integration.config.logo || "/mvp/avatar.svg"}
          alt="avatar"
          className="w-[80px] h-[80px] rounded-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="avatar-upload"
        />
        <div className="absolute top-14 left-14 flex">
          <button
            onClick={() => document.getElementById("avatar-upload")?.click()}
            disabled={isSaving}
          >
            <EditButton />
          </button>
          <button onClick={handleDeleteLogo} disabled={isSaving}>
            <DeleteButton />
          </button>
        </div>
        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <ImageCropModal
          imageSrc={imageSrc}
          onSave={handleSaveCroppedImage}
          onClose={() => {
            setShowModal(false);
            setImageSrc("");
          }}
          show={showModal}
        />
      </div>
    </div>
  );
};

interface TextInputProps {
  label: string;
  name: keyof IntegrationConfig;
  placeholder?: string;
  register: UseFormRegister<IntegrationConfig>;
}

const TextInput = ({ label, name, placeholder, register }: TextInputProps) => {
  return (
    <InputGroup label={label}>
      <Input placeholder={placeholder} register={register(name)} />
    </InputGroup>
  );
};

interface TextAreaInputProps {
  label: string;
  register: UseFormRegister<IntegrationConfig>;
}

const TextAreaInput = ({ label, register }: TextAreaInputProps) => {
  return (
    <InputGroup label={label}>
      <TextArea register={register("description")} />
    </InputGroup>
  );
};

const ChatConfigStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  organizationId,
  departmentId,
  integrationId,
  setIntegrationId,
}) => {
  const [integration, setIntegration] = useState<Integracion>({
    id: 1,
    created_at: "",
    updated_at: "",
    type: "chat_web" as any,
    config: {
      id: 1,
      name: data.agent.name || "SOF.IA",
      cors: [],
      url_assets: "",
      title: data.chatConfig.title || "SOF.IA LLM",
      sub_title:
        data.chatConfig.subtitle ||
        "Descubre todo lo que SOF.IA puede hacer por ti.",
      description:
        data.chatConfig.description ||
        "¡Hola y bienvenido a SOF.IA! Estoy aquí para ayudarte a encontrar respuestas y soluciones de manera rápida y sencilla.",
      logo: "/mvp/avatar.svg",
      horizontal_logo: "",
      edge_radius: 12,
      bg_color: "#001126",
      bg_chat: "#ffffff",
      bg_user: "#001126",
      bg_assistant: "#F4FAFF",
      text_color: "#001126",
      text_date: "#A6A8AB",
      button_color: "#001126",
      text_title: "#ffffff",
      message_radius: 12,
      button_text: "#ffffff",
    },
  });
  const [isLoadingIntegration, setIsLoadingIntegration] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<IntegrationConfig>();

  useEffect(() => {
    reset({
      title: integration.config.title,
      name: data.agent.name || integration.config.name,
      sub_title: integration.config.sub_title,
      description: integration.config.description,
    });
  }, [integration, reset, data.agent.name]);

  // Load integration data when component mounts
  useEffect(() => {
    const fetchIntegration = async () => {
      if (!organizationId || !departmentId) {
        return;
      }

      setIsLoadingIntegration(true);
      try {
        const integrationData = await getIntegrationWebChat(
          departmentId,
          organizationId
        );

        if (integrationData) {
          setIntegration({
            id: integrationData.id,
            created_at: integrationData.created_at,
            updated_at: integrationData.updated_at,
            type: integrationData.type,
            config: {
              ...integrationData.config,
              // Use backend name as the correct one
              name: integrationData.config.name || "SOF.IA",
            },
          });

          // Set integration ID in the wizard hook
          setIntegrationId(integrationData.id);
        }
      } catch (error) {
      } finally {
        setIsLoadingIntegration(false);
      }
    };

    fetchIntegration();
  }, [organizationId, departmentId, data.agent.name]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const subscription = watch(formData => {
      // Don't update if still loading integration
      if (isLoadingIntegration) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const updatedIntegration: Integracion = {
          ...integration,
          config: {
            ...integration.config,
            ...formData,
          },
        };
        setIntegration(updatedIntegration);

        // Update parent data
        updateData("chatConfig", {
          title: formData.title || "",
          subtitle: formData.sub_title || "",
          description: formData.description || "",
          welcomeMessage: "¡Hola! ¿En qué puedo ayudarte hoy?",
          placeholder: "Escribe tu mensaje...",
        });

        // Also update agent name if it changed
        if (formData.name && formData.name !== data.agent.name) {
          updateData("agent", {
            ...data.agent,
            name: formData.name,
          });
        }
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, integration, updateData]);

  return (
    <StepContainer
      title="Configura el chat"
      subtitle="Ajusta el comportamiento del asistente y cómo interactúa con los usuarios."
    >
      <div className="grid grid-cols-[1fr_auto] gap-[20px] items-start w-full max-w-[1000px]">
        <div className="flex flex-col flex-1 gap-[10px] items-start w-full max-w-[550px]">
          <AvatarUploader
            integration={integration}
            setIntegration={setIntegration}
          />
          <label className="block text-[12px] font-medium text-[#A6A8AB] leading-[10px]">
            Formatos admitidos: png, jpg, jpeg.
          </label>
          <form
            className="w-full mt-[15px] grid grid-cols-1 gap-[30px]"
            onSubmit={e => e.preventDefault()}
          >
            <TextInput
              label="Nombre del chat"
              name="title"
              placeholder="SOF.IA LLM"
              register={register}
            />
            <TextInput
              label="Nombre del agente"
              name="name"
              placeholder="SOF.IA"
              register={register}
            />
            <TextInput
              label="CTA"
              name="sub_title"
              placeholder="Descubre todo lo que SOF.IA puede hacer por ti."
              register={register}
            />
            <TextAreaInput label="Descripción" register={register} />
          </form>
        </div>
        <div className="w-[320px]">
          <h3 className="text-sofia-superDark text-[14px] font-semibold leading-[16px] mb-2">
            Vista previa del chat
          </h3>
          <ChatPreview config={integration.config} />
        </div>
      </div>
    </StepContainer>
  );
};

export default ChatConfigStep;
