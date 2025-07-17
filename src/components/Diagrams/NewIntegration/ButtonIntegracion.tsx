interface ButtonIntegracionProps {
  action: () => void;
  Icon: string;
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
      className={`flex flex-col items-center gap-4 rounded bg-white ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "hover:bg-app-grayLight"
      }`}
      onClick={action}
    >
      <div className="p-4">
        <img
          src={`/mvp/${Icon}.svg`}
          className="w-[56px] h-[56px] text-app-superDark"
        />
      </div>
      <p className="text-sm text-app-superDark">{text}</p>
    </button>
  );
};

export default ButtonIntegracion;
