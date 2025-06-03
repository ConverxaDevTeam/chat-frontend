import { addUserInOrganizationById } from "@services/user";
import { RootState } from "@store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IUserApi } from ".";

interface ModalAddUserProps {
  close: (value: boolean) => void;
  getAllUsers: () => void;
  editUser?: IUserApi | null;
  users?: IUserApi[];
}

const ModalAddUser = ({
  close,
  getAllUsers,
  editUser,
  users = [],
}: ModalAddUserProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [data, setData] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectOrganizationId) return;

    const emailExists = users.some(
      user => user.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      toast.error("Ya existe un usuario con este correo electrónico", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      let response;
      if (editUser) {
        response = true;
        toast.success("Usuario actualizado exitosamente", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        response = await addUserInOrganizationById(selectOrganizationId, data);
        if (response) {
          toast.success("Usuario agregado exitosamente", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      }
      if (response) {
        getAllUsers();
        close(false);
      }
    } catch (error) {
      toast.error(
        editUser
          ? "No se pudo actualizar el usuario. Por favor, intente nuevamente."
          : "No se pudo agregar el usuario. Por favor, intente nuevamente.",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && close(false)}
    >
      <div className="bg-white rounded-[4px] p-6 w-full max-w-md relative">
        <button
          type="button"
          onClick={() => close(false)}
          className="absolute top-7 right-7 text-gray-900 hover:text-gray-600 font-semibold"
        >
          <img src="/mvp/vector-x.svg" alt="Cerrar" />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {editUser ? "Editar usuario" : "Agregar usuario"}
        </h2>
        <hr className="border-t border-gray-300 mb-4 -mx-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="w-full p-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-1"
              id="email"
              type="email"
              name="email"
              value={data.email}
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-full p-4 mt-5 bg-[#001130] text-white rounded-[4px] text-base font-semibold transition-all leading-none"
            >
              {editUser ? "Actualizar" : "Agregar usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddUser;
