import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { IoImage } from "react-icons/io5";
import { useHitl } from "@/hooks/useHitl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { uploadConversation } from "@store/actions/conversations";
import { FormInputs } from "@interfaces/conversation";
import { useState } from "react";
import { SendMessageButton } from "../SendMessageButton";
import { HitlButton } from "../HitlButton";
import { IConversation, IMessage, MessageFormatType } from "@utils/interfaces";
import { ImagePreview } from "./ImagePreview";

interface ImagePreview {
  file: File;
  url: string;
}

interface MessageFormProps {
  showHitl?: boolean;
  showImageButton?: boolean;
  form: {
    register: UseFormRegister<FormInputs>;
    handleSubmit: UseFormHandleSubmit<FormInputs>;
    isSubmitting: boolean;
  };
  onSubmit: (data: FormInputs & { images?: File[] }) => void;
  conversation?: {
    id: number;
    user?: {
      id: number;
    };
    messages?: IMessage[];
  };
  user?: { id: number };
  buttonText?: string;
}

export const MessageForm = ({
  form: { register, handleSubmit, isSubmitting },
  onSubmit,
  conversation,
  user,
  showHitl = true,
  buttonText = "Enviar",
  showImageButton = false,
}: MessageFormProps) => {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const clearImages = () => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.url));
    setSelectedImages([]);
  };

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit({ ...data, images: selectedImages.map(img => img.file) });
    clearImages();
  };

  const dispatch = useDispatch<AppDispatch>();
  const { handleHitlAction, isLoading } = useHitl({
    conversationId: conversation?.id || 0,
    onUpdateConversation: updatedConversation => {
      if (!updatedConversation.user) throw new Error("User is null");
      dispatch(
        uploadConversation({
          ...updatedConversation,
          user: updatedConversation.user,
          messages: updatedConversation.messages.map(message => ({
            id: Math.random(),
            text: message.text,
            type: message.type,
            format: MessageFormatType.TEXT,
            audio: null,
            created_at: new Date().toISOString(),
          })),
        } as IConversation)
      );
    },
  });

  return (
    <div className="w-full p-4 border-t border-gray-300">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={
          showImageButton
            ? "grid grid-cols-[auto,1fr,auto] gap-[10px] items-center w-full"
            : "grid grid-cols-[1fr,auto] gap-[10px] items-center w-full"
        }
      >
        {showImageButton && (
          <label
            htmlFor="image-upload"
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
            <IoImage className="w-5 h-5 text-gray-500 hover:text-app-c4" />
          </label>
        )}

        <div className="relative">
          <input
            {...register("message", { required: selectedImages.length === 0 })}
            type="text"
            placeholder="Escribe un mensaje..."
            className="w-full bg-app-c1 border-[1px] border-app-c3 rounded-lg p-[10px] text-[14px] text-black pr-[40px]"
          />
          {selectedImages.length > 0 && (
            <ImagePreview images={selectedImages} onRemove={removeImage} />
          )}
        </div>

        {!showHitl || conversation?.user?.id === user?.id ? (
          <SendMessageButton isSubmitting={isSubmitting} text={buttonText} />
        ) : (
          <HitlButton
            onClick={handleHitlAction}
            isLoading={isLoading}
            isAssigned={!!conversation?.user}
            currentUserHasConversation={conversation?.user?.id === user?.id}
          />
        )}
      </form>
    </div>
  );
};
