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

const EditTexts = ({
  integration,
  setIntegration,
  handleSaveLogo,
  handleDeleteLogo,
}: EditTextsProps) => {
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
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
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
        <label className="block text-sm font-medium text-gray-600">
          Textos
        </label>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Título</label>
          <input
            type="text"
            name="title"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2"
            placeholder="Título del chat"
            value={integration.config.title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Nombre de chat
          </label>
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2"
            placeholder="Chat"
            value={integration.config.name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Subtítulo</label>
          <input
            type="text"
            name="sub_title"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2"
            value={integration.config.sub_title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Descripción
          </label>
          <textarea
            name="description"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2 "
            value={integration.config.description}
          />
        </div>
      </div>

      <ChatPreview config={integration.config} />
    </div>
  );
};

export default EditTexts;
