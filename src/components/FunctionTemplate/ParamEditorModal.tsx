import { Controller, Control, useWatch } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { FormValues } from "./FunctionTemplateHooks";
import Modal from "@components/Modal";
import { JsonStructureEditor } from "./JsonStructureEditor";
import { ParamType } from "@interfaces/function-params.interface";
import { useRef } from "react";

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
  // Modal rendering state
  const modalRef = useRef<HTMLDivElement>(null);
  // Obtener las propiedades del parámetro actual usando useWatch
  const properties = useWatch({ control, name: `params.${index}.properties` });
  const options = [
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

  // Preparar el header del modal
  const modalHeader = (
    <h2 className="text-xl font-semibold">Editar Parámetro</h2>
  );

  // Preparar el contenido del modal
  const modalContent = (
    <div className="w-full">
      <div
        className="flex flex-col gap-[24px]"
        onClick={e => e.stopPropagation()}
      >
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
                  className="flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-app-darkBlue text-app-superDark text-[14px] font-normal leading-normal w-full"
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
                  name={field.name}
                  control={control}
                  options={options}
                  placeholder="Seleccionar tipo"
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
                    className="h-4 w-4 rounded border-gray-300 accent-app-electricOlive"
                    checked={value || false}
                    onChange={e => onChange(e.target.checked)}
                  />
                  <label
                    htmlFor={`required-${index}`}
                    className="ml-2 text-app-superDark text-[14px] font-semibold leading-[16px]"
                  >
                    Este parámetro es obligatorio
                  </label>
                </div>
              </InputGroup>
            )}
          />
        </div>

        {/* Mostrar el editor de estructura JSON si el tipo es OBJECT */}
        {useWatch({ control, name: `params.${index}.type` }) ===
          ParamType.OBJECT && (
          <div className="mb-4">
            <InputGroup label="Propiedades">
              <JsonStructureEditor
                value={properties || []}
                setValue={(_, value) => {
                  control._formValues.params[index].properties = value;
                }}
                paramIndex={index}
                control={control}
              />
            </InputGroup>
          </div>
        )}

        <div className="flex justify-between mt-6 gap-4">
          <Button
            variant="cancel"
            onClick={onRemove}
            type="button"
            className="w-1/3"
          >
            Eliminar parámetro
          </Button>
          <Button
            onClick={onClose}
            type="button"
            variant="primary"
            className="w-2/3"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );

  const handleClose = () => {
    // Handle modal close
    onClose();
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={handleClose}
      header={modalHeader}
      zindex={2000}
      modalRef={modalRef}
    >
      <form className="space-y-4 w-[550px]" onClick={e => e.stopPropagation()}>
        {modalContent}
      </form>
    </Modal>
  );
};
