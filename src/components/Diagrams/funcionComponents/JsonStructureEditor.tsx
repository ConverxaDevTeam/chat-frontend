import { useState } from "react";
import { IoMdAdd, IoMdInformationCircle } from "react-icons/io";
import { JsonFieldModal } from "./JsonFieldModal";

interface JsonField {
  key: string;
  type: string;
  required: boolean;
  description?: string;
}

interface JsonStructureEditorProps {
  value: JsonField[];
  onChange: (fields: JsonField[]) => void;
  onCloseMainModal?: () => void;
}

export const JsonStructureEditor = ({
  value = [],
  onChange,
  onCloseMainModal,
}: JsonStructureEditorProps) => {
  const [fields, setFields] = useState<JsonField[]>(value);
  const [editingField, setEditingField] = useState<JsonField | null>(null);

  const addField = () => {
    const newField = { key: "", type: "string", required: false };
    setEditingField(newField);
  };

  const handleSaveField = (field: JsonField) => {
    const isNew = !fields.find(f => f.key === field.key);
    const newFields = isNew
      ? [...fields, field]
      : fields.map(f => (f.key === field.key ? field : f));

    setFields(newFields);
    onChange(newFields);
    setEditingField(null);
  };

  const handleEditField = (field: JsonField) => {
    setEditingField(field);
    onCloseMainModal?.();
  };

  return (
    <div className="space-y-1">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
        >
          <span className="text-sm font-medium">
            {field.key || "Sin nombre"}
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

      <JsonFieldModal
        isShown={!!editingField}
        onClose={() => setEditingField(null)}
        field={editingField || { key: "", type: "string", required: false }}
        onSubmit={handleSaveField}
      />
    </div>
  );
};
