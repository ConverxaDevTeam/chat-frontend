import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Autenticador,
  HttpAutenticador,
  BearerConfig,
} from "@interfaces/autenticators.interface";
import { HttpMethod } from "@interfaces/functions.interface";
import { Control } from "react-hook-form";

type EndpointAuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

interface EndpointFormProps {
  register: UseFormRegister<EndpointAuthenticatorType>;
  control: Control<EndpointAuthenticatorType>;
  errors: FieldErrors<EndpointAuthenticatorType>;
  onUpdateParam?: (
    index: number,
    field: "key" | "value",
    value: string
  ) => void;
  params?: Array<{ key: string; value: string }>;
}

export const EndpointAuthenticatorForm = ({
  register,
  control,
  errors,
  onUpdateParam,
  params,
}: EndpointFormProps) => {
  return (
    <div className="space-y-4">
      <InputGroup label="Tiempo de vida (segundos)">
        <Input
          type="number"
          placeholder="Tiempo de vida"
          {...register("life_time")}
          error={errors.life_time?.message}
        />
      </InputGroup>
      <InputGroup label="URL" errors={errors.config?.url}>
        <Input placeholder="URL del endpoint" {...register("config.url")} />
      </InputGroup>
      <InputGroup label="Método" errors={errors.config?.method}>
        <Select
          name="config.method" // Agregamos el nombre del campo "method"
          control={control}
          options={Object.values(HttpMethod).map(method => ({
            value: method,
            label: method,
          }))}
        />
      </InputGroup>
      <InputGroup
        label="Token Path"
        errors={errors.config?.injectConfig?.tokenPath}
      >
        <Input
          placeholder="Ruta del token en la respuesta"
          {...register("config.injectConfig.tokenPath")}
        />
      </InputGroup>
      <InputGroup
        label="Refresh Path"
        errors={errors.config?.injectConfig?.refreshPath}
      >
        <Input
          placeholder="Ruta del refresh token en la respuesta"
          {...register("config.injectConfig.refreshPath")}
        />
      </InputGroup>
      <InputGroup
        label="Field Name"
        errors={errors.config?.injectConfig?.field_name}
      >
        <Input
          placeholder="Nombre del campo de autorización"
          defaultValue="Authorization"
          {...register("config.injectConfig.field_name")}
        />
      </InputGroup>
      {params && onUpdateParam && (
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Parámetros</h3>
          </div>
          {params.map((param, index) => (
            <div key={index} className="flex gap-2 items-start">
              <InputGroup label="Parámetro">
                <Input
                  placeholder="Nombre del parámetro"
                  value={param.key}
                  onChange={e => onUpdateParam(index, "key", e.target.value)}
                />
              </InputGroup>
              <InputGroup label="Valor">
                <Input
                  placeholder="Valor"
                  value={param.value}
                  onChange={e => onUpdateParam(index, "value", e.target.value)}
                />
              </InputGroup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
