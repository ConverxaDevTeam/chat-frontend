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
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Actualizar los campos cuando cambia el valor externo
  useEffect(() => {
    setFields(value);
  }, [value]);

  const addField = (parentPath: string[] = []) => {
    const newField = { name: "", type: ParamType.STRING, required: false };
    setEditingField(newField);
    setCurrentPath(parentPath);
  };

  const handleSaveField = (field: ObjectParamProperty) => {
    console.log("Saving field:", field);
    console.log("Current path:", currentPath);
    console.log("Editing field:", editingField);

    if (currentPath.length === 0) {
      // Si no hay ruta, estamos en el nivel raíz
      if (editingField && editingField.name) {
        // Estamos editando un campo existente
        const updatedFields = fields.map(f =>
          f.name === editingField.name ? field : f
        );
        setFields(updatedFields);
        setValue("properties", updatedFields);
      } else {
        // Estamos creando un nuevo campo
        setFields([...fields, field]);
        setValue("properties", [...fields, field]);
      }
    } else {
      // Estamos en un nivel anidado
      console.log("Updating nested field with path:", currentPath);

      // Creamos una copia del array de campos
      const updatedFields = updateNestedField(
        fields,
        currentPath,
        0,
        field,
        editingField?.name
      );

      console.log("Updated fields:", updatedFields);
      setFields(updatedFields);
      setValue("properties", updatedFields);
    }

    // Limpiar el estado de edición
    setEditingField(null);
    setCurrentPath([]);
  };

  // Función recursiva para encontrar y actualizar un campo en cualquier nivel de anidación
  const updateNestedField = (
    fields: ObjectParamProperty[],
    path: string[],
    currentIndex: number,
    newField: ObjectParamProperty,
    originalFieldName: string | undefined
  ): ObjectParamProperty[] => {
    console.log("updateNestedField called with:", {
      pathLength: path.length,
      currentIndex,
      currentPathSegment: path[currentIndex],
      remainingPath: path.slice(currentIndex),
      originalFieldName,
      newFieldName: newField.name,
    });

    // Si hemos llegado al final del camino, actualizamos el campo en este nivel
    if (currentIndex >= path.length - 1) {
      console.log("Reached target level, updating field at path:", path);
      // Estamos en el nivel del objeto padre, ahora actualizamos sus propiedades
      const parentFieldName = path[currentIndex];
      const parentFieldIndex = fields.findIndex(
        f => f.name === parentFieldName
      );

      if (parentFieldIndex === -1) {
        console.log("Parent field not found:", parentFieldName);
        return fields;
      }

      const parentField = { ...fields[parentFieldIndex] };
      if (!parentField.properties) {
        parentField.properties = [];
      }

      // Verificar si estamos editando un campo existente o creando uno nuevo
      const isNew = !originalFieldName;

      if (isNew) {
        // Crear un nuevo campo
        console.log("Creating new field in parent:", parentFieldName);
        parentField.properties = [...parentField.properties, newField];
      } else {
        // Actualizar un campo existente
        console.log(
          "Updating existing field:",
          originalFieldName,
          "to",
          newField.name
        );
        const existingFieldIndex = parentField.properties.findIndex(
          f => f.name === originalFieldName
        );

        if (existingFieldIndex !== -1) {
          const updatedProperties = [...parentField.properties];
          updatedProperties[existingFieldIndex] = newField;
          parentField.properties = updatedProperties;
        } else {
          // Si no se encuentra, agregarlo como nuevo
          console.log("Field not found, adding as new:", newField.name);
          parentField.properties = [...parentField.properties, newField];
        }
      }

      const updatedFields = [...fields];
      updatedFields[parentFieldIndex] = parentField;
      return updatedFields;
    }

    // Buscar el campo en el camino actual
    const fieldName = path[currentIndex];
    const fieldIndex = fields.findIndex(f => f.name === fieldName);

    // Si no encontramos el campo, devolvemos los campos sin cambios
    if (fieldIndex === -1) {
      console.log("Field not found in path:", fieldName);
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
      originalFieldName
    );

    // Crear una nueva lista de campos con el campo actualizado
    const updatedFields = [...fields];
    updatedFields[fieldIndex] = currentField;
    return updatedFields;
  };

  const handleEditField = (
    field: ObjectParamProperty,
    parentPath: string[] = []
  ) => {
    console.log("Edit field:", field, "Parent path:", parentPath);
    setEditingField(field);
    setCurrentPath(parentPath);
  };

  const handleAddNestedField = (
    parentField: ObjectParamProperty,
    parentPath: string[] = []
  ) => {
    console.log(
      "Add nested field to parent:",
      parentField,
      "Parent path:",
      parentPath
    );
    // Si no se proporciona una ruta, intentar encontrarla
    if (parentPath.length === 0) {
      const path = findFieldPath(fields, parentField.name);
      if (path) {
        parentPath = path;
      }
    }

    console.log("Final parent path for new field:", parentPath);
    // Crear un nuevo campo vacío y establecer la ruta del padre
    const newField = { name: "", type: ParamType.STRING, required: false };
    setEditingField(newField);
    setCurrentPath(parentPath);
  };

  // Función auxiliar para encontrar la ruta a un campo por nombre
  const findFieldPath = (
    fieldArray: ObjectParamProperty[],
    fieldName: string,
    currentPath: string[] = []
  ): string[] | null => {
    console.log(
      "Finding path for:",
      fieldName,
      "in current path:",
      currentPath
    );
    for (const field of fieldArray) {
      if (field.name === fieldName) {
        const foundPath = [...currentPath, field.name];
        console.log("Found path:", foundPath);
        return foundPath;
      }

      if (field.properties && field.properties.length > 0) {
        const nestedPath = findFieldPath(field.properties, fieldName, [
          ...currentPath,
          field.name,
        ]);

        if (nestedPath) {
          return nestedPath;
        }
      }
    }

    return null;
  };

  // Función recursiva para eliminar un campo en cualquier nivel de anidación
  const deleteNestedField = (
    fields: ObjectParamProperty[],
    path: string[],
    currentIndex: number,
    fieldToDelete: string
  ): ObjectParamProperty[] => {
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
      const parentFieldName = path[currentIndex];
      const parentFieldIndex = fields.findIndex(
        f => f.name === parentFieldName
      );

      if (parentFieldIndex === -1) {
        console.log("Parent field not found:", parentFieldName);
        return fields;
      }

      const parentField = { ...fields[parentFieldIndex] };
      if (!parentField.properties) {
        return fields; // No hay propiedades para eliminar
      }

      // Eliminar el campo de las propiedades del padre
      console.log("Removing field:", fieldToDelete, "from parent properties");
      parentField.properties = parentField.properties.filter(
        f => f.name !== fieldToDelete
      );

      const updatedFields = [...fields];
      updatedFields[parentFieldIndex] = parentField;
      return updatedFields;
    }

    // Buscar el campo en el camino actual
    const fieldName = path[currentIndex];
    const fieldIndex = fields.findIndex(f => f.name === fieldName);

    // Si no encontramos el campo, devolvemos los campos sin cambios
    if (fieldIndex === -1) {
      console.log("Field not found in path:", fieldName);
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

  const handleDeleteField = (fieldName: string, parentPath: string[] = []) => {
    if (parentPath.length === 0) {
      // Eliminar del nivel principal
      const newFields = fields.filter(f => f.name !== fieldName);
      setFields(newFields);
      setValue("properties", newFields);
    } else {
      // Eliminar de un nivel anidado usando la función recursiva
      const updatedFields = deleteNestedField(
        [...fields],
        parentPath,
        0,
        fieldName
      );

      setFields(updatedFields);
      setValue("properties", updatedFields);
    }
  };

  // Renderiza los campos de forma recursiva
  const renderFields = (
    fieldList: ObjectParamProperty[],
    parentPath: string[] = []
  ) => {
    return fieldList.map((field, index) => {
      // El path actual debe incluir el nombre del campo actual
      const fieldPath = [...parentPath, field.name];

      return (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
            <span className="text-sm font-medium">
              {field.name || "Sin nombre"}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              <span className="text-xs text-gray-500 ml-2">({field.type})</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleEditField(field, parentPath)}
                className="hover:bg-gray-200 rounded p-1"
              >
                <IoMdInformationCircle className="w-5 h-5 text-gray-600" />
              </button>
              {field.type === ParamType.OBJECT && (
                <button
                  type="button"
                  onClick={() => handleAddNestedField(field, fieldPath)}
                  className="hover:bg-gray-200 rounded p-1"
                >
                  <IoMdAdd className="w-5 h-5 text-green-600" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDeleteField(field.name, parentPath)}
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
                {renderFields(field.properties, fieldPath)}
              </div>
            )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-1 overflow-y-auto w-full">
      <div className="max-h-56 overflow-y-auto w-full">
        {renderFields(fields)}
      </div>
      <button
        type="button"
        onClick={() => addField()}
        className="flex items-center gap-2 w-full p-2 bg-gray-50 rounded hover:bg-gray-100 text-sm font-medium text-gray-600"
      >
        <IoMdAdd className="w-5 h-5" />
        <span>Agregar campo</span>
      </button>

      {editingField && (
        <JsonFieldFormModal
          isShown={!!editingField}
          onClose={() => {
            setEditingField(null);
            setCurrentPath([]);
          }}
          field={editingField}
          onSubmit={handleSaveField}
        />
      )}
    </div>
  );
};
