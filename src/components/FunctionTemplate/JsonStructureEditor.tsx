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
  // Modal rendering state
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
    // Handle form submission
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
    // Handle modal close
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
            className="flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-app-darkBlue text-app-superDark text-[14px] font-normal leading-normal w-full"
          />
        </InputGroup>

        {formState.type === ParamType.OBJECT && (
          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex items-center gap-2">
              <label className="text-app-superDark text-[16px] font-[600] leading-[16px]">
                Estructura del Objeto
              </label>
            </div>
            {formState.properties && formState.properties.length > 0 ? (
              <div className="max-h-40 overflow-y-auto w-full border border-gray-200 rounded-md p-2">
                {formState.properties.map(prop => (
                  <div
                    key={prop.id}
                    className="flex justify-between items-center p-1 hover:bg-gray-50 rounded"
                  >
                    <span className="text-sm">
                      {prop.name}{" "}
                      <span className="text-xs text-gray-500">
                        ({prop.type})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-2 border border-gray-200 rounded-md w-full">
                No hay propiedades definidas
              </div>
            )}
          </div>
        )}

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="required-field"
            className="h-4 w-4 rounded border-gray-300 accent-app-electricOlive"
            checked={formState.required || false}
            onChange={e => handleChange("required", e.target.checked)}
          />
          <label
            htmlFor="required-field"
            className="ml-2 text-app-superDark text-[14px] font-semibold leading-[16px]"
          >
            Requerido
          </label>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button onClick={handleClose} variant="cancel" className="px-6">
            Cancelar
          </Button>
          <Button
            onClick={e => handleSubmit(e as React.MouseEvent)}
            variant="primary"
            className="px-8 w-2/3"
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
  // Editor rendering with value
  const [fields, setFields] = useState<FunctionTemplateParam[]>(value);
  const [editingField, setEditingField] =
    useState<FunctionTemplateParam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Actualizar los campos cuando cambia el valor externo
  useEffect(() => {
    setFields(value);
  }, [value]);

  const addField = (
    e?: React.MouseEvent,
    parentField?: FunctionTemplateParam
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log(
      "[JsonStructureEditor] addField called",
      parentField ? `to parent: ${parentField.name}` : "to root"
    );

    const newField: FunctionTemplateParam = {
      id: `temp-${Date.now()}`,
      name: "",
      title: "",
      description: "",
      type: ParamType.STRING,
      required: false,
    };

    setEditingField(newField);

    if (parentField) {
      // Si hay un campo padre, establecer la ruta para la anidación
      const path = findFieldPath(fields, parentField.id);
      if (path) {
        setCurrentPath(path);
      }
    } else {
      // Si no hay campo padre, estamos en el nivel raíz
      setCurrentPath([]);
    }

    setIsModalOpen(true);
  };

  // Función auxiliar para encontrar la ruta a un campo por ID
  const findFieldPath = (
    fieldArray: FunctionTemplateParam[],
    fieldId: string,
    currentPath: string[] = []
  ): string[] | null => {
    console.log(
      "Finding path for ID:",
      fieldId,
      "in current path:",
      currentPath
    );

    for (const field of fieldArray) {
      if (field.id === fieldId) {
        const foundPath = [...currentPath, field.id];
        // Debug information"Found path:", foundPath);
        return foundPath;
      }

      if (field.properties && field.properties.length > 0) {
        const nestedPath = findFieldPath(field.properties, fieldId, [
          ...currentPath,
          field.id,
        ]);

        if (nestedPath) {
          return nestedPath;
        }
      }
    }

    return null;
  };

  const editField = (field: FunctionTemplateParam, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] editField called", field);
    setEditingField({ ...field });

    // Buscar la ruta del campo para edición
    const parentPath = findParentPath(fields, field.id);
    setCurrentPath(parentPath || []);

    setIsModalOpen(true);
  };

  // Función para encontrar la ruta del padre de un campo
  const findParentPath = (
    fieldArray: FunctionTemplateParam[],
    fieldId: string,
    currentPath: string[] = []
  ): string[] | null => {
    // Verificar si el campo está en el nivel actual
    const fieldIndex = fieldArray.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1) {
      return currentPath;
    }

    // Buscar en campos anidados
    for (const field of fieldArray) {
      if (field.properties && field.properties.length > 0) {
        const childPath = [...currentPath, field.id];
        const result = findParentPath(field.properties, fieldId, childPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const deleteField = (
    fieldId: string,
    e?: React.MouseEvent,
    parentPath: string[] = []
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log(
      "[JsonStructureEditor] deleteField called",
      fieldId,
      "parentPath:",
      parentPath
    );

    if (parentPath.length === 0) {
      // Eliminar del nivel principal
      const updatedFields = fields.filter(f => f.id !== fieldId);
      setFields(updatedFields);
      setValue(`params.${paramIndex}.properties`, updatedFields);
    } else {
      // Eliminar de un nivel anidado usando la función recursiva
      const updatedFields = deleteNestedField(
        [...fields],
        parentPath,
        0,
        fieldId
      );

      setFields(updatedFields);
      setValue(`params.${paramIndex}.properties`, updatedFields);
    }
  };

  // Función recursiva para eliminar un campo en cualquier nivel de anidación
  const deleteNestedField = (
    fields: FunctionTemplateParam[],
    path: string[],
    currentIndex: number,
    fieldToDelete: string
  ): FunctionTemplateParam[] => {
    console.log("deleteNestedField called with:", {
      pathLength: path.length,
      currentIndex,
      currentPathSegment: path[currentIndex],
      remainingPath: path.slice(currentIndex),
      fieldToDelete,
    });

    // Si estamos en el último nivel del camino, eliminamos el campo
    if (currentIndex >= path.length - 1) {
      console.log(
        "Reached target level, deleting field:",
        fieldToDelete,
        "from parent:",
        path[currentIndex]
      );
      // Estamos en el nivel del objeto padre, ahora eliminamos de sus propiedades
      const parentFieldId = path[currentIndex];
      const parentFieldIndex = fields.findIndex(f => f.id === parentFieldId);

      if (parentFieldIndex === -1) {
        // Debug information"Parent field not found:", parentFieldId);
        return fields;
      }

      const parentField = { ...fields[parentFieldIndex] };
      if (!parentField.properties) {
        return fields; // No hay propiedades para eliminar
      }

      // Eliminar el campo de las propiedades del padre
      console.log("Removing field:", fieldToDelete, "from parent properties");
      parentField.properties = parentField.properties.filter(
        f => f.id !== fieldToDelete
      );

      const updatedFields = [...fields];
      updatedFields[parentFieldIndex] = parentField;
      return updatedFields;
    }

    // Buscar el campo en el camino actual
    const fieldId = path[currentIndex];
    const fieldIndex = fields.findIndex(f => f.id === fieldId);

    // Si no encontramos el campo, devolvemos los campos sin cambios
    if (fieldIndex === -1) {
      console.log("Field not found in path:", fieldId);
      return fields;
    }

    // Obtener el campo actual y asegurarnos de que tiene propiedades
    const currentField = { ...fields[fieldIndex] };
    if (!currentField.properties) {
      return fields; // No hay propiedades para eliminar
    }

    // Eliminar recursivamente en las propiedades del campo
    currentField.properties = deleteNestedField(
      currentField.properties,
      path,
      currentIndex + 1,
      fieldToDelete
    );

    // Crear una nueva lista de campos con el campo actualizado
    const updatedFields = [...fields];
    updatedFields[fieldIndex] = currentField;
    return updatedFields;
  };

  const handleSaveField = (field: FunctionTemplateParam) => {
    console.log(
      "[JsonStructureEditor] handleSaveField called",
      field,
      "currentPath:",
      currentPath
    );

    if (currentPath.length === 0) {
      // Estamos en el nivel raíz
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
    } else {
      // Estamos en un nivel anidado
      console.log("Updating nested field with path:", currentPath);

      // Actualizar el campo anidado
      const updatedFields = updateNestedField(
        [...fields],
        currentPath,
        0,
        field,
        editingField?.id
      );

      console.log("Updated fields:", updatedFields);
      setFields(updatedFields);
      setValue(`params.${paramIndex}.properties`, updatedFields);
    }

    setEditingField(null);
    setIsModalOpen(false);
    setCurrentPath([]);
  };

  // Función recursiva para actualizar un campo anidado
  const updateNestedField = (
    fields: FunctionTemplateParam[],
    path: string[],
    currentIndex: number,
    newField: FunctionTemplateParam,
    originalFieldId?: string
  ): FunctionTemplateParam[] => {
    console.log("updateNestedField called with:", {
      pathLength: path.length,
      currentIndex,
      currentPathSegment: path[currentIndex],
      remainingPath: path.slice(currentIndex),
      originalFieldId,
      newFieldId: newField.id,
    });

    // Si hemos llegado al final del camino, actualizamos el campo en este nivel
    if (currentIndex >= path.length - 1) {
      console.log("Reached target level, updating field at path:", path);
      // Estamos en el nivel del objeto padre, ahora actualizamos sus propiedades
      const parentFieldId = path[currentIndex];
      const parentFieldIndex = fields.findIndex(f => f.id === parentFieldId);

      if (parentFieldIndex === -1) {
        // Debug information"Parent field not found:", parentFieldId);
        return fields;
      }

      const parentField = { ...fields[parentFieldIndex] };
      if (!parentField.properties) {
        parentField.properties = [];
      }

      // Verificar si estamos editando un campo existente o creando uno nuevo
      const isNew = !originalFieldId;

      if (isNew) {
        // Crear un nuevo campo
        // Debug information"Creating new field in parent:", parentFieldId);
        parentField.properties = [...parentField.properties, newField];
      } else {
        // Actualizar un campo existente

        const existingFieldIndex = parentField.properties.findIndex(
          f => f.id === originalFieldId
        );

        if (existingFieldIndex !== -1) {
          const updatedProperties = [...parentField.properties];
          updatedProperties[existingFieldIndex] = newField;
          parentField.properties = updatedProperties;
        } else {
          // Si no se encuentra, agregarlo como nuevo
          // Debug information"Field not found, adding as new:", newField.id);
          parentField.properties = [...parentField.properties, newField];
        }
      }

      const updatedFields = [...fields];
      updatedFields[parentFieldIndex] = parentField;
      return updatedFields;
    }

    // Buscar el campo en el camino actual
    const fieldId = path[currentIndex];
    const fieldIndex = fields.findIndex(f => f.id === fieldId);

    // Si no encontramos el campo, devolvemos los campos sin cambios
    if (fieldIndex === -1) {
      console.log("Field not found in path:", fieldId);
      return fields;
    }

    // Obtener el campo actual y asegurarnos de que tiene propiedades
    const currentField = { ...fields[fieldIndex] };
    if (!currentField.properties) {
      currentField.properties = [];
    }

    // Actualizar recursivamente las propiedades del campo
    currentField.properties = updateNestedField(
      currentField.properties,
      path,
      currentIndex + 1,
      newField,
      originalFieldId
    );

    // Crear una nueva lista de campos con el campo actualizado
    const updatedFields = [...fields];
    updatedFields[fieldIndex] = currentField;
    return updatedFields;
  };

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[JsonStructureEditor] closeModal called");
    setEditingField(null);
    setIsModalOpen(false);
    setCurrentPath([]);
    // No llamamos a onCloseMainModal aquí para evitar cerrar el modal principal
  };

  // Renderizar los campos de forma recursiva
  const renderFields = (
    fieldList: FunctionTemplateParam[],
    parentPath: string[] = []
  ) => {
    return fieldList.map(field => (
      <div key={field.id} className="space-y-1">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
          <span className="text-sm font-medium">
            {field.name || "Sin nombre"}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            <span className="text-xs text-gray-500 ml-2">({field.type})</span>
          </span>
          <div className="flex items-center gap-1">
            {field.type === ParamType.OBJECT && (
              <button
                type="button"
                onClick={e => addField(e, field)}
                className="hover:bg-gray-200 rounded p-1"
              >
                <IoMdAdd className="w-5 h-5 text-green-600" />
              </button>
            )}
            <button
              type="button"
              onClick={e => editField(field, e)}
              className="hover:bg-gray-200 rounded p-1"
            >
              <IoMdInformationCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={e => deleteField(field.id, e, parentPath)}
              className="hover:bg-gray-200 rounded p-1"
            >
              <IoMdTrash className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
        {field.type === ParamType.OBJECT &&
          field.properties &&
          field.properties.length > 0 && (
            <div className="pl-4 border-l border-gray-300 ml-4 space-y-1">
              {renderFields(field.properties, [...parentPath, field.id])}
            </div>
          )}
      </div>
    ));
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Estructura del Objeto</h3>
      </div>
      <Button
        onClick={e => addField(e as React.MouseEvent)}
        variant="primary"
        className="flex items-center gap-1 text-sm px-4 w-full"
      >
        <IoMdAdd /> Añadir Campo
      </Button>
      <div className="max-h-56 overflow-y-auto w-full mb-4">
        {fields.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay campos definidos. Haz clic en "Añadir Campo" para comenzar.
          </div>
        ) : (
          <div className="space-y-1">{renderFields(fields)}</div>
        )}
      </div>

      {isModalOpen && editingField && (
        <JsonFieldFormModal
          isShown={isModalOpen}
          onClose={closeModal}
          field={editingField}
          onSubmit={handleSaveField}
        />
      )}
    </div>
  );
};
