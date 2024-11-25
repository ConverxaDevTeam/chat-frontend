import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { RootState } from "@store";
import {
  IconLeftArrow,
  // IconMessage,
  // IconNotification,
  IconSearch,
} from "@utils/svgs";
import { useSelector } from "react-redux";
import UpdateUser from "./UpdateUser";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getInitials } from "@utils/format";
import pageLinks from "./pageLinks";

const Search = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [ModalEditProfile, setModalEditProfile] = useState<boolean>(false);
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <>
      <Modal
        onClose={() => setModalEditProfile(false)}
        isShown={ModalEditProfile}>
          <UpdateUser setModalVisible={setModalEditProfile} />
      </Modal>
      <div className="flex pt-[16px] md:pt-[30px] pb-[24px] flex-col justify-between">
        <div className="flex flex-col-reverse lg:flex-row gap-[10px] lg:gap-0 justify-between items-center w-full">
          <div className="text-sofiaCall-dark flex items-center gap-[16px] 2xl:gap-[32px] w-full lg:w-auto">
            <IconLeftArrow
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer hidden lg:block"
            />
            <p
              onClick={() => navigate("/dashboard")}
              className="text-[20px] 2xl:text-[28px] font-poppinsMedium leading-[42px] cursor-pointer hidden lg:block"
            >
              Dashboard
            </p>
            <div className="w-full lg:w-[320px] xl:w-[420px] 2xl:w-[480px] h-[56px] relative flex items-center">
              <input
                type="text"
                placeholder="Búsqueda"
                className="w-full h-full rounded-full px-[15px] pl-[36px] bg-sofiaCall-searchInput font-poppinsRegular leading-[24px] pr-[50px]"
              />
              <IconSearch className="absolute text-sofiaCall-searchIcon right-[14px] cursor-pointer" />
            </div>
          </div>

          <div className="flex items-center w-full lg:w-auto">
            <div className="items-center mr-auto gap-[16px] flex lg:hidden">
              <IconLeftArrow
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer"
              />
              <p
                onClick={() => navigate("/dashboard/call")}
                className="text-[28px] font-poppinsMedium leading-[42px] cursor-pointer"
              >
                Call IA
              </p>
            </div>
            {/* <div className="bg-sofiaCall-white rounded-full relative mr-[24px] 2xl:mr-[36px] cursor-pointer">
              <IconMessage className="text-sofiaCall-dark p-[12px] 2xl:p-[14px] w-[48px] h-[48px] 2xl:w-[56px] 2xl:h-[56px]" />
              <div className="absolute bg-[#212121] w-[20px] 2xl:w-[26px] h-[20px] 2xl:h-[26px] rounded-full flex justify-center items-center shadow-[0px_4px_12px_rgba(21,236,218,0.5)] -top-[6px] 2xl:-top-[9px] -right-[5px]">
                <p className="text-sofiaCall-white text-[12px] 2xl:text-[14px] leading-[21px] font-poppinsMedium">
                  18
                </p>
              </div>
            </div>
            <div className="bg-sofiaCall-white rounded-full relative mr-[24px] 2xl:mr-[36px] cursor-pointer">
              <IconNotification className="text-sofiaCall-dark p-[12px] 2xl:p-[14px] w-[48px] h-[48px] 2xl:w-[56px] 2xl:h-[56px]" />
              <div className="absolute bg-[#212121] w-[20px] 2xl:w-[26px] h-[20px] 2xl:h-[26px] rounded-full flex justify-center items-center shadow-[0px_4px_12px_rgba(21,236,218,0.5)] -top-[6px] 2xl:-top-[9px] -right-[5px]">
                <p className="text-sofiaCall-white text-[12px] 2xl:text-[14px] leading-[21px] font-poppinsMedium">
                  52
                </p>
              </div>
            </div> */}
            <p className="font-poppinsRegular text-[20px] w-[270px] mr-[40px]">
              Saldo Disponible:{" "}
              <span className="font-poppinsSemiBold text-[24px]">{`$${((user?.balance || 0) / 1000000).toFixed(2)}`}</span>
            </p>
            <Link
              to="/balance"
              className="bg-sofiaCall-electricGreen mr-[40px] text-[14px] font-poppinsSemiBold text-sofiaCall-dark rounded-full h-[53px] w-[141px] flex justify-center items-center cursor-pointer"
            >
              Recargar saldo
            </Link>
            <div className="flex gap-2 items-center text-sofiaCall-white">
              {user && user.avatar ? (
                <img
                  className="object-cover select-none rounded-full cursor-pointer h-[48px] w-[48px]"
                  onClick={() => setModalEditProfile(true)}
                  src={apiUrls.getImgAvatar(user.avatar)}
                  alt="Profile"
                />
              ) : (
                <div
                  onClick={() => setModalEditProfile(true)}
                  className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[48px] h-[48px] rounded-full bg-sofiaCall-light cursor-pointer"
                >
                  <p className="text-sofiaCall-dark font-poppinsSemiBold text-[18px]">
                    {user && user.first_name
                      ? getInitials(`${user.first_name} ${user.last_name}`)
                      : "N/A"}
                  </p>
                </div>
              )}
              <div className="hidden md:flex lg:hidden xl:flex flex-col">
                <div className="flex text-sofiaCall-dark">
                  {!user?.first_name && !user?.last_name ? (
                    <p className="font-poppinsMedium text-[16px] leading-[24px]">
                      N/A
                    </p>
                  ) : (
                    <>
                      <p className="font-poppinsMedium text-[16px] leading-[24px]">
                        {user?.first_name && user?.first_name.split(" ")[0]}{" "}
                        {user?.last_name && user?.last_name.split(" ")[0]}
                      </p>
                    </>
                  )}
                </div>
                <p className="text-[12px] text-[#8F8F8F] font-poppinsRegular leading-[18px]">
                  {user?.email || "email"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sofiaCall-dark text-[16px] font-poppinsSemiBold mt-[16px] md:mt-[29px]">
          {pageLinks.find(page => page.active.includes(currentPath))?.text}
        </p>
      </div>
    </>
  );
};

export default Search;
