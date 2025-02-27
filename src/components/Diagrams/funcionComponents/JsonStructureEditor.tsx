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
    if (currentPath.length === 0) {
      // Agregar/editar en el nivel principal
      // Verificar si estamos editando un campo existente o creando uno nuevo
      const existingFieldIndex = fields.findIndex(
        f => f.name === editingField?.name
      );
      const isNew = existingFieldIndex === -1;

      let newFields;
      if (isNew) {
        // Crear un nuevo campo
        newFields = [...fields, field];
      } else {
        // Actualizar un campo existente
        newFields = [...fields];
        newFields[existingFieldIndex] = field;
      }

      setFields(newFields);
      setValue("properties", newFields);
    } else {
      // Agregar/editar en un objeto anidado
      const newFields = [...fields];
      let currentObj = newFields;
      let targetObj = null;

      // Navegar hasta el objeto padre
      for (let i = 0; i < currentPath.length; i++) {
        const fieldName = currentPath[i];
        targetObj = currentObj.find(f => f.name === fieldName);

        if (targetObj && i < currentPath.length - 1) {
          if (!targetObj.properties) {
            targetObj.properties = [];
          }
          currentObj = targetObj.properties;
        }
      }

      // Agregar o actualizar el campo en el objeto padre
      if (targetObj) {
        if (!targetObj.properties) {
          targetObj.properties = [];
        }

        // Verificar si estamos editando un campo existente o creando uno nuevo
        const existingFieldIndex = targetObj.properties.findIndex(
          f => f.name === editingField?.name
        );
        const isNew = existingFieldIndex === -1;

        if (isNew) {
          // Crear un nuevo campo
          targetObj.properties.push(field);
        } else {
          // Actualizar un campo existente
          targetObj.properties[existingFieldIndex] = field;
        }

        setFields(newFields);
        setValue("properties", newFields);
      }
    }

    setEditingField(null);
    setCurrentPath([]);
  };

  const handleEditField = (field: ObjectParamProperty) => {
    console.log(field, "on edit field");
    setEditingField(field);
    setCurrentPath([]);
  };

  const handleAddNestedField = (parentField: ObjectParamProperty) => {
    // Encontrar la ruta al campo padre
    const path = findFieldPath(fields, parentField.name);
    if (path) {
      addField(path);
    }
  };

  // Función auxiliar para encontrar la ruta a un campo por nombre
  const findFieldPath = (
    fieldArray: ObjectParamProperty[],
    fieldName: string,
    currentPath: string[] = []
  ): string[] | null => {
    for (const field of fieldArray) {
      if (field.name === fieldName) {
        return [...currentPath, field.name];
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

  const handleDeleteField = (fieldName: string, parentPath: string[] = []) => {
    if (parentPath.length === 0) {
      // Eliminar del nivel principal
      const newFields = fields.filter(f => f.name !== fieldName);
      setFields(newFields);
      setValue("properties", newFields);
    } else {
      // Eliminar de un objeto anidado
      const newFields = [...fields];
      let currentObj = newFields;
      let targetObj = null;

      // Navegar hasta el objeto padre
      for (let i = 0; i < parentPath.length; i++) {
        const pathFieldName = parentPath[i];
        targetObj = currentObj.find(f => f.name === pathFieldName);

        if (targetObj && i < parentPath.length - 1) {
          if (!targetObj.properties) {
            return; // No hay propiedades para eliminar
          }
          currentObj = targetObj.properties;
        }
      }

      // Eliminar el campo del objeto padre
      if (targetObj && targetObj.properties) {
        targetObj.properties = targetObj.properties.filter(
          f => f.name !== fieldName
        );
        setFields(newFields);
        setValue("properties", newFields);
      }
    }
  };

  // Renderiza los campos de forma recursiva
  const renderFields = (
    fieldList: ObjectParamProperty[],
    parentPath: string[] = []
  ) => {
    return fieldList.map((field, index) => {
      const currentPath = [...parentPath, field.name];

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
                onClick={() => handleEditField(field)}
                className="hover:bg-gray-200 rounded p-1"
              >
                <IoMdInformationCircle className="w-5 h-5 text-gray-600" />
              </button>
              {field.type === ParamType.OBJECT && (
                <button
                  type="button"
                  onClick={() => handleAddNestedField(field)}
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
                {renderFields(field.properties, currentPath)}
              </div>
            )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-1">
      {renderFields(fields)}

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
