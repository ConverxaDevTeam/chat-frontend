import { useState, useEffect } from "react";
import { IoMdAdd, IoMdInformationCircle } from "react-icons/io";
import { JsonFieldFormModal } from "./JsonFieldFormModal";
import {
  ObjectParamProperty,
  ParamType,
} from "@interfaces/function-params.interface";
import { Control } from "react-hook-form";
import { CreateFunctionParamDto } from "@interfaces/function-params.interface";

export interface JsonField {
  key: string;
  type: string;
  required: boolean;
  description?: string;
}

interface JsonStructureEditorProps {
  value: ObjectParamProperty[];
  control: Control<CreateFunctionParamDto>;
  setValue: (name: string, value: any, options?: any) => void;
  onCloseMainModal?: () => void;
}

export const JsonStructureEditor = ({
  value = [],
  control,
  setValue,
  onCloseMainModal,
}: JsonStructureEditorProps) => {
  const [fields, setFields] = useState<ObjectParamProperty[]>(value);
  const [editingField, setEditingField] = useState<ObjectParamProperty | null>(
    null
  );

  // Actualizar los campos cuando cambia el valor externo
  useEffect(() => {
    setFields(value);
  }, [value]);

  const addField = () => {
    const newField = { name: "", type: ParamType.STRING, required: false };
    setEditingField(newField);
  };

  const handleSaveField = (field: ObjectParamProperty) => {
    const isNew = !fields.find(f => f.name === field.name);
    const newFields = isNew
      ? [...fields, field]
      : fields.map(f => (f.name === field.name ? field : f));

    setFields(newFields);
    setValue("properties", newFields);
    setEditingField(null);
  };

  const handleEditField = (field: ObjectParamProperty) => {
    setEditingField(field);
  };

  return (
    <div className="space-y-1">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
        >
          <span className="text-sm font-medium">
            {field.name || "Sin nombre"}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </span>
          <button
            type="button"
            onClick={() => handleEditField(field)}
            className="hover:bg-gray-200 rounded"
          >
            <IoMdInformationCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="flex items-center gap-2 w-full p-2 bg-gray-50 rounded hover:bg-gray-100 text-sm font-medium text-gray-600"
      >
        <IoMdAdd className="w-5 h-5" />
        <span>Agregar campo</span>
      </button>

      {editingField && (
        <JsonFieldFormModal
          isShown={!!editingField}
          onClose={() => setEditingField(null)}
          field={editingField}
          onSubmit={handleSaveField}
        />
      )}
    </div>
  );
};
