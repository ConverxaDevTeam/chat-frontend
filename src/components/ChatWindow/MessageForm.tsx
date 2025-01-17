import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAttach } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import { useHitl } from "@/hooks/useHitl";
import {
  ConversationResponseMessage,
  FormInputs,
} from "@interfaces/conversation";
import { useState } from "react";
import { SendMessageButton } from "../SendMessageButton";
import { HitlButton } from "../HitlButton";
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
  onUpdateConversation?: () => void;
  conversation?: {
    id: number;
    user?: {
      id: number;
    };
    messages?: ConversationResponseMessage[];
  };
  user?: { id: number };
  buttonText?: string;
}

export const MessageForm = ({
  form: { register, handleSubmit, isSubmitting },
  onSubmit,
  onUpdateConversation,
  conversation,
  user,
  showHitl = true,
}: MessageFormProps) => {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const input = document.querySelector(
      'input[name="message"]'
    ) as HTMLInputElement;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const value = input.value;
      input.value =
        value.substring(0, start) + emojiData.emoji + value.substring(end);
      input.selectionStart = input.selectionEnd =
        start + emojiData.emoji.length;
      input.focus();
    }
    setShowEmojiPicker(false);
  };

  const { handleHitlAction, isLoading } = useHitl({
    conversationId: conversation?.id || 0,
    userId: user?.id || 0,
    currentUserId: user?.id || 0,
    onUpdateConversation: () => {
      onUpdateConversation?.();
    },
  });

  return (
    <div className="h-[73px] px-5 py-3.5 flex items-center bg-app-lightGray">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-[auto,auto,1fr,auto] gap-2 items-center w-full"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BsEmojiSmile className="w-5 h-5 text-gray-500" />
        </button>

        <label
          htmlFor="image-upload"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
          <IoMdAttach className="w-5 h-5 text-gray-500" />
        </label>

        <div className="relative">
          <input
            {...register("message", { required: selectedImages.length === 0 })}
            type="text"
            disabled={conversation?.user?.id !== user?.id}
            placeholder="Escribe un mensaje..."
            className="w-full rounded-full py-2 px-4 text-[14px] text-black bg-white"
          />
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          {selectedImages.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-lg">
              <ImagePreview images={selectedImages} onRemove={removeImage} />
            </div>
          )}
        </div>
        {!showHitl || conversation?.user?.id === user?.id ? (
          <SendMessageButton
            type="submit"
            disabled={isSubmitting}
            className="p-2 bg-[#15ECDA] hover:bg-[#0F9D8C] rounded-full transition-colors disabled:opacity-50"
          >
            <IoSend className="w-5 h-5 text-black hover:text-white" />
          </SendMessageButton>
        ) : (
          <HitlButton
            onClick={handleHitlAction}
            disabled={isLoading}
            className="p-2 bg-sofia-electricOlive hover:bg-sofia-electricOlive-700 rounded-full transition-colors disabled:opacity-50"
            type="button"
            isLoading={isLoading}
            isAssigned={!!conversation?.user}
            currentUserHasConversation={conversation?.user?.id === user?.id}
          >
            <img src="/mvp/headset.svg" alt="sofia" className="w-6 h-6" />
          </HitlButton>
        )}
      </form>
    </div>
  );
};
