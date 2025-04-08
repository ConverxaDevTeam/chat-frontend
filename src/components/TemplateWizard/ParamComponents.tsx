import { ParamType } from "@interfaces/function-params.interface";
import { UseFormRegister } from "react-hook-form";
import { WizardFormValues, ParamConfigItem } from "./types";
import { Input } from "@components/forms/input";
import { Toggle } from "@components/forms/toggle";

type ParamItemProps = {
  paramId: string;
  param: ParamConfigItem;
  watchedParams: Record<string, { enabled?: boolean; value?: string }>;
  register: UseFormRegister<WizardFormValues>;
  handleToggleParam: (paramId: string, enabled: boolean) => void;
  handleValueChange: (paramId: string, value: string) => void;
};

const ParamTypeBadge = ({ type }: { type: ParamType }) => {
  const typeText = {
    [ParamType.OBJECT]: "Objeto",
    [ParamType.STRING]: "Texto",
    [ParamType.NUMBER]: "Número",
    [ParamType.BOOLEAN]: "Sí/No",
  }[type];

  return (
    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
      {typeText}
    </span>
  );
};

const ParamToggle = ({
  register,
  paramId,
  enabled = false,
  required = false,
}: {
  register: UseFormRegister<WizardFormValues>;
  paramId: string;
  enabled?: boolean;
  required?: boolean;
}) => {
  const isEnabled = required ? true : enabled;
  const { ...rest } = register(`params.${paramId}.enabled`);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">
        {isEnabled ? "Activado" : "Desactivado"}
      </span>
      <Toggle checked={isEnabled} disabled={required} {...rest} />
    </div>
  );
};

export const ParamItem = ({
  paramId,
  param,
  watchedParams,
  register,
  handleValueChange,
}: ParamItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">{param.title}</div>
        <div className="text-xs text-gray-500 truncate">
          {param.description}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ParamTypeBadge type={param.type} />
        <PropertyInput
          property={param}
          value={watchedParams[paramId]?.value ?? ""}
          onChange={value => handleValueChange(paramId, value)}
          className="w-32"
        />
        <ParamToggle
          register={register}
          paramId={paramId}
          enabled={watchedParams[paramId]?.enabled}
          required={param.required}
        />
      </div>
    </div>
  );
};

export const PropertyInput = ({
  property,
  value,
  onChange,
  className,
}: {
  property: {
    title: string;
    type: ParamType;
    required?: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  return (
    <div className="space-y-1">
      {property.type === ParamType.STRING && (
        <Input
          placeholder={`Valor para ${property.title}`}
          className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
      {property.type === ParamType.NUMBER && (
        <Input
          type="number"
          placeholder={`Valor para ${property.title}`}
          className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}

      {property.type === ParamType.BOOLEAN && (
        <div className="flex items-center gap-2">
          <Toggle
            checked={value === "true"}
            onChange={e => onChange(e.target.checked ? "true" : "false")}
          />
          <span className="text-sm">{value === "true" ? "Sí" : "No"}</span>
        </div>
      )}
    </div>
  );
};
