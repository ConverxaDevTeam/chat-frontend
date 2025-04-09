import { useState, useEffect } from "react";
import { ParamType } from "@interfaces/function-params.interface";
import { UseFormRegister } from "react-hook-form";
import { WizardFormValues, ParamConfigItem } from "./types";
import { Input } from "@components/forms/input";
import { Toggle } from "@components/forms/toggle";

interface ParamItemProps {
  param: ParamConfigItem;
  register: UseFormRegister<WizardFormValues>;
  onToggleChange: (enabled: boolean) => void;
  onValueChange: (value: string) => void;
  onNestedToggleChange?: (propId: string, enabled: boolean) => void;
  onNestedValueChange?: (propId: string, value: string) => void;
}

type ParamToggleProps = {
  enabled: boolean;
  required: boolean;
  onToggleChange: (checked: boolean) => void;
};

const ParamToggle = ({
  enabled,
  required,
  onToggleChange,
}: ParamToggleProps) => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">
        {enabled ? "Activado" : "Desactivado"}
      </span>
      <Toggle
        checked={enabled}
        disabled={required}
        onChange={e => onToggleChange(e.target.checked)}
      />
    </div>
  );
};

export const ParamItem = ({
  param,
  register,
  onToggleChange = () => {},
  onValueChange = () => {},
  onNestedToggleChange,
  onNestedValueChange,
}: ParamItemProps) => {
  if (!param) return null; // Validación crítica

  const safeParam = {
    id: param?.id || "",
    name: param?.name || "",
    enabled: param?.enabled ?? false,
    title: param?.title || "",
    description: param?.description || "",
    value: param?.value || "",
    type: param?.type || ParamType.STRING,
    required: param?.required ?? false,
    properties: param?.properties || [],
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isParamEnabled, setIsParamEnabled] = useState(safeParam.enabled);

  useEffect(() => {
    if (safeParam.required && !isParamEnabled) {
      setIsParamEnabled(true);
      onToggleChange(true);
    }
  }, [safeParam.required]);

  useEffect(() => {
    if (safeParam.type === ParamType.OBJECT && safeParam.properties) {
      Object.entries(safeParam.properties).forEach(([propId, prop]) => {
        if (isParamEnabled && onNestedToggleChange) {
          onNestedToggleChange(propId, true);
        } else if (!isParamEnabled && !prop.required && onNestedToggleChange) {
          onNestedToggleChange(propId, false);
        }
      });
    }
  }, [isParamEnabled, safeParam.type, JSON.stringify(safeParam.properties)]);

  const handleToggle = (enabled: boolean) => {
    setIsParamEnabled(enabled);
    onToggleChange(enabled);
  };

  if (safeParam.type === ParamType.OBJECT && safeParam.properties) {
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
              {safeParam.title}
            </div>
            <div className="text-xs text-gray-500">
              {safeParam.description ?? ""}
            </div>
          </div>
          <ParamToggle
            enabled={isParamEnabled}
            required={safeParam.required ?? false}
            onToggleChange={handleToggle}
          />
        </div>

        {isExpanded && isParamEnabled && (
          <div className="pl-8 space-y-4">
            {Object.entries(safeParam.properties).map(([propId, prop]) => {
              const nestedProp: ParamConfigItem = {
                ...prop,
                id: propId,
                title: prop.name || propId,
                value: prop.value ?? "",
                enabled: prop.enabled ?? false,
                description: prop.description ?? "",
                required: prop.required ?? false,
              };

              return (
                <ParamItem
                  key={propId}
                  param={nestedProp}
                  register={register}
                  onToggleChange={enabled =>
                    onNestedToggleChange?.(propId, enabled)
                  }
                  onValueChange={value => onNestedValueChange?.(propId, value)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">
          {safeParam.title}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {safeParam.description ?? ""}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PropertyInput
          property={{
            type: safeParam.type,
            enabled: isParamEnabled,
          }}
          value={safeParam.value ?? ""}
          onChange={onValueChange}
          className="w-32"
        />
        <ParamToggle
          enabled={isParamEnabled}
          required={safeParam.required ?? false}
          onToggleChange={handleToggle}
        />
      </div>
    </div>
  );
};

interface PropertyInputProps {
  property: {
    type: ParamType;
    enabled?: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PropertyInput = ({
  property,
  value,
  onChange,
  className,
}: PropertyInputProps) => (
  <Input
    type={property.type === ParamType.NUMBER ? "number" : "text"}
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={!property.enabled}
    className={className}
  />
);
