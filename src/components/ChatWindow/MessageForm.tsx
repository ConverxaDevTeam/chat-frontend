import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { IoSend } from "react-icons/io5";
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
    <div className="h-[73px] px-5 py-3.5 flex items-center bg-app-lightGray min-w-0">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex items-center gap-[16px] w-full min-w-0"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <img src="/mvp/smile.svg" alt="sofia" className="w-[16px] h-[16px]" />
        </button>

        <div className="flex-1 relative min-w-0">
          <div className="flex items-center gap-[10px] h-[44px] px-4 py-2.5 border border-[#343E4F] rounded-lg bg-white min-w-0">
            <input
              {...register("message", {
                required: selectedImages.length === 0,
              })}
              type="text"
              disabled={showHitl && conversation?.user?.id !== user?.id}
              placeholder="Escribe un mensaje..."
              className="w-full text-[14px] text-black bg-white focus:outline-none"
            />
            <label
              htmlFor="image-upload"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <img
                src="/mvp/paperclip.svg"
                alt="sofia"
                className="w-[24px] h-[24px]"
              />
            </label>
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
        </div>
        {!showHitl || conversation?.user?.id === user?.id ? (
          <SendMessageButton
            type="submit"
            disabled={isSubmitting}
            className="w-[38px] h-[38px] flex items-center justify-center bg-sofia-electricOlive hover:bg-sofia-electricOlive-700 rounded-full transition-colors disabled:opacity-50"
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
