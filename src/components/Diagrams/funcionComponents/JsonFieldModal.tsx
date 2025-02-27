import Modal from "@components/Modal";
import { Button } from "@components/common/Button";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { TextArea } from "@components/forms/textArea";
import { useForm } from "react-hook-form";

interface JsonField {
  key: string;
  type: string;
  required: boolean;
  description?: string;
}

interface JsonFieldModalProps {
  isShown: boolean;
  onClose: () => void;
  field: JsonField;
  onSubmit: (field: JsonField) => void;
}

export const JsonFieldModal = ({
  isShown,
  onClose,
  field,
  onSubmit,
}: JsonFieldModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JsonField>({
    defaultValues: field,
  });

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={<h2 className="text-xl font-semibold">Editar Campo</h2>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[475px]">
        <InputGroup label="Nombre" errors={errors.key}>
          <Input
            placeholder="Nombre del campo"
            register={register("key", { required: "El nombre es obligatorio" })}
            error={errors.key?.message}
          />
        </InputGroup>

        <InputGroup label="Tipo" errors={errors.type}>
          <Select
            name="type"
            control={control}
            options={[
              { value: "string", label: "Texto" },
              { value: "number", label: "Número" },
              { value: "boolean", label: "Si/No" },
              { value: "object", label: "Objeto" },
            ]}
            placeholder="Seleccionar tipo"
          />
        </InputGroup>

        <InputGroup label="Descripción" errors={errors.description}>
          <TextArea
            placeholder="Descripción del campo"
            register={register("description")}
            error={errors.description?.message}
            rows={3}
          />
        </InputGroup>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("required")}
            className="h-4 w-4 rounded border-gray-300 accent-sofia-electricOlive"
          />
          <label className="ml-2 text-sofia-superDark text-[14px] font-semibold leading-[16px]">
            Requerido
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Guardar
        </Button>
      </form>
    </Modal>
  );
};
