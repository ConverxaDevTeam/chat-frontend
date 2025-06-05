import ChatPreview from "./ChatPreview";
import { Integracion } from "./CustomizeChat";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import React, { useState, useEffect } from "react";
import ImageCropModal from "./ImageCropModal";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";

interface EditTextsProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  handleSaveLogo: (logo: File) => Promise<boolean>;
  handleDeleteLogo: () => Promise<boolean>;
}

interface AvatarUploaderProps {
  integration: Integracion;
  handleSaveLogo: (logo: File) => Promise<boolean>;
  handleDeleteLogo: () => Promise<boolean>;
  setIntegration: (integration: Integracion) => void;
}

const AvatarUploader = ({
  integration,
  handleSaveLogo,
  handleDeleteLogo,
  setIntegration,
}: AvatarUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string>("/mvp/avatar.svg");
  const [showModal, setShowModal] = useState<boolean>(false);

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
    const imageUrl = URL.createObjectURL(croppedImage);
    setIntegration({
      ...integration,
      config: {
        ...integration.config,
        logo: imageUrl,
      },
    });
    await handleSaveLogo(
      new File([croppedImage], "logo", { type: "image/jpeg" })
    );
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
          >
            <EditButton />
          </button>
          <button onClick={handleDeleteLogo}>
            <DeleteButton />
          </button>
        </div>
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
      <Input placeholder={placeholder} {...register(name)} />
    </InputGroup>
  );
};

interface TextAreaInputProps {
  label: string;
  register: UseFormRegister<IntegrationConfig>;
  error?: FieldError;
}

const TextAreaInput = ({ label, register, error }: TextAreaInputProps) => {
  return (
    <InputGroup label={label} errors={error}>
      <TextArea register={register("description")} />
    </InputGroup>
  );
};

interface IntegrationConfig {
  title: string;
  name: string;
  sub_title: string;
  description: string;
}

const EditTexts = ({
  integration,
  setIntegration,
  handleSaveLogo,
  handleDeleteLogo,
}: EditTextsProps) => {
  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<IntegrationConfig>();

  useEffect(() => {
    reset(integration.config);
  }, [integration, reset]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const subscription = watch(data => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const updatedIntegration: Integracion = {
          ...integration,
          config: {
            ...integration.config,
            ...data,
          },
        };
        setIntegration(updatedIntegration);
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch]);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-[20px] items-start w-full max-w-[1000px] overflow-y-auto pr-[20px]">
      <div className="flex flex-col flex-1 gap-[10px] items-start w-full max-w-[550px]">
        <AvatarUploader
          integration={integration}
          handleSaveLogo={handleSaveLogo}
          handleDeleteLogo={handleDeleteLogo}
          setIntegration={setIntegration}
        />
        <label className="block text-[12px] font-medium text-[#A6A8AB] leading-[10px]">
          Formatos admitidos: png, jpg, jpeg.
        </label>
        <form className="w-full mt-[15px] grid grid-cols-1 gap-[30px]">
          <TextInput
            label="Nombre del chat"
            name="title"
            placeholder="Nombre del chat"
            register={register}
          />
          <TextInput
            label="Nombre del agente"
            name="name"
            placeholder="Nombre del agente"
            register={register}
          />
          <TextInput
            label="CTA"
            name="sub_title"
            placeholder="CTA"
            register={register}
          />
          <TextAreaInput
            label="Descripción"
            register={register}
            error={errors.description}
          />
        </form>
      </div>
      <div className="w-[320px]">
      <h3 className="text-sofia-superDark text-[14px] font-semibold leading-[16px] mb-2">
      Vista previa del chat
    </h3>
        <ChatPreview config={integration.config} />
      </div>
    </div>
  );
};

export default EditTexts;
