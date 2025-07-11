import React, { useState } from "react";
import { StepComponentProps } from "../types";
import EditButton from "@pages/Workspace/components/EditButton";
import DeleteButton from "@pages/Workspace/components/DeleteButton";
import StepContainer from "../components/StepContainer";

const OrganizationStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateData("organization", { [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      updateData("organization", { logo: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("org-logo-upload")?.click();
  };

  return (
    <StepContainer
      title="Crea tu organización"
      subtitle="Identifica tu empresa y define el propósito general de tu asistente."
    >
      <div className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-sofia-superDark mb-2">
            Imagen para tu organización
          </label>
          <div className="relative">
            <img
              src={previewImage || "/mvp/avatar.svg"}
              alt="Organization logo"
              className="w-[80px] h-[80px] rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
              id="org-logo-upload"
            />
            <div className="absolute top-14 left-14 flex">
              <button type="button" onClick={handleUploadClick}>
                <EditButton />
              </button>
              <button
                type="button"
                onClick={() => {
                  updateData("organization", { logo: null });
                  setPreviewImage(null);
                }}
              >
                <DeleteButton />
              </button>
            </div>
          </div>
          <p className="text-xs font-medium text-[#A6A8AB] mt-2">
            Formatos admitidos: png, jpg, jpeg.
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-sofia-superDark mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={data.organization.name}
            onChange={handleInputChange}
            className="w-full h-[51px] px-4 py-3 bg-[#FCFCFC] rounded border-0 focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen"
            placeholder="Ingresa el nombre de tu organización"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-sofia-superDark mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={data.organization.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#FCFCFC] rounded border-0 focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen resize-none"
            placeholder="Describe brevemente tu organización..."
            rows={4}
            required
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default OrganizationStep;
