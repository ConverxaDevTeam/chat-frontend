import { useState, useEffect } from "react";
import {
  getApplications,
  getTemplatesByApplication,
} from "@services/template.service";
import {
  FunctionTemplate,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import InfoTooltip from "./Common/InfoTooltip";
import Loading from "./Loading";
import { TemplateWizard } from "./TemplateWizard/TemplateWizard";

interface ApplicationItem {
  application: FunctionTemplateApplication;
  templates: FunctionTemplate[] | null;
  isLoading: boolean;
}

// Hook personalizado para cargar solo las aplicaciones
const useApplicationsData = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const apps = await getApplications();

      const appItems = apps.map(app => ({
        application: app,
        templates: null, // No cargamos templates inicialmente
        isLoading: false,
      }));

      setApplications(appItems);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar templates de una aplicación específica
  const loadTemplatesForApplication = async (applicationId: number) => {
    // Encontrar el índice de la aplicación
    const appIndex = applications.findIndex(
      item => item.application.id === applicationId
    );
    if (appIndex === -1) return;

    // Actualizar el estado de carga
    setApplications(prev => {
      const updated = [...prev];
      updated[appIndex] = { ...updated[appIndex], isLoading: true };
      return updated;
    });

    try {
      // Cargar templates para esta aplicación
      const templates = await getTemplatesByApplication(applicationId);

      // Actualizar el estado con los templates cargados
      setApplications(prev => {
        const updated = [...prev];
        updated[appIndex] = {
          ...updated[appIndex],
          templates,
          isLoading: false,
        };
        return updated;
      });
    } catch (error) {
      console.error(
        `Error loading templates for application ${applicationId}:`,
        error
      );
      // Actualizar el estado para indicar que la carga falló
      setApplications(prev => {
        const updated = [...prev];
        updated[appIndex] = { ...updated[appIndex], isLoading: false };
        return updated;
      });
    }
  };

  return {
    applications,
    loading,
    fetchApplications,
    loadTemplatesForApplication,
  };
};

// Componente para la cabecera del sidebar
const SidebarHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
    <h3 className="text-lg font-semibold">Aplicaciones</h3>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      ✕
    </button>
  </div>
);

// Componente para mostrar el estado de carga
const LoadingState = () => (
  <div className="flex justify-center items-center h-full py-8">
    <Loading />
  </div>
);

// Componente para la imagen de la aplicación
const ApplicationImage = ({
  imageUrl,
  altText,
  size = "large",
  isFunction = false,
  isApplication = false,
}: {
  imageUrl?: string;
  altText: string;
  size?: "large" | "small";
  isFunction?: boolean;
  isApplication?: boolean;
}) => {
  if (!imageUrl) return null;

  const sizeClass = size === "large" ? "w-12 h-12" : "w-9 h-9";
  const styleClass =
    isFunction || isApplication ? "p-1 bg-white border-2 shadow-sm" : "";
  const borderClass = isFunction
    ? "border-blue-300"
    : isApplication
      ? "border-gray-400"
      : "";

  return (
    <div className="flex items-center justify-center self-center">
      <img
        src={imageUrl}
        alt={altText}
        className={`${sizeClass} ${styleClass} ${borderClass} rounded-full object-cover`}
        onError={e => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
};

// Componente para mostrar la información de la aplicación
const ApplicationHeader = ({
  application,
  isExpanded,
  toggleExpand,
}: {
  application: FunctionTemplateApplication;
  isExpanded: boolean;
  toggleExpand: () => void;
}) => (
  <div
    className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm border-l-4 border-gray-400 cursor-pointer"
    onClick={toggleExpand}
  >
    <ApplicationImage
      imageUrl={application.imageUrl}
      altText={application.name}
      isApplication={true}
    />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">{application.name}</h4>
        <img
          src={isExpanded ? "/mvp/chevron-up.svg" : "/mvp/chevron-down.svg"}
          alt={isExpanded ? "Collapse" : "Expand"}
          className="w-5 h-5 text-gray-600"
        />
      </div>
      {application.description && (
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-600 line-clamp-2">
            {application.description}
          </p>
          {application.description.length > 100 && (
            <InfoTooltip
              text={application.description}
              position="bottom"
              width="250px"
              iconSrc="/mvp/Vector.svg"
            />
          )}
        </div>
      )}
    </div>
  </div>
);

// Componente para mostrar un template individual
const TemplateItem = ({
  template,
  applicationImageUrl,
  onTemplateClick,
}: {
  template: FunctionTemplate;
  applicationImageUrl?: string;
  onTemplateClick: (templateId: number) => void;
}) => (
  <div
    key={template.id}
    className="flex flex-col p-2 hover:bg-gray-100 rounded-md cursor-pointer border-l-2 border-blue-300 shadow-sm"
    onClick={() => onTemplateClick(template.id)}
  >
    <div className="flex items-center gap-3 py-1">
      <ApplicationImage
        imageUrl={applicationImageUrl}
        altText={template.name}
        size="small"
        isFunction={true}
      />
      <span className="font-medium text-blue-700">{template.name}</span>
    </div>

    {template.description && (
      <div className="flex items-center gap-1 ml-8 mt-1">
        <p className="text-xs text-gray-600 line-clamp-2">
          {template.description}
        </p>
        {template.description.length > 100 && (
          <InfoTooltip
            text={template.description}
            position="bottom"
            width="250px"
            iconSrc="/mvp/Vector.svg"
          />
        )}
      </div>
    )}

    {template.tags && template.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 ml-8 mt-1">
        {template.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Componente para mostrar un grupo de templates
const ApplicationGroup = ({
  appItem,
  onTemplateClick,
  onExpand,
}: {
  appItem: ApplicationItem;
  onTemplateClick: (templateId: number) => void;
  onExpand: (applicationId: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // Si se está expandiendo y no se han cargado los templates, cargarlos
    if (newExpandedState && appItem.templates === null) {
      onExpand(appItem.application.id);
    }
  };

  return (
    <div className="mb-4">
      <ApplicationHeader
        application={appItem.application}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
      />
      {isExpanded && (
        <div className="mt-2 pl-2">
          {appItem.isLoading ? (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          ) : appItem.templates && appItem.templates.length > 0 ? (
            <>
              <h5 className="text-sm font-medium text-gray-700 mb-1 ml-2">
                Funciones disponibles:
              </h5>
              <div className="space-y-2">
                {appItem.templates.map(template => (
                  <TemplateItem
                    key={template.id}
                    template={template}
                    applicationImageUrl={appItem.application.imageUrl}
                    onTemplateClick={onTemplateClick}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500 italic ml-2 py-2">
              No hay funciones disponibles para esta aplicación.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente principal
export const ApplicationsSidebar = ({
  onClose,
  agentId,
}: {
  onClose: () => void;
  agentId: number;
}) => {
  const {
    applications,
    loading,
    fetchApplications,
    loadTemplatesForApplication,
  } = useApplicationsData();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchApplications();
  }, []);

  const handleTemplateClick = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  const handleApplicationExpand = (applicationId: number) => {
    loadTemplatesForApplication(applicationId);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <SidebarHeader onClose={onClose} />

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <LoadingState />
            ) : (
              <div className="space-y-4">
                {applications.map(appItem => (
                  <ApplicationGroup
                    key={appItem.application.id}
                    appItem={appItem}
                    onTemplateClick={handleTemplateClick}
                    onExpand={handleApplicationExpand}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTemplateId && (
        <TemplateWizard
          isOpen={isWizardOpen}
          onClose={handleWizardClose}
          templateId={selectedTemplateId}
          agentId={agentId}
        />
      )}
    </div>
  );
};
