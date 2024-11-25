import { AppDispatch, RootState } from "@store";
import { setThemeAction } from "@store/actions/auth";
import { MdLightMode } from "react-icons/md";
import { MdModeNight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const ModeButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex transition-all duration-300 ease-in-out gap-1 bg-web-color1 rounded-full border-[2px] border-web-color4 p-[2px]">
      <div
        className={`flex justify-center items-center rounded-full p-[2px] ${
          theme === "light" ? "bg-web-color3" : "text-web-color4 cursor-pointer"
        }`}
        onClick={() => dispatch(setThemeAction("light"))}
      >
        <MdLightMode className="w-5 h-5" />
      </div>
      <div
        className={`flex justify-center items-center rounded-full p-[2px] ${
          theme !== "light" ? "bg-web-color4" : "text-web-color4 cursor-pointer"
        }`}
        onClick={() => dispatch(setThemeAction("dark"))}
      >
        <MdModeNight className="w-5 h-5" />
      </div>
    </div>
  );
};

export default ModeButton;
