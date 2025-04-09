import React from "react";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, onChange, className = "", disabled = false, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className={`peer sr-only ${className}`}
          checked={checked}
          onChange={disabled ? undefined : onChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div
          className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
            after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed after:bg-gray-200"
                : "bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-sofia-superDark"
            }`}
        />
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
