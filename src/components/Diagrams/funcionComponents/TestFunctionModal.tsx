import Modal from "@components/Modal";
import { useForm } from "react-hook-form";
import { FunctionParam } from "@interfaces/function-params.interface";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { useState } from "react";
import { TestResponseModal } from "./TestResponseModal";
import { getErrorResponse } from "@utils/format";
import { Button } from "@components/common/Button";

interface TestFunctionModalProps {
  isShown: boolean;
  onClose: () => void;
  onTest: (
    params: Record<string, unknown>
  ) => Promise<{ status: number; data: unknown }>;
  params: FunctionParam[];
}

type Property = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: Property[];
};

export const TestFunctionModal = ({
  isShown,
  onClose,
  onTest,
  params,
}: TestFunctionModalProps) => {
  const { register, handleSubmit } = useForm();
  const [testResponse, setTestResponse] = useState<{
    status: number;
    data: unknown;
  } | null>(null);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      console.log("Form data:", data);

      // Transformar datos para manejar objetos anidados
      const transformedData = transformFormData(data);
      console.log("Transformed data:", transformedData);

      const response = await onTest(transformedData);
      const responseData = response.data as Record<string, unknown>;
      if ("error" in responseData) {
        setTestResponse({
          status: (responseData?.error as { status: number })?.status || 500,
          data: responseData,
        });
        return;
      }
      setTestResponse({
        status: response.status,
        data: response.data,
      });
    } catch (error: unknown) {
      setTestResponse(getErrorResponse(error));
    }
  };

  // Función para transformar datos del formulario en estructura anidada
  const transformFormData = (
    data: Record<string, unknown>
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    // Procesar todos los campos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (!key.includes(".")) {
        // Campos de primer nivel
        result[key] = value;
      }
    });

    // Procesar campos anidados
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes(".")) {
        const parts = key.split(".");
        let current = result;

        // Construir la estructura anidada
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as Record<string, unknown>;
        }

        // Asignar el valor al último nivel
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
      }
    });

    return result;
  };

  // Renderiza campos de formulario de forma recursiva
  const renderFormFields = (
    parameters: FunctionParam[] | Property[],
    prefix = ""
  ): JSX.Element[] => {
    return parameters.flatMap(param => {
      const fieldName = prefix ? `${prefix}.${param.name}` : param.name;

      if (param.type === "object" && param.properties) {
        return [
          <div key={fieldName} className="mt-4 mb-2">
            <h3 className="font-medium text-gray-700">
              {param.name}
              {param.required ? " *" : ""}
            </h3>
            {param.description && (
              <p className="text-sm text-gray-500">{param.description}</p>
            )}
          </div>,
          ...renderFormFields(param.properties, fieldName),
        ];
      }

      return [
        <InputGroup
          key={fieldName}
          label={`${fieldName}${param.required ? " *" : ""}`}
        >
          <Input
            placeholder={`Ingrese ${param.name}`}
            register={register(fieldName, {
              required: param.required ? "Este campo es requerido" : false,
              valueAsNumber: param.type === "number",
            })}
            type={param.type === "number" ? "number" : "text"}
          />
          {param.description && (
            <p className="text-xs text-gray-500 mt-1">{param.description}</p>
          )}
        </InputGroup>,
      ];
    });
  };

  return (
    <>
      <Modal
        isShown={isShown}
        onClose={onClose}
        header={<h2 className="text-xl font-semibold">Probar función</h2>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[475px]">
          {params.length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              Esta función no tiene parámetros configurados
            </p>
          ) : (
            renderFormFields(params)
          )}
          {params.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 text-gray-500 border-2"
                variant="cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full px-4 py-2 text-gray-900 hover:bg-opacity-50 transition-all"
                variant="primary"
              >
                Probar
              </Button>
            </div>
          )}
        </form>
      </Modal>
      {testResponse && (
        <TestResponseModal
          isShown={!!testResponse}
          onClose={() => setTestResponse(null)}
          response={testResponse}
        />
      )}
    </>
  );
};
