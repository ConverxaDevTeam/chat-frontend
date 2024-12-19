import { useForm } from "react-hook-form";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { FormInputs } from "@interfaces/conversation";

interface ChatFooterProps {
  onSendMessage: (message: string, images?: string[]) => void;
  conversation: {
    id: number;
    user?: {
      id: number;
    };
  };
  user?: {
    id: number;
  };
}

export const ChatFooter = ({
  onSendMessage,
  conversation,
  user,
}: ChatFooterProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>();

  const handleSubmitMessage = async (
    data: FormInputs & { images?: File[] }
  ) => {
    if (!data.message.trim() && !data.images?.length) return;

    // Convertimos las imágenes a base64
    const imageBase64s = data.images
      ? await Promise.all(
          data.images.map(
            file =>
              new Promise<string>(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              })
          )
        )
      : [];

    await onSendMessage(data.message, imageBase64s);
    reset();
  };

  return (
    <MessageForm
      form={{
        register,
        handleSubmit,
        isSubmitting,
      }}
      onSubmit={handleSubmitMessage}
      conversation={conversation}
      user={user}
      showHitl={false}
      buttonText=""
    />
  );
};
