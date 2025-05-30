import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { Navigate } from "react-router-dom";
import { alertConfirm, alertError } from "@utils/alerts";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import { OrganizationType } from "@interfaces/organization.interface";

enum SetupStep {
  ORGANIZATION = "organization",
  DEPARTMENT = "department",
  COMPLETE = "complete",
}

interface OrganizationFormData {
  name: string;
  description: string;
  logo: File | null;
}

interface DepartmentFormData {
  name: string;
  description: string;
}

const InitialSetup = () => {
  const [currentStep, setCurrentStep] = useState<SetupStep>(
    SetupStep.ORGANIZATION
  );
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [orgFormData, setOrgFormData] = useState<OrganizationFormData>({
    name: "",
    description: "",
    logo: null,
  });

  const [deptFormData, setDeptFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  // Check if user already has organizations
  useEffect(() => {
    dispatch(getMyOrganizationsAsync());
  }, [dispatch]);

  // Verificar si el usuario está autenticado
  const { authenticated } = useSelector((state: RootState) => state.auth);

  // Si el usuario no está autenticado, redirigir al login
  if (!authenticated) {
    return <Navigate to="/" />;
  }

  // Si el usuario es super admin o ya tiene organizaciones, redirigir al dashboard
  if (user?.is_super_admin || (myOrganizations && myOrganizations.length > 0)) {
    return <Navigate to="/dashboard" />;
  }

  const handleOrgInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrgFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeptInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeptFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setOrgFormData(prev => ({ ...prev, logo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOrgFormData(prev => ({ ...prev, logo: null }));
      setPreviewImage(null);
    }
  };

  const createOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", orgFormData.name);
      formData.append("description", orgFormData.description);
      formData.append("type", OrganizationType.FREE);
      formData.append("email", user?.email || "");

      if (orgFormData.logo) {
        formData.append("logo", orgFormData.logo);
      }

      const response = await axiosInstance.post(
        apiUrls.createOrganization(),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.ok) {
        alertConfirm("Organización creada exitosamente");
        setOrganizationId(response.data.organization.id);
        setCurrentStep(SetupStep.DEPARTMENT);
        dispatch(getMyOrganizationsAsync());
      } else {
        alertError(response.data.message || "Error al crear la organización");
      }
    } catch (error) {
      alertError("Error al crear la organización");
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(apiUrls.departments.base(), {
        name: deptFormData.name,
        description: deptFormData.description,
        organizacion_id: organizationId,
      });

      if (response.data.ok) {
        alertConfirm("Departamento creado exitosamente");
        setCurrentStep(SetupStep.COMPLETE);
      } else {
        alertError(response.data.message || "Error al crear el departamento");
      }
    } catch (error) {
      alertError("Error al crear el departamento");
    } finally {
      setLoading(false);
    }
  };

  const renderOrganizationForm = () => (
    <form onSubmit={createOrganization} className="space-y-4">
      <h2 className="text-2xl font-semibold text-sofia-superDark mb-6">
        Crea tu organización
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la organización
        </label>
        <input
          type="text"
          name="name"
          value={orgFormData.name}
          onChange={handleOrgInputChange}
          className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:ring-sofia-electricGreen focus:border-sofia-electricGreen"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          value={orgFormData.description}
          onChange={handleOrgInputChange}
          className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:ring-sofia-electricGreen focus:border-sofia-electricGreen"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sofia-electricGreen file:text-sofia-superDark hover:file:bg-green-400"
          />
          {previewImage && (
            <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-300">
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-sofia-electricGreen text-sofia-superDark font-medium rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sofia-electricGreen disabled:bg-gray-300"
      >
        {loading ? "Creando..." : "Crear organización"}
      </button>
    </form>
  );

  const renderDepartmentForm = () => (
    <form onSubmit={createDepartment} className="space-y-4">
      <h2 className="text-2xl font-semibold text-sofia-superDark mb-6">
        Crea tu departamento
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Nombre del departamento
        </label>
        <input
          type="text"
          name="name"
          value={deptFormData.name}
          onChange={handleDeptInputChange}
          className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:ring-sofia-electricGreen focus:border-sofia-electricGreen"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          value={deptFormData.description}
          onChange={handleDeptInputChange}
          className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:ring-sofia-electricGreen focus:border-sofia-electricGreen"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-sofia-electricGreen text-sofia-superDark font-medium rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sofia-electricGreen disabled:bg-gray-300"
      >
        {loading ? "Creando..." : "Crear departamento"}
      </button>
    </form>
  );

  const renderCompletionMessage = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold text-sofia-superDark">
        ¡Configuración completada!
      </h2>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-lg mb-4">
          Tu cuenta ha sido configurada correctamente.
        </p>
        <p className="mb-4">Tienes disponibles:</p>
        <ul className="list-disc list-inside mb-6 text-left">
          <li className="mb-2">50 mensajes</li>
          <li className="mb-2">15 días para utilizarlos</li>
        </ul>
        <p className="mb-6">
          Si necesitas más mensajes o extender tu período de uso, contáctanos.
        </p>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full py-2 px-4 bg-sofia-electricGreen text-sofia-superDark font-medium rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sofia-electricGreen"
        >
          Contactar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-sofia-background">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {currentStep === SetupStep.ORGANIZATION && renderOrganizationForm()}
          {currentStep === SetupStep.DEPARTMENT && renderDepartmentForm()}
          {currentStep === SetupStep.COMPLETE && renderCompletionMessage()}
        </div>
      </div>

      <p className="mx-auto text-[12px] mb-[38px] font-normal text-center text-sofia-superDark">
        Version 2.0
        <br /> SOF.IA LLM &copy; 2024 Derechos Reservados
      </p>
    </div>
  );
};

export default InitialSetup;
