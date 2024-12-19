import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { SendMessageButton } from "./SendMessageButton";
import { HitlButton } from "./HitlButton";
import { useHitl } from "@/hooks/useHitl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { uploadConversation } from "@store/actions/conversations";
import { IConversation } from "@pages/Workspace/components/ChatPreview";

interface FormInputs {
  message: string;
}

interface MessageFormProps {
  form: {
    register: UseFormRegister<FormInputs>;
    handleSubmit: UseFormHandleSubmit<FormInputs>;
    isSubmitting: boolean;
  };
  onSubmit: (data: FormInputs) => Promise<void>;
  conversation?: {
    id: number;
    user?: {
      id: number;
    };
  };
  user: {
    id: number;
  } | null;
}

export const MessageForm = ({
  form: { register, handleSubmit, isSubmitting },
  onSubmit,
  conversation,
  user,
}: MessageFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { handleHitlAction, isLoading } = useHitl({
    conversationId: conversation?.id || 0,
    onUpdateConversation: updatedConversation => {
      // Ensure user property is not null before dispatching
      if (!updatedConversation.user) throw new Error("User is null");
      dispatch(uploadConversation(updatedConversation as IConversation));
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-[10px] items-center"
    >
      <input
        {...register("message", { required: true })}
        type="text"
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-app-c1 border-[1px] border-app-c3 rounded-lg p-[10px] text-[14px] text-black"
      />

      {conversation?.user?.id === user?.id ? (
        <SendMessageButton isSubmitting={isSubmitting} />
      ) : (
        <HitlButton
          onClick={handleHitlAction}
          isLoading={isLoading}
          isAssigned={!!conversation?.user}
          currentUserHasConversation={conversation?.user?.id === user?.id}
        />
      )}
    </form>
  );
};
