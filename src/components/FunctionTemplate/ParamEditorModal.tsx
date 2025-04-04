import { Controller, Control } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
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
  const modalHeader = <div>Editar Parámetro</div>;

  // Preparar el contenido del modal
  const modalContent = (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <Controller
            name={`params.${index}.name`}
            control={control}
            render={({ field }) => (
              <InputGroup label="Nombre del parámetro">
                <Input
                  placeholder="Ingrese el nombre"
                  register={{
                    ...field,
                    onChange: async e => await field.onChange(e),
                    onBlur: async () => await field.onBlur(),
                  }}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name={`params.${index}.title`}
            control={control}
            render={({ field }) => (
              <InputGroup label="Título">
                <Input
                  placeholder="Ingrese el título"
                  register={{
                    ...field,
                    onChange: async e => await field.onChange(e),
                    onBlur: async () => await field.onBlur(),
                  }}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="md:col-span-2 mb-4">
          <Controller
            name={`params.${index}.description`}
            control={control}
            render={({ field }) => (
              <InputGroup label="Descripción">
                <TextArea
                  placeholder="Ingrese la descripción"
                  register={{
                    ...field,
                    onChange: async e => await field.onChange(e),
                    onBlur: async () => await field.onBlur(),
                  }}
                  rows={3}
                />
              </InputGroup>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name={`params.${index}.type`}
            control={control}
            render={({ field }) => (
              <InputGroup label="Tipo">
                <Select
                  options={options}
                  placeholder="Seleccionar tipo"
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="cancel" onClick={onRemove}>
          Eliminar parámetro
        </Button>
        <Button onClick={onClose}>Guardar</Button>
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
