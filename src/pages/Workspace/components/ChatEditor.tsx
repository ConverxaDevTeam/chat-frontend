import { themeColors } from "@utils/lists";
import { useState } from "react";

const ChatEditor = () => {
  const [theme, setTheme] = useState<number>(0);

  const activeTheme = themeColors.find(color => color.id === theme);
  return (
    <div className="flex gap-[10px]">
      <div className="flex flex-col flex-1 gap-[10px]">
        <div className="flex">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] py-[2px] rounded">
            Tema
          </p>
        </div>
        <div className="flex gap-1 p-[2px] select-none">
          {themeColors.map(color => {
            return (
              <button
                key={color.id}
                type="button"
                className={`w-7 h-7 bg-white rounded-full transition border-[4px] flex justify-center items-center ${
                  theme === color.id
                    ? "border-app-gray"
                    : "border-white cursor-pointer"
                }`}
                title={color.name}
                onClick={() => setTheme(color.id)}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: color.color,
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] py-[2px] rounded">
            Radio
          </p>
        </div>
      </div>
      <div className="h-[460px] w-[300px] bg-slate-300 flex flex-col">
        <div
          className="w-full h-[70px]"
          style={{
            backgroundColor: activeTheme?.color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ChatEditor;
