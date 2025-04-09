import { useState } from "react";
import { ParamType } from "@interfaces/function-params.interface";
import { UseFormRegister } from "react-hook-form";
import { WizardFormValues, ParamConfigItem } from "./types";
import { Input } from "@components/forms/input";
import { Toggle } from "@components/forms/toggle";

type ParamItemProps = {
  paramId: string;
  param: ParamConfigItem;
  watchedParams: Record<string, ParamConfigItem>;
  register: UseFormRegister<WizardFormValues>;
  handleValueChange: (paramId: string, value: string) => void;
};

type ParamToggleProps = {
  register: UseFormRegister<WizardFormValues>;
  paramId: string;
  enabled?: boolean;
  required?: boolean;
  onToggleChange?: (enabled: boolean) => void;
};

const ParamToggle = ({
  register,
  paramId,
  enabled = false,
  required = false,
  onToggleChange,
}: ParamToggleProps) => {
  const isEnabled = required ? true : enabled;
  
  // Extraer el onChange del register para manejarlo explícitamente
  const { onChange, ...rest } = register(`params.${paramId}.enabled`);
  
  // Función para manejar el cambio del toggle
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Toggle changed for ${paramId}:`, e.target.checked);
    console.log(`Current enabled state before change:`, isEnabled);
    
    // Si es un parámetro anidado, llamar al callback personalizado
    if (paramId.includes(".") && onToggleChange) {
      console.log(`Handling nested toggle change for ${paramId}`);
      onToggleChange(e.target.checked);
    }
    
    onChange(e); // Llamar al onChange original del register
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">
        {isEnabled ? "Activado" : "Desactivado"}
      </span>
      <Toggle 
        checked={isEnabled} 
        disabled={required} 
        onChange={handleToggleChange}
        {...rest} 
      />
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Añadir log para ver el estado de los parámetros
  console.log(`Rendering ParamItem for ${paramId}:`, {
    param,
    watchedValue: watchedParams[paramId],
    isNested: paramId.includes('.')
  });

  if (param.type === ParamType.OBJECT && param.properties) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <img src="/mvp/chevron-down.svg" className="w-4 h-4" />
            ) : (
              <img src="/mvp/chevron-right.svg" className="w-4 h-4" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800">{param.title}</div>
            <div className="text-xs text-gray-500">
              {param.description ?? ""}
            </div>
          </div>
          <ParamToggle
            register={register}
            paramId={paramId}
            enabled={watchedParams[paramId]?.enabled ?? false}
            required={param.required ?? false}
          />
        </div>

        {isExpanded && (
          <div className="pl-8 space-y-4">
            {param.properties &&
              Object.entries(param.properties).map(([propName, prop]) => {
                // Asegurarnos de obtener el valor más actualizado
                const nestedParamId = `${paramId}.${propName}`;
                
                // Obtener el valor y estado enabled de la propiedad anidada
                let nestedWatchedValue = watchedParams[nestedParamId]?.value;
                let nestedEnabled = watchedParams[nestedParamId]?.enabled;
                
                // Si no hay valor en el parámetro anidado, intentar obtenerlo de las propiedades del padre
                if (watchedParams[paramId]?.properties && 
                    propName in watchedParams[paramId].properties) {
                  if (nestedWatchedValue === undefined) {
                    const propValue = watchedParams[paramId].properties[propName].value;
                    nestedWatchedValue = propValue !== undefined ? propValue : "";
                  }
                  if (nestedEnabled === undefined) {
                    const propEnabled = watchedParams[paramId].properties[propName].enabled;
                    nestedEnabled = propEnabled !== undefined ? propEnabled : false;
                  }
                }
                
                // Si aún no hay valores, usar los valores por defecto de la propiedad
                if (nestedWatchedValue === undefined) {
                  nestedWatchedValue = prop.value ?? "";
                }
                if (nestedEnabled === undefined) {
                  nestedEnabled = prop.enabled ?? false;
                }
                
                console.log(`Nested param ${nestedParamId}:`, {
                  nestedWatchedValue,
                  nestedEnabled,
                  fromParent: watchedParams[paramId]?.properties?.[propName],
                  fromDirect: watchedParams[nestedParamId]
                });

                const fullProp: ParamConfigItem = {
                  ...prop,
                  id: nestedParamId,
                  title: prop.name || propName,
                  description: prop.description ?? "",
                  enabled: nestedEnabled !== undefined 
                    ? nestedEnabled 
                    : (prop.enabled ?? false),
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
                    handleValueChange={(nestedId, value) => {
                      console.log(
                        `Nested value change: ${nestedId} = ${value}`
                      );
                      handleValueChange(nestedId, value);
                    }}
                  />
                );
              })}
          </div>
        )}
      </div>
    );
  }

  // Asegurarnos de que estamos usando el valor más actualizado
  const currentValue = param.value ?? watchedParams[paramId]?.value ?? "";

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
          register={register}
          paramId={paramId}
          enabled={watchedParams[paramId]?.enabled ?? false}
          required={param.required ?? false}
          onToggleChange={enabled => {
            console.log(`Toggle changed for ${paramId} to ${enabled}`);
            // Si el toggle se desactiva, también debemos actualizar el valor
            if (!enabled && paramId.includes(".")) {
              handleValueChange(paramId, "");
            }
          }}
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
