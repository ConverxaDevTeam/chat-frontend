import DeleteButton from "@pages/Workspace/components/DeleteButton";
import EditButton from "@pages/Workspace/components/EditButton";
import {
  createOrganization,
  editOrganization,
  uploadOrganizationLogo,
} from "@services/organizations";
import { useState, useEffect } from "react";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import Loading from "@components/Loading";
import {
  IOrganization,
  OrganizationType,
} from "@interfaces/organization.interface";
import { toast } from "react-toastify";

interface ModalCreateOrganizationProps {
  close: (value: boolean) => void;
  getAllOrganizations: () => Promise<void>;
  organization?: IOrganization | null;
}

interface OrganizationFormData {
  name: string;
  description: string;
  email: string;
  logoFile: File | null;
  owner_id?: number;
  type: OrganizationType;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface CreateOrganizationData {
  name: string;
  description: string;
  logo: File | null;
  email: string;
  type: OrganizationType;
}

const LogoUpload = ({
  logoUrl,
  handleImageUpload,
  handleDeleteLogo,
  errors,
}: {
  logoUrl: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteLogo: () => void;
  errors: FieldErrors<OrganizationFormData>;
}) => (
  <div className="flex flex-col mb-6">
    <label className="text-gray-700 font-semibold mb-2">
      Imagen de organización
    </label>
    <div className="relative w-20 h-20">
      <img
        src={logoUrl}
        alt="Organization logo"
        className="w-full h-full rounded-full object-cover"
      />
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        className="hidden"
        id="imageUpload"
        onChange={handleImageUpload}
      />
      <div className="absolute top-14 left-14 flex">
        <button
          type="button"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          <EditButton />
        </button>
        <button onClick={handleDeleteLogo}>
          <DeleteButton />
        </button>
      </div>
    </div>
    <p className="text-gray-400 text-xs mt-1">
      Formatos admitidos: png, jpg, jpeg.
    </p>
    {errors.logoFile && (
      <span className="text-red-400 text-sm">Imagen es requerida</span>
    )}
  </div>
);

const FormInputs = ({
  isEditMode,
  register,
  getUserOptions,
  errors,
  description,
}: {
  isEditMode: boolean;
  register: UseFormRegister<OrganizationFormData>;
  getUserOptions: () => JSX.Element[];
  errors: FieldErrors<OrganizationFormData>;
  description: string;
}) => (
  <div>
    <div className="mb-4">
      <label className="text-gray-700 font-semibold" htmlFor="name">
        Nombre
      </label>
      <input
        className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
        id="name"
        type="text"
        placeholder="Nombre"
        {...register("name", { 
          required: "Nombre es requerido",
          minLength: {
            value: 4,
            message: "El nombre debe tener al menos 4 caracteres"
          },
          maxLength: {
            value: 20,
            message: "El nombre no debe exceder los 20 caracteres"
          }
        })}
      />
      {errors.name && (
        <span className="text-red-400 text-sm ml-1">{errors.name.message}</span>
      )}
    </div>
    <div className="mb-4">
      <label className="text-gray-700 font-semibold mb-3" htmlFor="description">
        Descripción
      </label>
      <textarea
        className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px] min-h-[120px] resize-y"
        id="description"
        placeholder="Descripción"
        {...register("description", { required: "Descripción es requerida" })}
        maxLength={255}
      />
      <p className="text-gray-400 text-xs mt-1 ml-1">
        {description.length}/255 caracteres
      </p>
      {errors.description && (
        <span className="text-red-400 text-sm ml-1">{errors.description.message}</span>
      )}
    </div>
    <div className="mb-4">
      <label className="text-gray-700 font-semibold" htmlFor="type">
        Tipo
      </label>
      <select
        className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
        id="type"
        {...register("type", { required: "Tipo es requerido" })}
      >
        <option value={OrganizationType.MVP}>MVP</option>
        <option value={OrganizationType.PRODUCTION}>Producción</option>
      </select>
      {errors.type && (
        <span className="text-red-400 text-sm ml-1">{errors.type.message}</span>
      )}
    </div>
    {!isEditMode && (
      <div className="mb-4">
        <label className="text-gray-700 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
          id="email"
          type="email"
          placeholder="Email"
          {...register("email", { 
            required: "Email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          })}
        />
        {errors.email && (
          <span className="text-red-400 text-sm ml-1">{errors.email.message}</span>
        )}
      </div>
    )}
    {isEditMode && (
      <div className="mb-4">
        <label className="text-gray-700 font-semibold mb-3" htmlFor="owner_id">
          Propietario 
        </label>
        <select
          className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
          id="owner_id"
          {...register("owner_id")}
        >
          {getUserOptions()}
        </select>
      </div>
    )}
  </div>
);

const FormActions = ({
  close,
  isEditMode,
}: {
  close: (value: boolean) => void;
  isEditMode: boolean;
}) => (
  <div className="flex justify-center gap-4 mt-10">
    <button
      type="button"
      onClick={() => close(false)}
      className="w-full px-3 py-1 text-gray-500 border-2 rounded-md text-sm font-semibold"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="w-full px-3 py-3 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
    >
      <span className="hidden sm:block">
        {isEditMode ? "Editar organización" : "Crear organización"}
      </span>
    </button>
  </div>
);

const useLogoUpload = (
  organization: IOrganization | null | undefined,
  setValue: (name: "logoFile", value: File | null) => void,
  clearErrors: (name: "logoFile") => void,
  isEditMode: boolean
) => {
  const [logoUrl, setLogoUrl] = useState<string>("/mvp/avatar.svg");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (organization?.logo) {
      setLogoUrl(organization.logo);
    } else {
      setLogoUrl("/mvp/avatar.svg");
    }
  }, [organization?.logo]);

  useEffect(() => {
    if (logoFile instanceof File) {
      const url = URL.createObjectURL(logoFile);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl(organization?.logo || "/mvp/avatar.svg");
    }
  }, [organization?.logo, logoFile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEditMode && organization) {
        try {
          await uploadOrganizationLogo(organization.id, file);
          toast.success("Logo actualizado exitosamente");
        } catch (error) {
          toast.error("Error al actualizar el logo");
        }
      }
      setLogoFile(file);
      setValue("logoFile", file);
      clearErrors("logoFile");
    }
  };

