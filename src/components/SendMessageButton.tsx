import { IoSend } from "react-icons/io5";

interface SendMessageButtonProps {
  isSubmitting: boolean;
  text?: string;
}

export const SendMessageButton = ({
  isSubmitting,
  text = "Enviar",
}: SendMessageButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-[#15ECDA] p-4 hover:bg-[#0F9D8C] text-black font-bold hover:text-white rounded w-max-[120px] h-[40px] flex items-center justify-center gap-2"
    >
      <IoSend className="w-4 h-4" />
      {text}
    </button>
  );
};
