import { useState, useEffect } from "react";
import { IoMdAdd, IoMdInformationCircle, IoMdTrash } from "react-icons/io";
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
  setValue: (name: "properties", value: ObjectParamProperty[]) => void;
  onCloseMainModal?: () => void;
}

export const JsonStructureEditor = ({
  value = [],
  setValue,
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

  const handleDeleteField = (fieldName: string) => {
    const newFields = fields.filter(f => f.name !== fieldName);
    setFields(newFields);
    setValue("properties", newFields);
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
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleEditField(field)}
              className="hover:bg-gray-200 rounded p-1"
            >
              <IoMdInformationCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteField(field.name)}
              className="hover:bg-gray-200 rounded p-1"
            >
              <IoMdTrash className="w-5 h-5 text-red-500" />
            </button>
          </div>
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
