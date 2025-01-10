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

type EndpointAuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

interface EndpointFormProps {
  register: UseFormRegister<EndpointAuthenticatorType>;
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
      <InputGroup label="URL">
        <Input
          placeholder="URL del endpoint"
          {...register("config.url")}
          error={errors.config?.url?.message}
        />
      </InputGroup>
      <InputGroup label="Método">
        <Select
          register={register("config.method")}
          error={errors.config?.method?.message}
          options={Object.values(HttpMethod).map(method => ({
            value: method,
            label: method,
          }))}
        />
      </InputGroup>
      <InputGroup label="Token Path">
        <Input
          placeholder="Ruta del token en la respuesta"
          {...register("config.injectConfig.tokenPath")}
          error={errors.config?.injectConfig?.tokenPath?.message}
        />
      </InputGroup>
      <InputGroup label="Refresh Path">
        <Input
          placeholder="Ruta del refresh token en la respuesta"
          {...register("config.injectConfig.refreshPath")}
          error={errors.config?.injectConfig?.refreshPath?.message}
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
