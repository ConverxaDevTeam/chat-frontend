import { MessageForm } from "@/components/MessageForm";
import { useForm } from "react-hook-form";
import { FormInputs } from "@interfaces/conversation";

interface ChatFooterProps {
  onSendMessage: (message: string) => void;
  conversation: {
    id: number;
    user?: {
      id: number;
    };
  };
  user: { id: number };
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

  const handleSubmitMessage = async (data: FormInputs) => {
    if (!data.message.trim()) return;
    await onSendMessage(data.message);
    reset();
  };

  return (
    <MessageForm
      form={{ register, handleSubmit, isSubmitting }}
      onSubmit={handleSubmitMessage}
      conversation={conversation}
      user={user}
      showHitl={false}
      buttonText=""
    />
  );
};
