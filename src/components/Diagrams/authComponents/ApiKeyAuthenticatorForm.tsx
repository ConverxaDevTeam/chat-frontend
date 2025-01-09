import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  ApiKeyAutenticador,
  ApiKeyInjectPlaces,
} from "@interfaces/autenticators.interface";

interface ApiKeyFormProps {
  register: UseFormRegister<ApiKeyAutenticador>;
  errors: FieldErrors<ApiKeyAutenticador>;
}

export const ApiKeyAuthenticatorForm = ({
  register,
  errors,
}: ApiKeyFormProps) => {
  return (
    <div className="space-y-4">
      <InputGroup label="API Key">
        <Input
          placeholder="Ingrese la API Key"
          {...register("config.key")}
          error={errors.config?.key?.message}
        />
      </InputGroup>
      <InputGroup label="Ubicación">
        <Select
          register={register("config.injectPlace")}
          error={errors.config?.injectPlace?.message}
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
