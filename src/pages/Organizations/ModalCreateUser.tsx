import DeleteButton from "@pages/Workspace/components/DeleteButton";
import EditButton from "@pages/Workspace/components/EditButton";
import {
  createOrganization,
  editOrganization,
  uploadOrganizationLogo,
} from "@services/organizations";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import Loading from "@components/Loading";
import { IOrganization } from "@interfaces/organization.interface";

interface ModalCreateOrganizationProps {
  close: (value: boolean) => void;
  getAllOrganizations: () => void;
  organization?: IOrganization | null;
}

interface OrganizationFormData {
  name: string;
  description: string;
  email: string;
  logoFile: File | null;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface CreateOrganizationData {
  name: string;
  description: string;
  email: string;
  logo: File | null;
}

const ModalCreateOrganization = ({
  close,
  getAllOrganizations,
  organization,
}: ModalCreateOrganizationProps) => {
  const isEditMode = !!organization;
  const { register, handleSubmit } = useForm<{ owner_id: number }>();
  const [data, setData] = useState<OrganizationFormData>({
    name: organization?.name || "",
    description: organization?.description || "",
    email: organization?.owner?.user.email || "",
    logoFile: organization?.logo || null,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/mvp/avatar.svg");

  useEffect(() => {
    if (organization?.logo) {
      setLogoUrl(organization.logo);
    } else {
      setLogoUrl("/mvp/avatar.svg");
    }
  }, [organization?.logo]);

  useEffect(() => {
    if (data.logoFile instanceof File) {
      const url = URL.createObjectURL(data.logoFile);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl("/mvp/avatar.svg");
    }
  }, [data.logoFile]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEditMode) {
        await uploadOrganizationLogo(organization.id, file);
      }
      setData({ ...data, logoFile: file });
    }
  };

  const handleDeleteLogo = async () => {
    if (isEditMode) {
      await uploadOrganizationLogo(organization.id, null as unknown as File);
    }
    setData({ ...data, logoFile: null });
  };

  const handleEditOwner = async (data: { owner_id: number }) => {
    if (!organization) return;
    await editOrganization(organization.id, data);
    getAllOrganizations();
    close(false);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode) {
      return handleSubmit(handleEditOwner)(e);
    }
    const createData: CreateOrganizationData = {
      name: data.name,
      description: data.description,
      logo: data.logoFile,
      email: data.email,
    };
    const response = await createOrganization(createData);
    if (response) {
      getAllOrganizations();
      close(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      getUsers();
    }
  }, [isEditMode]);

  const getUserOptions = () => {
    const options = users.map(user => (
      <option key={user.id} value={user.id}>
        {user.first_name} {user.last_name}
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

  return (
    <form
      onSubmit={handleSubmitForm}
      className="bg-white rounded-xl p-2 w-[550px]"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Editar organización" : "Crear organización"}
      </h2>
      <hr className="mb-6 border-gray-300" />
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
      </div>
      <div>
        <div className="mb-4">
          <label className="text-gray-700 font-semibold" htmlFor="name">
            Nombre
          </label>
          <input
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
            id="name"
            type="text"
            name="name"
            placeholder="Nombre"
            value={data.name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="text-gray-700 font-semibold mb-3"
            htmlFor="description"
          >
            Descripción
          </label>
          <input
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
            id="description"
            type="text"
            name="description"
            placeholder="Descripción"
            value={data.description}
            required
            onChange={handleChange}
            maxLength={255}
          />
          <p className="text-gray-400 text-xs mt-1">
            {data.description.length}/255 caracteres
          </p>
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
              name="email"
              placeholder="Email"
              value={data.email}
              required
              onChange={handleChange}
            />
          </div>
        )}
        {isEditMode && (
          <div className="mb-4">
            <label
              className="text-gray-700 font-semibold mb-3"
              htmlFor="owner_id"
            >
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
      {loadingUsers && <Loading />}
    </form>
  );
};

export default ModalCreateOrganization;
