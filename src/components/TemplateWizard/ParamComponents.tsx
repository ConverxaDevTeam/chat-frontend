import { useFormContext } from "react-hook-form";
import { ParamType } from "@interfaces/function-params.interface";
import { ParamConfigItem } from "./types";
import { Input } from "@components/forms/input";
import { Toggle } from "@components/forms/toggle";
import { useState } from "react";

interface ParamItemProps {
  param: ParamConfigItem;
  value?: Partial<ParamConfigItem>;
  onChange: (updatedParam: ParamConfigItem) => void;
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

export const ParamItem = ({ param, value, onChange }: ParamItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!param) return null; // Validación crítica

  const safeParam: ParamConfigItem = {
    id: param?.id || "",
    name: param?.name || "",
    enabled: param?.enabled ?? false,
    title: param?.title || "",
    description: param?.description || "",
    value: param?.value || "",
    type: param?.type || ParamType.STRING,
    required: param?.required ?? false,
    properties: param?.properties || {},
  };

  const currentValue = value?.value ?? "";
  const currentEnabled = value?.enabled ?? false;

  const handleToggleChange = (enabled: boolean) => {
    onChange({ ...value, enabled });
  };

  const handleValueChange = (newValue: string) => {
    onChange({ ...value, value: newValue });
  };

  const handleNestedValueChange = (
    propId: string,
    updatedParam: ParamConfigItem
  ) => {
    if (value?.properties) {
      onChange({
        ...value,
        properties: {
          ...value.properties,
          [propId]: updatedParam,
        },
      });
    }
  };

  if (safeParam.type === ParamType.OBJECT && safeParam.properties) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => currentEnabled && setIsExpanded(!isExpanded)}
            className={`text-gray-500 ${currentEnabled ? "hover:text-gray-700" : "opacity-50 cursor-not-allowed"}`}
            disabled={!currentEnabled}
          >
            {isExpanded && currentEnabled ? (
              <img src="/mvp/chevron-down.svg" className="w-4 h-4" />
            ) : (
              <img src="/mvp/chevron-right.svg" className="w-4 h-4" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div
              className={`font-medium ${currentEnabled ? "text-gray-800" : "text-gray-400"}`}
            >
              {safeParam.title}
            </div>
            <div className="text-xs text-gray-500">
              {safeParam.description ?? ""}
            </div>
          </div>
          <ParamToggle
            enabled={currentEnabled}
            required={safeParam.required ?? false}
            onToggleChange={handleToggleChange}
          />
        </div>

        {isExpanded && currentEnabled && (
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
                  value={value?.properties?.[propId]}
                  onChange={handleNestedValueChange.bind(null, propId)}
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
            enabled: currentEnabled,
          }}
          value={currentValue}
          onChange={handleValueChange}
          className="w-32"
        />
        <ParamToggle
          enabled={currentEnabled}
          required={safeParam.required ?? false}
          onToggleChange={handleToggleChange}
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
