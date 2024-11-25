import { useEffect, useState } from "react";
import { getUserAsync, putUserAsync } from "../../../store/actions/auth";
import { uploadAvatar } from "../../../store/services/user";
import { apiUrls } from "../../../config/config";
import ListSession from "./ListSession";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getInitials } from "@utils/format";
import { IconBackup } from "@utils/svgs";

const UpdateUser = ({
  setModalVisible,
}: {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<{
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
  }>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    avatar: user?.avatar || "",
    email: user?.email || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateAvatar = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "nextjs");

      const result = await uploadAvatar(formData);
      if (result) {
        dispatch(getUserAsync());
      }
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActive(true);
    dispatch(putUserAsync({ data, setActive, setError, dispatch }));
  };

  useEffect(() => {
    setData({
      ...data,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      avatar: user?.avatar || "",
      email: user?.email || "",
    });
  }, [user?.avatar]);

  return (
    <form
      className="flex bg-sofiaCall-white flex-col rounded-[24px] pt-[36px] pl-[29px] pr-[44px] pb-[52px] w-[760px]"
      onSubmit={handleSubmit}
    >
      <p className="text-[24px] font-poppinsSemiBold text-sofiaCall-dark">
        Editar perfil
      </p>
      <div className="grid grid-cols-2 gap-[30px] mt-[27px]">
        <div className="flex items-end gap-[11px] h-[109px]">
          <div className="w-[100px] h-[100px]">
            {data.avatar ? (
              <img
                src={apiUrls.getImgAvatar(data.avatar)}
                className="w-full h-full object-cover rounded-full"
                alt="avatar"
              />
            ) : (
              <div className="w-full h-full object-cover rounded-full bg-sofiaCall-light border-[1px] border-sofiaCall-electricGreen flex justify-center items-center">
                <p className="text-sofiaCall-dark font-poppinsSemiBold text-[36px]">
                  {data.first_name
                    ? getInitials(`${data.first_name} ${data.last_name}`)
                    : "N/A"}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[7px]">
            <button
              type="button"
              onClick={handleUpdateAvatar}
              className="bg-sofiaCall-lightGray rounded-[8px] border-0 flex gap-[6px] justify-center items-center w-[122px] h-[28px] text-sofiaCall-dark"
            >
              <IconBackup />
              <p className="font-poppinsRegular text-[10px]">
                Subir fotografía
              </p>
            </button>
            <p className="font-poppinsRegular text-[10px] text-sofiaCall-gray">
              Formatos admitidos: png, jpg, jpeg.
            </p>
          </div>
        </div>

        <div className="h-[109px] flex flex-col justify-between">
          <label
            className="text-[#515151] font-poppinsMedium text-[16px]"
            htmlFor="first_name"
          >
            Nombre
          </label>
          <input
            className="w-full border-b-[1px] pt-[10px] pb-[19px] border-sofiaCall-gray text-sofiaCall-dark font-poppinsMedium text-[18px]"
            id="first_name"
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={data.first_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="h-[109px] flex flex-col justify-between">
          <label
            className="text-[#515151] font-poppinsMedium text-[16px]"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <input
            className="w-full border-b-[1px] pt-[10px] pb-[19px] border-sofiaCall-gray text-sofiaCall-dark font-poppinsMedium text-[18px]"
            id="last_name"
            type="text"
            name="last_name"
            placeholder="Last name"
            value={data.last_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="h-[109px] flex flex-col justify-between">
          <label className="text-[#515151] font-poppinsMedium text-[16px]">
            Correo electrónico
          </label>
          <p className="w-full border-b-[1px] pt-[10px] pb-[19px] border-sofiaCall-gray text-sofiaCall-dark font-poppinsMedium text-[18px]">
            {data.email}
          </p>
        </div>
      </div>
      <div className="flex gap-[16px] justify-end my-[30px]">
        <button
          type="button"
          onClick={() => setModalVisible(false)}
          className="w-[149px] h-[57px] rounded-full border-[1px] border-[#F4F4F4] bg-[#F4F4F4]"
        >
          <p className="font-poppinsSemiBold text-[18px] text-[#9F9F9F]">
            Cancelar
          </p>
        </button>
        <button
          type="submit"
          disabled={active}
          className="w-[217px] h-[57px] rounded-full bg-sofiaCall-dark border-[1px] border-sofiaCall-dark"
        >
          <p className="font-poppinsSemiBold text-[18px] text-[#FFFDFD]">
            Guardar
          </p>
        </button>
      </div>
      {error && (
        <p className="text-[12px] font-poppinsRegular text-sofiaCall-red mt-[20px]">
          {error}
        </p>
      )}
      <ListSession />
    </form>
  );
};

export default UpdateUser;
