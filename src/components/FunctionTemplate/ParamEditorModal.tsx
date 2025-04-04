import { Controller, Control } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import Select from "@components/Select";
import { Button } from "@components/common/Button";
import { FunctionTemplateParamType } from "@interfaces/template.interface";
import { FormValues } from "./FunctionTemplateHooks";
import Modal from "@components/Modal";

interface SelectOption {
  id: string;
  name: string;
  value: FunctionTemplateParamType;
  label: string;
}

type ParamEditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
  index: number;
  control: Control<FormValues>;
};

export const ParamEditorModal: React.FC<ParamEditorModalProps> = ({
  isOpen,
  onClose,
  onRemove,
  index,
  control,
}) => {
  const options: SelectOption[] = [
    {
      id: "text",
      name: "text",
      value: FunctionTemplateParamType.STRING,
      label: "Texto",
    },
    {
      id: "number",
      name: "number",
      value: FunctionTemplateParamType.NUMBER,
      label: "Número",
    },
    {
      id: "boolean",
      name: "boolean",
      value: FunctionTemplateParamType.BOOLEAN,
      label: "Booleano",
    },
  ];

  // Preparar el header del modal
  const modalHeader = (
    <h2 className="text-xl font-semibold">Editar Parámetro</h2>
  );

  // Preparar el contenido del modal
  const modalContent = (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <Controller
            name={`params.${index}.name`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputGroup label="Nombre del parámetro">
                <Input
                  placeholder="Ingrese el nombre"
                  value={value || ""}
                  onChange={e => onChange(e.target.value)}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name={`params.${index}.title`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputGroup label="Título">
                <Input
                  placeholder="Ingrese el título"
                  value={value || ""}
                  onChange={e => onChange(e.target.value)}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="md:col-span-2 mb-4">
          <Controller
            name={`params.${index}.description`}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <InputGroup label="Descripción">
                <textarea
                  placeholder="Ingrese la descripción"
                  value={value || ""}
                  onChange={e => onChange(e.target.value)}
                  ref={ref}
                  rows={3}
                  className="flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal w-full"
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name={`params.${index}.type`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputGroup label="Tipo">
                <Select
                  options={options}
                  placeholder="Seleccionar tipo"
                  value={value}
                  onChange={onChange}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name={`params.${index}.required`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputGroup label="Requerido">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${index}`}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={value || false}
                    onChange={e => onChange(e.target.checked)}
                  />
                  <label
                    htmlFor={`required-${index}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Este parámetro es obligatorio
                  </label>
                </div>
              </InputGroup>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="cancel" onClick={onRemove} type="button">
          Eliminar parámetro
        </Button>
        <Button onClick={onClose} type="button" variant="primary">
          Guardar
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={modalHeader}
      zindex={1000}
    >
      {modalContent}
    </Modal>
  );
};
