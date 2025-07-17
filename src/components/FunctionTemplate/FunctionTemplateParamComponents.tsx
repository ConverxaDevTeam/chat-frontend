import React, { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { ParamType } from "@interfaces/function-params.interface";

import { FormValues } from "./FunctionTemplateHooks";
import { ParamEditorModal } from "./ParamEditorModal";

interface ParamsContentProps {
  control: Control<FormValues>;
}

export const ParamsContent: React.FC<ParamsContentProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "params",
  });
  const [editingParamIndex, setEditingParamIndex] = useState<number | null>(
    null
  );

  const addNewParam = () => {
    const name = `param_${fields.length + 1}`;
    const id = name.replace(/\s+/g, "-").toLowerCase();
    append({
      id,
      name,
      title: "",
      description: "",
      type: ParamType.STRING,
      required: false,
    });
    // Abrir el modal para editar el nuevo parámetro
    setEditingParamIndex(fields.length);
  };

  const handleCloseModal = () => {
    setEditingParamIndex(null);
  };

  return (
    <div className="py-4 w-[450px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Parámetros</h3>
        <button
          onClick={addNewParam}
          className="flex items-center text-app-primary hover:text-app-primary-dark transition-colors"
        >
          <img
            src="/mvp/circle-plus.svg"
            alt="Agregar"
            className="w-5 h-5 mr-1"
          />
          <span className="text-sm">Agregar parámetro</span>
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">
            No hay parámetros configurados
          </p>
          <button
            onClick={addNewParam}
            className="mt-2 text-app-primary hover:text-app-primary-dark text-sm font-medium"
          >
            Agregar el primer parámetro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 w-full">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-md p-3 flex justify-between items-center w-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex-grow overflow-hidden">
                <h4 className="font-medium truncate">{field.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Requerido
                    </span>
                  )}
                </div>
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {field.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => setEditingParamIndex(index)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title="Editar parámetro"
                >
                  <img
                    src="/mvp/square-pen.svg"
                    alt="Editar"
                    className="w-4 h-4"
                  />
                </button>
                <button
                  onClick={() => remove(index)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title="Eliminar parámetro"
                >
                  <img
                    src="/mvp/trash.svg"
                    alt="Eliminar"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingParamIndex !== null && (
        <ParamEditorModal
          isOpen={editingParamIndex !== null}
          onClose={handleCloseModal}
          onRemove={() => {
            remove(editingParamIndex);
            handleCloseModal();
          }}
          index={editingParamIndex as number}
          control={control}
        />
      )}
    </div>
  );
};
