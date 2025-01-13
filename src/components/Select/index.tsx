import { FC, useState } from "react";

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
}

const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
  mobileResolution,
  customOptions,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative">
      <div
        className={`bg-custom-gradient border-[2px] border-[#B8CCE0] border-inherit h-[36px] relative rounded-lg flex justify-between items-center p-[6px] cursor-pointer ${
          mobileResolution ? "w-full" : "w-[200px]"
        }`}
        onClick={() => setOpen(!open)}
      >
        <p className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </p>
        <img
          className="w-6 h-6 fill-current ml-2 flex-shrink-0"
          src="/mvp/chevron-down.svg"
          alt="arrow"
        />
      </div>

      {open && (
        <div className="absolute w-full bg-app-c2 top-[36px] left-0 rounded-lg border-[1px] border-app-c3 z-50 max-h-[300px] overflow-y-auto">
          {customOptions}
          {options.map(option => (
            <div
              key={String(option.id)}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`p-[6px] cursor-pointer hover:bg-app-c1 ${
                value === option.id ? "bg-app-c1" : ""
              }`}
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
