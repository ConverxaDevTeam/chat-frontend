import { addUserInOrganizationById } from "@services/user";
import { RootState } from "@store";
import { useState } from "react";
import { useSelector } from "react-redux";

interface ModalAddUserProps {
  close: (value: boolean) => void;
  getAllUsers: () => void;
}

const ModalAddUser = ({ close, getAllUsers }: ModalAddUserProps) => {
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
    const response = await addUserInOrganizationById(
      selectOrganizationId,
      data
    );
    if (response) {
      getAllUsers();
      close(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-sofiaCall-white flex-col rounded-[24px] pt-[36px] pl-[29px] pr-[44px] pb-[52px] w-full"
    >
      <p className="text-[24px] font-poppinsSemiBold text-sofiaCall-dark">
        Agregar Usuario
      </p>

      <div className="grid grid-cols-2 gap-[30px] mt-[27px]">
        <div className="h-[109px] flex flex-col justify-between">
          <label
            className="text-[#515151] font-poppinsMedium text-[16px]"
            htmlFor="email"
          >
            Correo electrónico
          </label>
          <input
            className="w-full border-b-[1px] pt-[10px] pb-[19px] border-sofiaCall-gray text-sofiaCall-dark font-poppinsMedium text-[18px]"
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
      <div className="flex gap-[16px] justify-end mt-[56px]">
        <button
          type="button"
          onClick={() => close(false)}
          className="w-[149px] h-[57px] rounded-full border-[1px] border-[#F4F4F4] bg-[#F4F4F4]"
        >
          <p className="font-poppinsSemiBold text-[18px] text-[#9F9F9F]">
            Cancelar
          </p>
        </button>
        <button
          type="submit"
          className="w-[217px] h-[57px] rounded-full bg-sofiaCall-dark border-[1px] border-sofiaCall-dark"
        >
          <p className="font-poppinsSemiBold text-[18px] text-app-dark">
            Agregar
          </p>
        </button>
      </div>
    </form>
  );
};

export default ModalAddUser;
