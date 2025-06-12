import { addUserInOrganizationById, changeUserPassword } from "@services/user";
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
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectOrganizationId) return;

    try {
      let response;
      if (editUser) {
        if (!data.password || data.password.length < 6) {
          toast.error("La contraseña debe tener al menos 6 caracteres", {
            position: "bottom-right",
            autoClose: 3000,
          });
          return;
        }
        response = await changeUserPassword(editUser.id, data.password);
        if (response) {
          toast.success("Contraseña actualizada exitosamente", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } else {
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
          ? "No se pudo actualizar la contraseña. Por favor, intente nuevamente."
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
          {editUser ? (
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="password"
              >
                Nueva contraseña
              </label>
              <input
                className="w-full p-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-1"
                id="password"
                type="password"
                name="password"
                value={data.password}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                onChange={handleChange}
              />
            </div>
          ) : (
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
          )}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-full p-4 mt-5 bg-[#001130] text-white rounded-[4px] text-base font-semibold transition-all leading-none"
            >
              {editUser ? "Cambiar contraseña" : "Agregar usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddUser;
