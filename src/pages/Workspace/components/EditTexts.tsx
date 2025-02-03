import ChatPreview from "./ChatPreview";
import { Integracion } from "./CustomizeChat";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import React, { useState } from "react";
import ImageCropModal from "./ImageCropModal";

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
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-md p-2"
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
}: TextAreaInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <textarea
        name={name}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-md p-2"
        value={value}
      />
    </div>
  );
};

const EditTexts = ({
  integration,
  setIntegration,
  handleSaveLogo,
  handleDeleteLogo,
}: EditTextsProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIntegration({
      ...integration,
      config: {
        ...integration.config,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div className="flex gap-[20px] items-start">
      <div className="flex flex-col flex-1 gap-[10px] items-start w-[338px]">
        <AvatarUploader
          integration={integration}
          handleSaveLogo={handleSaveLogo}
          handleDeleteLogo={handleDeleteLogo}
          setIntegration={setIntegration}
        />
        <label className="block text-sm font-medium text-gray-600">
          Textos
        </label>
        <TextInput
          label="Título"
          name="title"
          value={integration.config.title}
          placeholder="Título del chat"
          onChange={handleInputChange}
        />
        <TextInput
          label="Nombre de chat"
          name="name"
          value={integration.config.name}
          placeholder="Chat"
          onChange={handleInputChange}
        />
        <TextInput
          label="Subtítulo"
          name="sub_title"
          value={integration.config.sub_title}
          onChange={handleInputChange}
        />
        <TextAreaInput
          label="Descripción"
          name="description"
          value={integration.config.description}
          onChange={handleInputChange}
        />
      </div>
      <ChatPreview config={integration.config} />
    </div>
  );
};

export default EditTexts;
