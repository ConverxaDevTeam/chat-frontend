import Modal from "@components/Modal";
import {
  ParamType,
  ObjectParamProperty,
} from "@interfaces/function-params.interface";
import { useCallback, useMemo, useState, useEffect } from "react";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";

// Types
interface JsonFieldFormModalProps {
  isShown: boolean;
  onClose: () => void;
  field: ObjectParamProperty;
  onSubmit: (field: ObjectParamProperty) => void;
}

// Main Component
export const JsonFieldFormModal = ({
  isShown,
  onClose,
  field,
  onSubmit,
}: JsonFieldFormModalProps) => {
  const [formState, setFormState] = useState<ObjectParamProperty>(field);

  // Actualizar el estado cuando cambia el campo
  useEffect(() => {
    setFormState(field);
  }, [field]);

  const handleChange = useCallback((newState: Partial<ObjectParamProperty>) => {
    setFormState(prev => ({ ...prev, ...newState }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(formState);
    onClose();
  }, [formState, onSubmit, onClose]);

  const modalHeader = useMemo(
    () => (
      <h2 className="text-xl font-semibold">
        {formState.name ? "Editar Campo" : "Nuevo Campo"}
      </h2>
    ),
    [formState.name]
  );

  return (
    <Modal isShown={isShown} onClose={onClose} header={modalHeader}>
      <div className="space-y-4 w-[475px]">
        <div className="flex flex-col gap-[24px]">
          <InputGroup label="Nombre">
            <Input
              placeholder="Nombre del campo"
              value={formState.name}
              onChange={e => handleChange({ name: e.target.value })}
            />
          </InputGroup>

          <InputGroup label="Tipo">
            <Select
              name="fieldType"
              value={formState.type}
              onChange={value => handleChange({ type: value as ParamType })}
              options={Object.values(ParamType).map(type => ({
                value: type,
                label: type,
              }))}
              placeholder="Seleccionar tipo"
            />
          </InputGroup>

          <InputGroup label="Descripción">
            <TextArea
              placeholder="Descripción del campo"
              value={formState.description || ""}
              onChange={e => handleChange({ description: e.target.value })}
              rows={3}
            />
          </InputGroup>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formState.required || false}
              onChange={e => handleChange({ required: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 accent-sofia-electricOlive"
            />
            <label className="ml-2 text-sofia-superDark text-[14px] font-semibold leading-[16px]">
              Requerido
            </label>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          {formState.name ? "Actualizar campo" : "Agregar campo"}
        </Button>
      </div>
    </Modal>
  );
};
