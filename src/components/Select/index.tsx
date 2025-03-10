import { FC } from "react";
// select for header page

interface Option {
  id: unknown;
  name: string;
}

interface SelectProps {
  value?: unknown;
  options: Option[];
  onChange: (id: unknown) => void;
  placeholder?: string;
  mobileResolution?: boolean;
  customOptions?: React.ReactNode;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
  mobileResolution,
  customOptions,
  isOpen = false,
  onOpen,
  onClose,
}) => {
  const selectedOption = options.find(opt => opt.id === value);
  const handleToggle = () => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  };

  return (
    <div className="relative">
      <div
        className={`
          bg-[#F1F5F9] rounded-[8px] shadow-[1px_1px_2px_0px_#B8CCE0,-1px_-1px_2px_0px_#FFFFFF,1px_1px_2px_0px_#B8CCE0_inset,-1px_-1px_2px_0px_#FFFFFF_inset] relative flex justify-between items-center p-[6px] cursor-pointer text-sofia-superDark h-[36px] ${
          mobileResolution ? "w-full" : "w-[200px]"
        }`}
        onClick={handleToggle}
      >
        <p className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </p>
        <img
          className={`w-6 h-6 fill-current ml-2 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          src="/mvp/chevron-down.svg"
          alt="arrow"
        />
      </div>

      {isOpen && (
        <div className="absolute w-full bg-[#F1F5F9] top-[36px] left-0 rounded-lg border-[1px] border-[#B8CCE0] z-50 max-h-[300px] overflow-y-auto shadow-[1px_1px_2px_0px_#B8CCE0,-1px_-1px_2px_0px_#FFFFFF]">
          {customOptions}
          {options.map(option => (
            <div
              key={String(option.id)}
              className={`p-[6px] cursor-pointer hover:bg-[#E2E8F0] ${
                option.id === value ? "bg-[#E2E8F0]" : ""
              }`}
              onClick={() => {
                onChange(option.id);
                onClose?.();
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
