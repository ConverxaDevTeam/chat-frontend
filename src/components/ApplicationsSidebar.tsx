import { useState, useEffect } from "react";
import { getApplications, getTemplates } from "@services/template.service";
import {
  FunctionTemplate,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";

interface GroupedTemplates {
  application: FunctionTemplateApplication;
  templates: FunctionTemplate[];
}

export const ApplicationsSidebar = ({ onClose }: { onClose: () => void }) => {
  const [groups, setGroups] = useState<GroupedTemplates[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Aplicaciones</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-500">Cargando...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map(group => (
                  <div key={group.application.id} className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {group.application.imageUrl && (
                        <img
                          src={group.application.imageUrl}
                          alt={group.application.name}
                          className="w-10 h-10 rounded"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">
                          {group.application.name}
                        </h4>
                        {group.application.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {group.application.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 space-y-2">
                      {group.templates.map(template => (
                        <div
                          key={template.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          {group.application.imageUrl && (
                            <img
                              src={group.application.imageUrl}
                              alt={template.name}
                              className="w-8 h-8 rounded"
                              onError={e => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <span>{template.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
