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

const ParamHeader = ({
  name,
  required,
}: {
  name: string;
  required: boolean;
}) => (
  <div className="flex items-center gap-2">
    <h4 className="font-medium text-gray-800">{name}</h4>
    {required && (
      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full font-medium">
        Requerido
      </span>
    )}
  </div>
);

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

const ParamDescription = ({
  required,
  isObject = false,
}: {
  required: boolean;
  isObject?: boolean;
}) => (
  <p className="mt-2 text-xs text-gray-500">
    {required
      ? `Este ${isObject ? "objeto" : "campo"} es obligatorio para que la función opere correctamente.`
      : `Este ${isObject ? "objeto" : "campo"} es opcional. Puedes dejarlo en blanco si no lo necesitas.`}
  </p>
);

export const ParamItem = ({
  paramId,
  param,
  watchedParams,
  register,
  handleValueChange,
}: ParamItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <ParamHeader name={param.name} required={param.required} />
        <div className="flex items-center gap-3">
          <ParamTypeBadge type={param.type} />
          <ParamToggle
            register={register}
            paramId={paramId}
            enabled={watchedParams[paramId]?.enabled}
            required={param.required}
          />
        </div>
      </div>

      <div className="p-4">
        <PropertyInput
          property={param}
          value={watchedParams[paramId]?.value ?? ""}
          onChange={value => handleValueChange(paramId, value)}
          disabled={!watchedParams[paramId]?.enabled}
        />
        <ParamDescription required={param.required} />
      </div>
    </div>
  );
};

export const PropertyInput = ({
  property,
  value,
  onChange,
  disabled = false,
}: {
  property: {
    name: string;
    type: ParamType;
    required?: boolean;
    description?: string;
  };
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-1">
      {property.type === ParamType.STRING && (
        <Input
          placeholder={`Valor para ${property.name}`}
          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {property.type === ParamType.NUMBER && (
        <Input
          type="number"
          placeholder={`Valor para ${property.name}`}
          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {property.type === ParamType.BOOLEAN && (
        <div className="flex items-center gap-2">
          <Toggle
            checked={value === "true"}
            onChange={e => onChange(e.target.checked ? "true" : "false")}
            disabled={disabled}
          />
          <span className="text-sm">{value === "true" ? "Sí" : "No"}</span>
        </div>
      )}
    </div>
  );
};
