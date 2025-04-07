import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { Button } from "@components/common/Button";
import FunctionTemplateModal from "@components/FunctionTemplate/FunctionTemplateModal";
import { createTemplate, getTemplates } from "@services/template.service";

const TemplatesPage = () => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [templates, setTemplates] = useState<FunctionTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    FunctionTemplate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!selectOrganizationId) return;

    try {
      setIsLoading(true);
      const data = await getTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      toast.error("Error al cargar templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectOrganizationId) {
      fetchTemplates();
    }
  }, [selectOrganizationId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(
        template =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          template.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredTemplates(filtered);
    }
  }, [searchTerm, templates]);

  const handleCreateTemplate = async (template: FunctionTemplate) => {
    try {
      await createTemplate({
        ...template,
        organizationId: selectOrganizationId || 0,
      });
      toast.success("Template creado correctamente");
      fetchTemplates();
      setShowModal(false);
    } catch (error) {
      toast.error("Error al crear el template");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Templates</h1>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus size={16} />
          <span>Nuevo Template</span>
        </Button>
      </div>

      <div className="flex items-center mb-6 gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <Input
            placeholder="Buscar templates..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <FiFilter size={16} />
          <span>Filtros</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Cargando templates...</span>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No hay templates disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            Crea tu primer template para comenzar a configurar funciones
            rápidamente.
          </p>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="mx-auto"
          >
            Crear Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      )}

      <FunctionTemplateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTemplate}
      />
    </div>
  );
};

export default TemplatesPage;
