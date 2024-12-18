import Modal from "@components/Modal";
import { useForm } from "react-hook-form";
import { FunctionParam } from "@interfaces/function-params.interface";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { useState } from "react";
import { TestResponseModal } from "./TestResponseModal";
import { getErrorResponse } from "@utils/format";

interface TestFunctionModalProps {
  isShown: boolean;
  onClose: () => void;
  onTest: (
    params: Record<string, unknown>
  ) => Promise<{ status: number; data: unknown }>;
  params: FunctionParam[];
}

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
      const response = await onTest(data);
      setTestResponse({
        status: response.status,
        data: response.data,
      });
    } catch (error: unknown) {
      setTestResponse(getErrorResponse(error));
    }
  };

  return (
    <>
      <Modal
        isShown={isShown}
        onClose={onClose}
        header={<h2 className="text-xl font-semibold">Probar Función</h2>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {params.length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              Esta función no tiene parámetros configurados
            </p>
          ) : (
            params.map(param => (
              <InputGroup key={param.name} label={param.name}>
                <Input
                  placeholder={`Ingrese ${param.name}`}
                  register={register(param.name, {
                    required: "Este campo es requerido",
                    valueAsNumber: param.type === "number",
                  })}
                  type={param.type === "number" ? "number" : "text"}
                />
              </InputGroup>
            ))
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Probar
            </button>
          </div>
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
