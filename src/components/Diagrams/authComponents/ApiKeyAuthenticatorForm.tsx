import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  ApiKeyAutenticador,
  ApiKeyInjectPlaces,
} from "@interfaces/autenticators.interface";
import { Control } from "react-hook-form";

interface ApiKeyFormProps {
  register: UseFormRegister<ApiKeyAutenticador>;
  control: Control<ApiKeyAutenticador>;
  errors: FieldErrors<ApiKeyAutenticador>;
}

export const ApiKeyAuthenticatorForm = ({
  control,
  register,
  errors,
}: ApiKeyFormProps) => {
  return (
    <div className="space-y-4">
      <InputGroup label="API Key" errors={errors.config?.key}>
        <Input placeholder="Ingrese la API Key" {...register("config.key")} />
      </InputGroup>
      <InputGroup label="Ubicación" errors={errors.config?.injectPlace}>
        <Select
          name="config.injectPlace"
          control={control}
          options={Object.values(ApiKeyInjectPlaces).map(place => ({
            value: place,
            label:
              place === ApiKeyInjectPlaces.HEADER ? "Header" : "Query Param",
          }))}
        />
      </InputGroup>
    </div>
  );
};
