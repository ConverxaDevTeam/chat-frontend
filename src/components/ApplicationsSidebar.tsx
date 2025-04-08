import { useState, useEffect } from "react";
import { getApplications, getTemplates } from "@services/template.service";
import {
  FunctionTemplate,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import InfoTooltip from "./Common/InfoTooltip";
import Loading from "./Loading";
import { TemplateWizard } from "./TemplateWizard/TemplateWizard";

interface GroupedTemplates {
  application: FunctionTemplateApplication;
  templates: FunctionTemplate[];
}

// Hook personalizado para cargar las aplicaciones y templates
const useApplicationsData = () => {
  const [groups, setGroups] = useState<GroupedTemplates[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [applications, templates] = await Promise.all([
        getApplications(),
        getTemplates(),
      ]);

      const grouped = applications.map(app => ({
        application: app,
        templates: templates.filter(t => t.applicationId === app.id),
      }));

      setGroups(grouped.filter(g => g.templates.length > 0));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, fetchData };
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
  group,
  onTemplateClick,
}: {
  group: GroupedTemplates;
  onTemplateClick: (templateId: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <ApplicationHeader
        application={group.application}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
      />
      {isExpanded && (
        <div className="mt-2 pl-2">
          <h5 className="text-sm font-medium text-gray-700 mb-1 ml-2">
            Funciones disponibles:
          </h5>
          <div className="space-y-2">
            {group.templates.map(template => (
              <TemplateItem
                key={template.id}
                template={template}
                applicationImageUrl={group.application.imageUrl}
                onTemplateClick={onTemplateClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal
export const ApplicationsSidebar = ({ onClose }: { onClose: () => void }) => {
  const { groups, loading, fetchData } = useApplicationsData();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const handleTemplateClick = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
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
                {groups.map(group => (
                  <ApplicationGroup
                    key={group.application.id}
                    group={group}
                    onTemplateClick={handleTemplateClick}
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
        />
      )}
    </div>
  );
};
