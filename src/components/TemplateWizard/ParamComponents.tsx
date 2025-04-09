import { useState, useEffect } from "react";
import { ParamType } from "@interfaces/function-params.interface";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { WizardFormValues, ParamConfigItem } from "./types";
import { Input } from "@components/forms/input";
import { Toggle } from "@components/forms/toggle";

interface ParamItemProps {
  paramId: string;
  param: ParamConfigItem;
  register: UseFormRegister<WizardFormValues>;
  watchedParams: Record<string, ParamConfigItem>;
  setValue: UseFormSetValue<WizardFormValues>;
  handleValueChange: (paramId: string, value: string) => void;
  handleToggleChange: (paramId: string, enabled: boolean) => void;
}

type ParamToggleProps = {
  paramId: string;
  enabled: boolean;
  required: boolean;
  register: UseFormRegister<WizardFormValues>;
  onToggleChange?: (checked: boolean) => void;
  handleToggleChange?: (paramId: string, enabled: boolean) => void;
};

const ParamToggle = ({
  paramId,
  enabled,
  required,
  register,
  onToggleChange,
  handleToggleChange,
}: ParamToggleProps) => {
  // Extraer el onChange del register para manejarlo explícitamente
  const { onChange, ...rest } = register(`params.${paramId}.enabled`);

  // Función para manejar el cambio del toggle
  const onToggleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Usar la función handleToggleChange si está disponible
    if (handleToggleChange) {
      handleToggleChange(paramId, e.target.checked);
    }

    // Si es un parámetro anidado, llamar al callback personalizado
    if (paramId.includes(".") && onToggleChange) {
      onToggleChange(e.target.checked);
    }

    onChange(e); // Llamar al onChange original del register
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">
        {enabled ? "Activado" : "Desactivado"}
      </span>
      <Toggle
        checked={enabled}
        disabled={required}
        onChange={onToggleStateChange}
        {...rest}
      />
    </div>
  );
};

export const ParamItem = ({
  paramId,
  param,
  register,
  watchedParams,
  setValue,
  handleValueChange,
  handleToggleChange,
}: ParamItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isParamEnabled = param.enabled;
  const watchedValue = watchedParams[paramId]?.value;

  useEffect(() => {
    if (param.required) {
      setValue(`params.${paramId}.enabled`, true);
    }
  }, [param.required, paramId, setValue]);

  useEffect(() => {
    if (
      param.type === ParamType.OBJECT &&
      param.properties &&
      !paramId.includes(".")
    ) {
      Object.entries(param.properties).forEach(([propName, prop]) => {
        const nestedParamId = `${paramId}.${propName}`;
        const isRequired = prop.required ?? false;

        if (isParamEnabled && isRequired) {
          setValue(`params.${nestedParamId}.enabled`, true);
        } else if (!isParamEnabled && !isRequired) {
          setValue(`params.${nestedParamId}.enabled`, false);
        }
      });
    }
  }, [isParamEnabled, paramId, param.type, param.properties, setValue]);

  if (param.type === ParamType.OBJECT && param.properties) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => isParamEnabled && setIsExpanded(!isExpanded)}
            className={`text-gray-500 ${isParamEnabled ? "hover:text-gray-700" : "opacity-50 cursor-not-allowed"}`}
            disabled={!isParamEnabled}
          >
            {isExpanded && isParamEnabled ? (
              <img src="/mvp/chevron-down.svg" className="w-4 h-4" />
            ) : (
              <img src="/mvp/chevron-right.svg" className="w-4 h-4" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div
              className={`font-medium ${isParamEnabled ? "text-gray-800" : "text-gray-400"}`}
            >
              {param.title}
            </div>
            <div className="text-xs text-gray-500">
              {param.description ?? ""}
            </div>
          </div>
          <ParamToggle
            paramId={paramId}
            enabled={isParamEnabled}
            required={param.required ?? false}
            register={register}
            handleToggleChange={handleToggleChange}
          />
        </div>

        {isExpanded && isParamEnabled && (
          <div className="pl-8 space-y-4">
            {Object.entries(param.properties).map(([propName, prop]) => {
              const nestedParamId = `${paramId}.${propName}`;
              const nestedProp: ParamConfigItem = {
                ...prop,
                id: nestedParamId,
                title: prop.name || propName,
                value: watchedParams[nestedParamId]?.value ?? prop.value ?? "",
                enabled:
                  watchedParams[nestedParamId]?.enabled ??
                  prop.enabled ??
                  false,
                description: prop.description ?? "",
                required: prop.required ?? false,
              };

              return (
                <ParamItem
                  key={nestedParamId}
                  paramId={nestedParamId}
                  param={nestedProp}
                  watchedParams={watchedParams}
                  register={register}
                  setValue={setValue}
                  handleValueChange={handleValueChange}
                  handleToggleChange={handleToggleChange}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Obtener el valor más actualizado para mostrar
  const currentValue =
    watchedValue !== undefined ? watchedValue : (param.value ?? "");

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">{param.title}</div>
        <div className="text-xs text-gray-500 truncate">
          {param.description ?? ""}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PropertyInput
          property={param}
          value={currentValue}
          onChange={value => handleValueChange(paramId, value)}
          className="w-32"
        />
        <ParamToggle
          paramId={paramId}
          enabled={isParamEnabled}
          required={param.required ?? false}
          register={register}
          handleToggleChange={handleToggleChange}
        />
      </div>
    </div>
  );
};

type PropertyInputProps = {
  property: {
    title: string;
    type: ParamType;
    required?: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const PropertyInput = ({
  property,
  value,
  onChange,
  className,
}: PropertyInputProps) => {
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
