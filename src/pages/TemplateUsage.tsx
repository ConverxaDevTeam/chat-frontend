import React from "react";
import { FiGrid } from "react-icons/fi";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { Button } from "@components/common/Button";
import Loading from "@components/Loading";
import { getTemplates } from "@services/template.service";

const useTemplates = () => {
  const [templates, setTemplates] = React.useState<FunctionTemplate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Error loading templates");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, fetchTemplates };
};

const TemplateHeader = () => (
  <div className="flex items-center mb-5">
    <span className="text-gray-800 mr-2">
      <FiGrid size={18} />
    </span>
    <div>
      <div className="text-gray-800 font-medium">
        Available Function Templates
      </div>
      <div className="text-gray-500 text-xs">
        Select a template to use in your workflow
      </div>
    </div>
  </div>
);

const TemplateCard: React.FC<{
  template: FunctionTemplate;
  onUse: () => void;
}> = ({ template, onUse }) => (
  <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
    <h3 className="font-medium text-gray-800 mb-1">{template.name}</h3>
    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
    <Button variant="primary" onClick={onUse} className="w-full py-1 text-sm">
      Use Template
    </Button>
  </div>
);

const TemplateUsage: React.FC = () => {
  const { templates, isLoading } = useTemplates();

  const handleUseTemplate = (template: FunctionTemplate) => {
    // TODO: Implement template usage logic
    toast.success(`Template "${template.name}" selected`);
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <TemplateHeader />

      {isLoading ? (
        <div className="h-64">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => handleUseTemplate(template)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateUsage;
