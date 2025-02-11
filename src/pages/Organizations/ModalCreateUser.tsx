import { createOrganization } from "@services/organizations";
import { useState } from "react";

interface ModalCreateOrganizationProps {
  close: (value: boolean) => void;
  getAllOrganizations: () => void;
}

const ModalCreateOrganization = ({
  close,
  getAllOrganizations,
}: ModalCreateOrganizationProps) => {
  const [data, setData] = useState({
    name: "",
    description: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createOrganization(data);
    if (response) {
      getAllOrganizations();
      close(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-2 w-[550px]"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear organización</h2>
      <hr className="mb-6 border-gray-300" />
      <div className="flex flex-col mb-6">
        <label className="text-gray-700 font-semibold mb-2">Imagen de organización</label>
        <div className="relative w-20 h-20 flex items-center justify-center bg-yellow-400 rounded-full text-white font-bold text-lg uppercase">
        </div>
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          className="hidden"
        />
        <label htmlFor="imageUpload" className="mt-3 text-sm text-blue-600 cursor-pointer">
          Subir imagen
        </label>
        <p className="text-gray-400 text-xs mt-1">Formatos admitidos: png, jpg, jpeg.</p>
      </div>
      <div>
        <div className="mb-4">
          <label
            className="text-gray-700 font-semibold"
            htmlFor="name"
          >
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
        <div className="mb-4">
          <label
            className="text-gray-700 font-semibold mb-2"
            htmlFor="email"
          >
            Correo electrónico
          </label>
          <input
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none text-[15px]"
            id="email"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={data.email}
            required
            onChange={handleChange}
          />
        </div>
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
          <span className="hidden sm:block">Crear organización</span>
        </button>
      </div>
    </form>
  );
};

export default ModalCreateOrganization;
