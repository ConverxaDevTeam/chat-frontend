import { FunctionTemplate } from "@interfaces/template.interface";
import { AuthenticatorType } from "@interfaces/autenticators.interface";
import { ParamConfigItem, WizardFormValues } from "./types";
import { Button } from "@components/common/Button";
import { Input } from "@components/forms/input";
import { ParamItem } from "./ParamComponents";
import { Controller, useFormContext } from "react-hook-form";

// Componente para los botones de acción
export const ActionButtons = ({
  onCancel,
  onSave,
  goToPreviousTab,
  goToNextTab,
  isFirstTab,
  isLastTab,
}: {
  onCancel: () => void;
  onSave: () => void;
  goToPreviousTab: () => void;
  goToNextTab: () => void;
  isFirstTab: boolean;
  isLastTab: boolean;
}) => (
  <div className="flex gap-3">
    <Button variant="cancel" type="button" onClick={onCancel}>
      Cancelar
    </Button>
    {!isFirstTab && (
      <Button variant="default" type="button" onClick={goToPreviousTab}>
        Anterior
      </Button>
    )}
    {!isLastTab ? (
      <Button variant="primary" type="button" onClick={goToNextTab}>
        Siguiente
      </Button>
    ) : (
      <Button variant="primary" type="button" onClick={onSave}>
        Guardar
      </Button>
    )}
  </div>
);

// Componente para mostrar la información de la función
// Función auxiliar para extraer el path de una URL
const getPathFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (e) {
    // Si no es una URL válida, devolvemos la cadena original
    return url;
  }
};

const FunctionHeader = ({ template }: { template: FunctionTemplate }) => (
  <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="w-14 h-14 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center">
      <img
        src={template.application?.imageUrl || "/mvp/function.svg"}
        alt={template.name}
        className="w-10 h-10 object-contain"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-800">{template.name}</h3>
      <p className="text-gray-600 mt-1 text-sm">{template.description}</p>
      {template.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const InfoCard = ({
  icon,
  title,
  value,
  alt,
}: {
  icon: string;
  title: string;
  value: string;
  alt: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-2">
      <img src={icon} alt={alt} className="w-5 h-5" />
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    </div>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

const AuthenticationSection = ({
  authenticators,
  selectedAuthenticatorId,
  onAuthenticatorChange,
  onManageAuthenticators,
}: {
  authenticators: AuthenticatorType[];
  selectedAuthenticatorId?: number;
  onAuthenticatorChange: (authenticatorId?: number) => void;
  onManageAuthenticators: () => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-3">
      <img src="/mvp/lock.svg" alt="Autenticación" className="w-5 h-5" />
      <h4 className="text-sm font-medium text-gray-700">Autenticación</h4>
    </div>
    <div className="flex gap-2 items-center">
      <select
        className="flex-1 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
        value={selectedAuthenticatorId || ""}
        onChange={e =>
          onAuthenticatorChange(
            e.target.value ? Number(e.target.value) : undefined
          )
        }
      >
        <option value="">Sin autenticación</option>
        {authenticators.map(auth => (
          <option key={auth.id} value={auth.id}>
            {auth.name}
          </option>
        ))}
      </select>
      <Button
        variant="primary"
        type="button"
        onClick={onManageAuthenticators}
        className="flex items-center gap-1"
      >
        <img src="/mvp/sliders-vertical.svg" alt="" className="w-4 h-4" />
        Gestionar
      </Button>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      Selecciona un método de autenticación para acceder a esta función
    </p>
  </div>
);

const FunctionUrlSection = ({
  template,
  onDomainChange,
}: {
  template: FunctionTemplate;
  onDomainChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-2">
      <img src="/mvp/globe.svg" alt="URL" className="w-5 h-5" />
      <h4 className="text-sm font-medium text-gray-700">
        Dirección de la función
      </h4>
    </div>
    {template.application?.isDynamicDomain ? (
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            Dominio personalizado
          </label>
          <Input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com"
            defaultValue={template.application?.domain || ""}
            onChange={onDomainChange}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Ruta de la función
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200 text-gray-600 break-all text-sm">
            {getPathFromUrl(template.url)}
          </div>
        </div>
      </div>
    ) : (
      <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200 text-gray-600 break-all text-sm">
        {template.url}
      </div>
    )}
  </div>
);

export const FunctionContent = ({
  template,
  authenticators,
  selectedAuthenticatorId,
  onAuthenticatorChange,
  onManageAuthenticators,
  onDomainChange,
}: {
  template: FunctionTemplate;
  authenticators: AuthenticatorType[];
  selectedAuthenticatorId?: number;
  onAuthenticatorChange: (authenticatorId?: number) => void;
  onManageAuthenticators: () => void;
  onDomainChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-6">
    <FunctionHeader template={template} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard
        icon="/mvp/square-library.svg"
        title="Aplicación"
        value={template.application?.name || "No especificada"}
        alt="Aplicación"
      />
      <InfoCard
        icon="/mvp/layout-grid-plus.svg"
        title="Categoría"
        value={template.category?.name || "No especificada"}
        alt="Categoría"
      />
    </div>
    <AuthenticationSection
      authenticators={authenticators}
      selectedAuthenticatorId={selectedAuthenticatorId}
      onAuthenticatorChange={onAuthenticatorChange}
      onManageAuthenticators={onManageAuthenticators}
    />
    <FunctionUrlSection template={template} onDomainChange={onDomainChange} />
  </div>
);

const NoParamsMessage = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
    <img
      src="/mvp/circle-alert.svg"
      alt="Info"
      className="w-12 h-12 mx-auto mb-2 opacity-50"
    />
    <p className="text-gray-500 italic">
      Esta función no tiene parámetros configurables.
    </p>
  </div>
);

export const ParamsContent = ({ params }: { params: ParamConfigItem[] }) => {
  const { control } = useFormContext<WizardFormValues>();

  if (!params || params.length === 0) {
    return <NoParamsMessage />;
  }

  return (
    <div className="space-y-4">
      <Controller
        name="params"
        control={control}
        render={({ field }) => (
          <>
            {params.map(param => (
              <ParamItem
                key={param.id}
                param={param}
                value={field.value?.find(p => p.id === param.id)}
                onChange={updatedParam => {
                  const updatedParams =
                    field.value?.map(p =>
                      p.id === param.id ? updatedParam : p
                    ) || [];
                  field.onChange(updatedParams);
                }}
              />
            ))}
          </>
        )}
      />
    </div>
  );
};
