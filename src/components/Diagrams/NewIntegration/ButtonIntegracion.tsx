import { IconType } from "react-icons";

interface ButtonIntegracionProps {
  action: () => void;
  Icon: IconType;
  text: string;
  disabled?: boolean;
}

const ButtonIntegracion = ({
  action,
  Icon,
  text,
  disabled = false,
}: ButtonIntegracionProps) => {
  return (
    <button
      type="button"
      className={`p-4 rounded-md flex flex-col items-center justify-center gap-[10px] ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-100 hover:bg-blue-200 text-blue-900"
      }`}
      disabled={disabled}
      onClick={action}
    >
      <Icon size={24} className="w-8 h-8" />
      <p className="text-sm">{text}</p>
    </button>
  );
};

export default ButtonIntegracion;
