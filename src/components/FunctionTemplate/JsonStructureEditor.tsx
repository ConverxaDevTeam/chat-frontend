import { useState, useEffect } from "react";
import { IoMdAdd, IoMdInformationCircle, IoMdTrash } from "react-icons/io";
import { Control } from "react-hook-form";
import { FunctionTemplateParam } from "@interfaces/template.interface";
import { ParamType } from "@interfaces/function-params.interface";
import { FormValues } from "./FunctionTemplateHooks";
import { Button } from "@components/common/Button";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";

interface JsonFieldFormModalProps {
  isShown: boolean;
  onClose: () => void;
  field: FunctionTemplateParam;
  onSubmit: (field: FunctionTemplateParam) => void;
}

// Modal para editar un campo JSON
const JsonFieldFormModal = ({
  isShown,
  onClose,
  field,
  onSubmit,
}: JsonFieldFormModalProps) => {
  console.log("[JsonFieldFormModal] Rendering with isShown:", isShown);
  const [formState, setFormState] = useState<FunctionTemplateParam>(field);

  // Actualizar el estado cuando cambia el campo
  useEffect(() => {
    setFormState(field);
  }, [field]);

  const handleChange = (key: keyof FunctionTemplateParam, value: unknown) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonFieldFormModal] handleSubmit called");
    onSubmit(formState);
    onClose();
  };

  const typeOptions = [
    {
      value: ParamType.STRING,
      label: "Texto",
    },
    {
      value: ParamType.NUMBER,
      label: "Número",
    },
    {
      value: ParamType.BOOLEAN,
      label: "Booleano",
    },
    {
      value: ParamType.OBJECT,
      label: "Objeto",
    },
  ];

  const modalHeader = (
    <h2 className="text-xl font-semibold">
      {field.id ? "Editar Campo" : "Nuevo Campo"}
    </h2>
  );

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonFieldFormModal] handleClose called");
    onClose();
  };

  return (
    <Modal
      isShown={isShown}
      onClose={handleClose}
      header={modalHeader}
      zindex={3000}
    >
      <div className="space-y-4 w-[475px]" onClick={e => e.stopPropagation()}>
        <InputGroup label="Nombre">
          <Input
            placeholder="Nombre del campo"
            value={formState.name}
            onChange={e => handleChange("name", e.target.value)}
          />
        </InputGroup>

        <InputGroup label="Título">
          <Input
            placeholder="Título del campo"
            value={formState.title}
            onChange={e => handleChange("title", e.target.value)}
          />
        </InputGroup>

        <InputGroup label="Tipo">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formState.type}
            onChange={e => handleChange("type", e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </InputGroup>

        <InputGroup label="Descripción">
          <textarea
            placeholder="Descripción del campo"
            value={formState.description || ""}
            onChange={e => handleChange("description", e.target.value)}
            rows={3}
            className="flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal w-full"
          />
        </InputGroup>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required-field"
            className="h-4 w-4 rounded border-gray-300 accent-sofia-electricOlive"
            checked={formState.required || false}
            onChange={e => handleChange("required", e.target.checked)}
          />
          <label
            htmlFor="required-field"
            className="ml-2 text-sofia-superDark text-[14px] font-semibold leading-[16px]"
          >
            Requerido
          </label>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={e => handleSubmit(e as React.MouseEvent)}
            variant="primary"
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface JsonStructureEditorProps {
  value: FunctionTemplateParam[];
  control: Control<FormValues>;
  setValue: (name: string, value: FunctionTemplateParam[]) => void;
  paramIndex: number;
}

export const JsonStructureEditor = ({
  value = [],
  setValue,
  paramIndex,
}: JsonStructureEditorProps) => {
  console.log("[JsonStructureEditor] Rendering with value:", value);
  const [fields, setFields] = useState<FunctionTemplateParam[]>(value);
  const [editingField, setEditingField] =
    useState<FunctionTemplateParam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Actualizar los campos cuando cambia el valor externo
  useEffect(() => {
    setFields(value);
  }, [value]);

  const addField = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] addField called");
    const newField: FunctionTemplateParam = {
      id: `temp-${Date.now()}`,
      name: "",
      title: "",
      description: "",
      type: ParamType.STRING,
      required: false,
    };
    setEditingField(newField);
    setIsModalOpen(true);
  };

  const editField = (field: FunctionTemplateParam, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] editField called", field);
    setEditingField({ ...field });
    setIsModalOpen(true);
  };

  const deleteField = (fieldId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] deleteField called", fieldId);
    const updatedFields = fields.filter(f => f.id !== fieldId);
    setFields(updatedFields);
    setValue(`params.${paramIndex}.properties`, updatedFields);
  };

  const handleSaveField = (field: FunctionTemplateParam) => {
    console.log("[JsonStructureEditor] handleSaveField called", field);
    let updatedFields: FunctionTemplateParam[];

    if (editingField && fields.some(f => f.id === editingField.id)) {
      // Estamos editando un campo existente
      updatedFields = fields.map(f => (f.id === editingField.id ? field : f));
    } else {
      // Estamos creando un nuevo campo
      updatedFields = [...fields, field];
    }

    setFields(updatedFields);
    setValue(`params.${paramIndex}.properties`, updatedFields);
    setEditingField(null);
    setIsModalOpen(false);
  };

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] closeModal called");
    setEditingField(null);
    setIsModalOpen(false);
    // No llamamos a onCloseMainModal aquí para evitar cerrar el modal principal
  };

  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Estructura del Objeto</h3>
        <Button
          onClick={e => addField(e as React.MouseEvent)}
          variant="primary"
          className="flex items-center gap-1 text-sm"
        >
          <IoMdAdd /> Añadir Campo
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay campos definidos. Haz clic en "Añadir Campo" para comenzar.
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map(field => (
            <div
              key={field.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{field.name}</span>
                <span className="text-xs text-gray-500">({field.type})</span>
                {field.required && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    Requerido
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={e => editField(field, e)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <IoMdInformationCircle size={18} />
                </button>
                <button
                  onClick={e => deleteField(field.id, e)}
                  className="text-red-600 hover:text-red-800"
                >
                  <IoMdTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingField && (
        <JsonFieldFormModal
          isShown={isModalOpen}
          onClose={closeModal}
          field={editingField}
          onSubmit={handleSaveField}
        />
      )}

      {fields.length === 0 && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={e => addField(e as React.MouseEvent)}
            variant="primary"
            className="flex items-center gap-1"
          >
            <IoMdAdd /> Añadir primer campo
          </Button>
        </div>
      )}
    </div>
  );
};
