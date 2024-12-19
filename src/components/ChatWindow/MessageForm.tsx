import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { SendMessageButton } from "../SendMessageButton";
import { HitlButton } from "../HitlButton";
import { useHitl } from "@/hooks/useHitl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { uploadConversation } from "@store/actions/conversations";
import { IConversation } from "@pages/Workspace/components/ChatPreview";

interface FormInputs {
  message: string;
}

interface MessageFormProps {
  showHitl?: boolean;
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
  user?: {
    id: number;
  };
  buttonText?: string;
}

export const MessageForm = ({
  form: { register, handleSubmit, isSubmitting },
  onSubmit,
  conversation,
  user,
  showHitl = true,
  buttonText = "Enviar",
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
    <div className="w-full p-4 border-t border-gray-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-[1fr,auto] gap-[10px] items-center w-full"
      >
        <input
          {...register("message", { required: true })}
          type="text"
          placeholder="Escribe un mensaje..."
          className="w-full bg-app-c1 border-[1px] border-app-c3 rounded-lg p-[10px] text-[14px] text-black"
        />

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
