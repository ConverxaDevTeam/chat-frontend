import { IoSend } from "react-icons/io5";

interface SendMessageButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  text?: string;
}

export const SendMessageButton = ({
  isSubmitting,
  text,
  children,
  className,
  ...props
}: SendMessageButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={className}
      {...props}
    >
      {children || (
        <>
          <IoSend className="w-4 h-4" />
          {text}
        </>
      )}
    </button>
  );
};
