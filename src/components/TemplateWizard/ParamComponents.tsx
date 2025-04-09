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

  // Obtener el estado actualizado de los parámetros
  const watchedParam = watchedParams[paramId];
  const watchedValue = watchedParam?.value;

  // Determinar si el parámetro está habilitado
  const isParamEnabled = param.enabled;

  // Actualizar el form state si es required
  useEffect(() => {
    if (param.required) {
      setValue(`params.${paramId}.enabled`, true);
    }
  }, [param.required, paramId, setValue]);

  // Efecto para manejar la activación/desactivación de parámetros anidados
  // cuando el parámetro padre cambia de estado
  useEffect(() => {
    // Solo aplicar para parámetros de tipo objeto con propiedades
    if (
      param.type === ParamType.OBJECT &&
      param.properties &&
      paramId &&
      !paramId.includes(".")
    ) {
      // Si el parámetro está activado, solo activar los requeridos
      if (isParamEnabled) {
        Object.entries(param.properties).forEach(([propName, prop]) => {
          const nestedParamId = `${paramId}.${propName}`;
          const isRequired = prop.required ?? false;

          // Solo establecer el valor si es requerido
          if (isRequired) {
            setValue(`params.${nestedParamId}.enabled`, true);
          }
        });
      } else {
        // Si el parámetro está desactivado, desactivar todos los no requeridos
        Object.entries(param.properties).forEach(([propName, prop]) => {
          const nestedParamId = `${paramId}.${propName}`;
          const isRequired = prop.required ?? false;

          // No desactivar los requeridos
          if (!isRequired) {
            setValue(`params.${nestedParamId}.enabled`, false);
          }
        });
      }
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
            {param.properties &&
              Object.entries(param.properties).map(([propName, prop]) => {
                console.log("PropName:", propName, "Prop:", prop);
                const nestedParamId = `${paramId}.${propName}`;
                console.log("nestedParamId resultante:", nestedParamId);
                // Asegurarnos de obtener el valor más actualizado
                let nestedWatchedValue = watchedParams[nestedParamId]?.value;
                let nestedEnabled = watchedParams[nestedParamId]?.enabled;

                // Si no hay valor en el parámetro anidado, intentar obtenerlo de las propiedades del padre
                if (
                  watchedParams[paramId]?.properties &&
                  propName in watchedParams[paramId].properties
                ) {
                  if (nestedWatchedValue === undefined) {
                    const propValue =
                      watchedParams[paramId].properties[propName].value;
                    nestedWatchedValue =
                      propValue !== undefined ? propValue : "";
                  }
                  if (nestedEnabled === undefined) {
                    const propEnabled =
                      watchedParams[paramId].properties[propName].enabled;
                    nestedEnabled =
                      propEnabled !== undefined ? propEnabled : false;
                  }
                }

                // Si aún no hay valores, usar los valores por defecto de la propiedad
                if (nestedWatchedValue === undefined) {
                  nestedWatchedValue = prop.value ?? "";
                }
                if (nestedEnabled === undefined) {
                  nestedEnabled = prop.enabled ?? false;
                }

                const fullProp: ParamConfigItem = {
                  ...prop,
                  id: nestedParamId,
                  title: prop.name || propName,
                  description: prop.description ?? "",
                  enabled: nestedEnabled,
                  // Usar el valor observado si existe, de lo contrario usar el valor de la propiedad
                  value:
                    nestedWatchedValue !== undefined
                      ? nestedWatchedValue
                      : (prop.value ?? ""),
                  required: prop.required ?? false,
                };
                return (
                  <ParamItem
                    key={fullProp.id}
                    paramId={fullProp.id}
                    param={fullProp}
                    watchedParams={watchedParams}
                    register={register}
                    setValue={setValue}
                    handleValueChange={(nestedId, value) => {
                      handleValueChange(nestedId, value);
                    }}
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
