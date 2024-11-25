import { AppDispatch } from "@store";
import { logOutAsync } from "@store/actions/auth";
import { useDispatch } from "react-redux";

const BlockingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="flex flex-col w-full h-full bg-app-background relative overflow-hidden">
      <div className="w-full h-full absolute bg-[url('demo/more.png')] bg-repeat z-10"></div>
      <div className="h-[66px] w-full flex items-center px-[12px] justify-between z-20">
        <img
          className="h-[40px] select-none"
          src="demo/logo_black.svg"
          alt="logo"
        />
        <div className="flex items-center gap-[20px]">
          <button
            type="button"
            onClick={() => dispatch(logOutAsync())}
            className="text-app-electricGreen rounded-[4px] h-[40px] px-[20px] text-[14px] font-poppinsSemiBold bg-app-dark"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="flex flex-col w-[520px] m-auto z-10 bg-app-white px-[16px] py-[16px] gap-[20px] rounded-lg border-[4px] border-app-dark relative">
        <h2 className="font-poppinsBold text-[24px]  text-app-dark mb-[16spx]">
          Actualmente no tienes organizaciones asignadas
        </h2>
        <p>
          Por favor, contacta a tu administrador para que te asigne una
          organización.
        </p>
      </div>
    </div>
  );
};

export default BlockingPage;
