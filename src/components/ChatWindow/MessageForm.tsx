import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
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
import { ConfigWebChat } from "@pages/Workspace/components/CustomizeChat";

interface ImagePreview {
  file: File;
  url: string;
}

interface MessageFormProps {
  config?: ConfigWebChat;
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

const defaultConfig: ConfigWebChat = {
  id: 0,
  name: "Default",
  cors: [],
  url_assets: "",
  title: "Default Title",
  sub_title: "Default Subtitle",
  description: "Default Description",
  logo: "",
  horizontal_logo: "",
  edge_radius: 8,
  bg_color: "#FFFFFF",
  bg_chat: "#F5F5F5",
  bg_user: "#FFFFFF",
  bg_assistant: "#d0fbf8",
  text_color: "#000000",
  text_date: "#a6a8ab",
  button_color: "#ededed",
  text_title: "#001126",
  message_radius: 8,
  button_text: "#BAF88F",
};

const useImageUpload = () => {
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

  return {
    selectedImages,
    handleImageSelect,
    removeImage,
    clearImages,
  };
};

const useEmojiPicker = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  return {
    showEmojiPicker,
    setShowEmojiPicker,
    onEmojiClick,
  };
};

const InputSection = ({
  register,
  showHitl,
  conversation,
  user,
  imageUpload,
  emojiPicker,
}: {
  register: UseFormRegister<FormInputs>;
  showHitl?: boolean;
  conversation?: { user?: { id: number } };
  user?: { id: number };
  imageUpload: ReturnType<typeof useImageUpload>;
  emojiPicker: ReturnType<typeof useEmojiPicker>;
}) => (
  <div className="flex-1 relative min-w-0">
    <div className="flex items-center gap-[10px] h-[44px] px-4 py-2.5 border border-[#343E4F] rounded-lg bg-white min-w-0">
      <input
        {...register("message", {
          required: imageUpload.selectedImages.length === 0,
        })}
        type="text"
        disabled={showHitl && conversation?.user?.id !== user?.id}
        placeholder="Escribe un mensaje..."
        className="w-full text-[14px] text-black bg-white focus:outline-none"
      />
      <label
        htmlFor="image-upload"
        className="hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={imageUpload.handleImageSelect}
          className="hidden"
        />
        <img src="/mvp/paperclip.svg" alt="sofia" className="w-6 h-6" />
      </label>
      {emojiPicker.showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 w-full">
          <EmojiPicker onEmojiClick={emojiPicker.onEmojiClick} />
        </div>
      )}
      {imageUpload.selectedImages.length > 0 && (
        <ImagePreview
          images={imageUpload.selectedImages}
          onRemove={imageUpload.removeImage}
        />
      )}
    </div>
  </div>
);

const HitlSection = ({
  handleHitlAction,
  isLoading,
  conversation,
  user,
}: {
  handleHitlAction: () => void;
  isLoading: boolean;
  conversation?: { user?: { id: number } };
  user?: { id: number };
}) => (
  <div className="w-full">
    <HitlButton
      onClick={handleHitlAction}
      disabled={isLoading}
      className="w-full p-3 bg-sofia-electricOlive hover:bg-sofia-electricOlive-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      type="button"
      isLoading={isLoading}
      isAssigned={!!conversation?.user}
      currentUserHasConversation={conversation?.user?.id === user?.id}
    >
      <img src="/mvp/headset.svg" alt="sofia" className="w-6 h-6" />
      <span>
        {conversation?.user ? (
          <span>Reasignar conversación</span>
        ) : (
          <span>Asignar conversación</span>
        )}
      </span>
    </HitlButton>
  </div>
);

export const MessageForm = ({
  form: { register, handleSubmit, isSubmitting },
  onSubmit,
  onUpdateConversation,
  conversation,
  user,
  config = defaultConfig,
  showHitl = true,
}: MessageFormProps) => {
  const imageUpload = useImageUpload();
  const emojiPicker = useEmojiPicker();

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit({
      ...data,
      images: imageUpload.selectedImages.map(img => img.file),
    });
    imageUpload.clearImages();
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
    <div
      className="h-[73px] px-3 py-3.5 flex items-center bg-app-lightGray min-w-0 rounded-br-[8px]"
      style={{ backgroundColor: config.button_color }}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex items-center gap-[16px] w-full min-w-0"
      >
        {!showHitl || conversation?.user?.id === user?.id ? (
          <button
            type="button"
            aria-label="Mostrar emoticonos"
            onClick={() =>
              emojiPicker.setShowEmojiPicker(!emojiPicker.showEmojiPicker)
            }
            className="hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <img
              src="/mvp/smile.svg"
              alt="sofia"
              className="w-[22px] h-[22px]"
            />
          </button>
        ) : null}
        {showHitl && conversation?.user?.id !== user?.id ? (
          <HitlSection
            handleHitlAction={handleHitlAction}
            isLoading={isLoading}
            conversation={conversation}
            user={user}
          />
        ) : (
          <>
            <InputSection
              register={register}
              showHitl={showHitl}
              conversation={conversation}
              user={user}
              imageUpload={imageUpload}
              emojiPicker={emojiPicker}
            />
            <SendMessageButton
              type="submit"
              disabled={isSubmitting}
              className="w-[38px] h-[38px] flex items-center justify-center hover:bg-sofia-electricOlive-700 rounded-full transition-colors disabled:opacity-50"
              style={{
                backgroundColor: config.button_text,
              }}
            >
              <img
                src="/mvp/send-horizontal.svg"
                alt="sofia"
                className="w-6 h-6"
              />
            </SendMessageButton>
          </>
        )}
      </form>
    </div>
  );
};