  const handleDeleteLogo = async () => {
    if (isEditMode && organization) {
      try {
        await uploadOrganizationLogo(organization.id, null as unknown as File);
        toast.success("Logo eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el logo");
      }
    }
    setLogoFile(null);
    setValue("logoFile", null);
  };

  return { logoUrl, logoFile, handleImageUpload, handleDeleteLogo };
};
const useUsers = (organization: IOrganization | null | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const getUsers = async () => {
    if (!organization) return;
    setLoadingUsers(true);
    try {
      const response = await getUserMyOrganization(organization.id);
      if (response) {
        setUsers(response);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (organization) {
      getUsers();
    }
  }, [organization?.id]);

  const getUserOptions = (): JSX.Element[] => {
    if (loadingUsers) {
      return [<option key="loading">Cargando usuarios...</option>];
    }

    const options = users.map(user => (
      <option key={user.id} value={user.id}>
        {user.first_name || user.last_name
          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
          : user.email}
      </option>
    ));

    if (
      organization?.owner &&
      !users.find(u => u.id === organization.owner?.user.id)
    ) {
      options.unshift(
        <option key="current-owner" value={organization.owner.user.id} disabled>
          {organization.owner.user.first_name}{" "}
          {organization.owner.user.last_name}
        </option>
      );
    }

    return options;
  };

  return { loadingUsers, getUserOptions };
};


const ModalCreateOrganization = ({
  close,
  getAllOrganizations,
  organization,
}: ModalCreateOrganizationProps) => {
  const isEditMode = !!organization;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch,
    clearErrors
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      email: organization?.owner?.user.email || "",
      type: organization?.type || OrganizationType.MVP,
      owner_id: organization?.owner?.user.id || 0,
      logoFile: null
    },
    mode: "onSubmit"
  });

  useEffect(() => {
    if (!isEditMode) {
      register("logoFile", { 
        required: "Imagen es requerida" 
      });
    }
  }, [register, isEditMode]);

  const { loadingUsers, getUserOptions } = useUsers(organization);
  const description = watch("description") || "";
  
  const { logoUrl, logoFile, handleImageUpload, handleDeleteLogo } = useLogoUpload(
    organization,
    setValue,
    clearErrors,
    isEditMode
  );

  const onSubmit = async (formData: OrganizationFormData) => {
    try {
      if (isEditMode) {
        const editData = {
          owner_id: Number(formData.owner_id),
          name: formData.name,
          description: formData.description,
          type: formData.type,
        };
        await editOrganization(organization.id, editData);
        await getAllOrganizations();
        toast.success("Organización actualizada exitosamente");
        close(false);
      } else {
        const createData: CreateOrganizationData = {
          name: formData.name,
          description: formData.description,
          logo: logoFile,
          email: formData.email,
          type: formData.type,
        };
        const response = await createOrganization(createData);
        if (response) {
          await getAllOrganizations();
          toast.success("Organización creada exitosamente");
          close(false);
        }
      }
    } catch (error) {
      toast.error("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl p-2 w-[550px]"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Editar organización" : "Crear organización"}
      </h2>
      <hr className="mb-6 border-gray-300" />
      <LogoUpload
        logoUrl={logoUrl}
        handleImageUpload={handleImageUpload}
        handleDeleteLogo={handleDeleteLogo}
        errors={errors}
      />
      <FormInputs
        isEditMode={isEditMode}
        register={register}
        getUserOptions={getUserOptions}
        errors={errors}
        description={description}
      />
      <FormActions close={close} isEditMode={isEditMode} />
      {loadingUsers && <Loading />}
    </form>
  );
};

export default ModalCreateOrganization;
