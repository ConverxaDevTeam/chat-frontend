import React, { useState, useRef, ReactElement } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "@components/Modal";
import { Button } from "@components/common/Button";

interface ImageCropModalProps {
  imageSrc: string;
  onSave: (croppedImage: Blob) => void;
  onClose: () => void;
  show: boolean;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onSave,
  onClose,
  show,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [isCropValid, setIsCropValid] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleCropChange = (crop: Crop) => {
    setCrop(crop);
    setIsCropValid(!!crop.width && !!crop.height);
  };

  const handleSave = () => {
    if (imgRef.current && crop?.width && crop?.height) {
      getCroppedImg(imgRef.current, crop).then(croppedImage => {
        onSave(croppedImage);
        onClose();
      });
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob as Blob);
      }, "image/png");
    });
  };

  const headerContent: ReactElement = (
    <div className="text-app-superDark text-xl font-bold leading-6">
      Cortar imagen
    </div>
  );
  return (
    <Modal
      isShown={show}
      onClose={onClose}
      header={headerContent}
      zindex={1010}
    >
      <div className="w-[500px] p-6">
        <ReactCrop crop={crop} onChange={handleCropChange} aspect={1}>
          <img
            ref={imgRef}
            src={imageSrc}
            alt="avatar"
            className="max-w-full"
          />
        </ReactCrop>
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isCropValid}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropModal;
