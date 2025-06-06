import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { Navigate } from "react-router-dom";
import { alertConfirm, alertError } from "@utils/alerts";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import { OrganizationType } from "@interfaces/organization.interface";
import EditButton from "@pages/Workspace/components/EditButton";
import DeleteButton from "@pages/Workspace/components/DeleteButton";

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
    <form onSubmit={createOrganization} className="space-y-5">
      <h2 className="text-xl font-semibold text-sofia-superDark ">
        Crea tu organización
      </h2>
      <hr className="border-t border-sofia-darkBlue mb-4 -mx-6" style={{ width: "calc(100% + 3rem)" }} />
      <div className="space-y-2">
        <label className="block text-sm font-semibold leading-4 text-gray-700">Imagen para tu organización</label>
        <div className="relative h-16 w-16 mb-2">
          <img
            src={previewImage || "/mvp/avatar.svg"}
            alt="avatar"
            className="h-full w-full object-cover rounded-full"
          />
          <div className="absolute -bottom-2 left-10 flex z-10">
            <button
              type="button"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className="rounded-lg flex items-center justify-center"
              style={{ width: 28, height: 28 }}
            >
              <EditButton />
            </button>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="rounded-lg flex items-center justify-center"
              style={{ width: 28, height: 28 }}
            >
              <DeleteButton />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
          />
        </div>
        <span className="text-[12px] font-normal text-app-newGray mt-3">Formatos admitidos: png, jpg, jpeg.</span>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la organización"
          value={orgFormData.name}
          onChange={handleOrgInputChange}
          className="bg-[#FCFCFC] w-full rounded-[4px] py-3 px-3 border border-sofia-darkBlue text-[14px] font-normal"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          placeholder="Descripción de la organización"
          value={orgFormData.description}
          onChange={handleOrgInputChange}
          className="bg-[#FCFCFC] w-full rounded-[4px] py-3 px-3 border border-sofia-darkBlue text-[14px] font-normal"
          rows={3}
          required
        />
      </div>

      <div className="flex flex-row gap-3 mt-2">
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="w-1/2 py-3 px-4 border border-sofia-superDark text-sofia-superDark text-[14px] font-medium rounded-[4px] bg-white"
        >
          Volver al login
        </button>
        <button
          type="submit"
          className="w-1/2 py-3 px-4 bg-sofia-electricGreen text-sofia-superDark text-[14px] font-semibold rounded-[4px]"
        >
        {loading ? "Creando..." : "Crear organización"}
        </button>
      </div>
    </form>
  );

  const renderDepartmentForm = () => (
    <form onSubmit={createDepartment} className="space-y-5">
      <h2 className="text-xl font-semibold text-sofia-superDark">
        Crea tu departamento
      </h2>
      <hr className="border-t border-sofia-darkBlue mb-4 -mx-6" style={{ width: 'calc(100% + 3rem)' }} />
      <div className="flex flex-col">
        <label className="text-[14px] font-medium text-[#414651] mb-[6px]" htmlFor="name">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Nombre del departamento"
          value={deptFormData.name}
          onChange={handleDeptInputChange}
          className="bg-[#FCFCFC] w-full rounded-[4px] py-3 px-3 border border-sofia-darkBlue text-[14px] font-normal"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[14px] font-medium text-[#414651] mb-[6px]" htmlFor="description">
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Descripción del departamento"
          value={deptFormData.description}
          onChange={handleDeptInputChange}
          className="bg-[#FCFCFC] w-full rounded-[4px] py-3 px-3 border border-sofia-darkBlue text-[14px] font-normal resize-none"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-sofia-electricGreen text-sofia-superDark text-[14px] font-semibold rounded-[4px]"
      >
        {loading ? "Creando..." : "Crear departamento"}
      </button>
    </form>
  );

  const renderCompletionMessage = () => (
    <div className="flex flex-col items-center justify-center min-h-[350px]">
      <h2 className="font-semibold text-[24px] text-sofia-superDark mb-2 text-center">
        Configuración completada
      </h2>
      <div className="p-6 bg-white w-full max-w-md rounded-[4px] border border-app-lightGray mt-2">
        <p className="text-[14px] font-normal text-[#414651] mb-4 text-center">
          Tu cuenta ha sido configurada correctamente.
        </p>
        <p className="text-[14px] font-normal text-[#414651] mb-4 text-center">Tienes disponibles:</p>
        <ul className="list-disc list-inside mb-6 text-left text-[14px] font-normal text-[#414651] pl-4">
          <li className="mb-2">50 mensajes</li>
          <li className="mb-2">15 días para utilizarlos</li>
        </ul>
        <p className="text-[14px] font-normal text-[#414651] mb-6 text-center">
          Si necesitas más mensajes o extender tu período de uso, contáctanos.
        </p>
        <button
          className="w-full py-3 px-4 bg-sofia-electricGreen text-sofia-superDark text-[14px] font-semibold rounded-[4px]"
          onClick={() => window.location.href = "/dashboard"}
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-sofia-background">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[4px] border border-app-lightGray p-[24px]">
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
