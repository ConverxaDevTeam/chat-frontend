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
        className={`bg-white border border-gray-200 shadow-sm border-inherit h-[36px] relative rounded-lg flex justify-between items-center p-[6px] cursor-pointer text-gray-700 ${
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
        <div className="absolute w-full bg-app-c2 top-[36px] left-0 rounded-lg border-[1px] border-app-c3 z-50 max-h-[300px] overflow-y-auto">
          {customOptions}
          {options.map(option => (
            <div
              key={String(option.id)}
              className={`p-[6px] cursor-pointer hover:bg-app-c1 ${
                option.id === value ? "bg-app-c1" : ""
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
