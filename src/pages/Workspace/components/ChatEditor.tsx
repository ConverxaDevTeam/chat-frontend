import { chatExample, themeColors } from "@utils/lists";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MessageSofia from "./MessageSofia";
import MessageUser from "./MessageUser";
import { urlFiles } from "@config/config";
import { Integracion } from "./CustomizeChat";
import { MdOutlineFormatColorFill } from "react-icons/md";
import { SketchPicker } from "react-color";

interface ChatEditorProps {
  integration: Integracion;
}

const ChatEditor = ({ integration }: ChatEditorProps) => {
  const [themeId, setThemeId] = useState<number>(0);
  const [edgeRadius, setEdgeRadius] = useState<number>(8);
  const [bgColor, setBgColor] = useState<string>(themeColors[0].bgColor);
  const [bgChat, setBgChat] = useState<string>(themeColors[0].bgChat);
  const [bgUser, setBgUser] = useState<string>(themeColors[0].bgUser);
  const [bgAssistant, setBgAssistant] = useState<string>(
    themeColors[0].bgAssistant
  );
  const [textColor, setTextColor] = useState<string>(themeColors[0].textColor);
  const [textDate, setTextDate] = useState<string>(themeColors[0].textDate);
  const [buttonColor, setButtonColor] = useState<string>(
    themeColors[0].buttonColor
  );
  const [modalActive, setModalActive] = useState<string | null>(null);

  const handleSliderChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setEdgeRadius(newValue);
    }
  };

  return (
    <div className="flex gap-[20px]">
      <div className="flex flex-col flex-1 gap-[10px]">
        <div className="flex">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] py-[2px] rounded">
            Tema predeterminado
          </p>
        </div>
        <div className="flex gap-1 p-[2px] select-none">
          {themeColors.map(theme => {
            return (
              <button
                key={theme.id}
                type="button"
                className={`w-7 h-7 bg-white rounded-full transition border-[4px] flex justify-center items-center ${
                  themeId === theme.id
                    ? "border-app-gray"
                    : "border-white cursor-pointer"
                }`}
                title={theme.name}
                onClick={() => {
                  setThemeId(theme.id);
                  setBgColor(theme.bgColor);
                  setTextColor(theme.textColor);
                  setBgChat(theme.bgChat);
                  setBgUser(theme.bgUser);
                  setBgAssistant(theme.bgAssistant);
                  setTextDate(theme.textDate);
                  setButtonColor(theme.buttonColor);
                }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: theme.bgColor,
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
        <Slider
          min={0}
          max={16}
          step={1}
          value={edgeRadius}
          onChange={handleSliderChange}
          trackStyle={{ backgroundColor: "#ebebeb", height: 10 }}
          handleStyle={{
            borderColor: "#ebebeb",
            height: 20,
            width: 20,
            marginTop: -5,
            backgroundColor: "#fff",
          }}
          railStyle={{ backgroundColor: "#ccc", height: 10 }}
        />
      </div>
      <div
        className="h-[460px] w-[300px] bg-slate-300 flex flex-col overflow-hidden"
        style={{
          borderRadius: edgeRadius,
        }}
      >
        <div
          className="w-full h-[70px] flex items-center gap-[10px] p-[10px] relative"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {modalActive === "bgColor" ? (
            <div className="absolute top-2 z-[500] right-2">
              <SketchPicker
                color={bgColor}
                onChange={color => {
                  setBgColor(color.hex);
                  setModalActive(null);
                }}
              />
            </div>
          ) : (
            <MdOutlineFormatColorFill
              onClick={() => setModalActive("bgColor")}
              className="absolute right-2 top-2 text-black w-[24px] h-[24px] cursor-pointer bg-white bg-opacity-90 rounded-full p-1"
            />
          )}
          <img
            src={`${urlFiles}/logos/${integration.config.logo}`}
            alt="Chat"
            className="w-[50px] h-[50px] bg-white bg-opacity-60 rounded-full p-1"
          />
          <div className="flex items-start flex-col justify-start">
            <p
              style={{
                color: textColor,
              }}
            >
              {integration.config.title}
            </p>
            <div className="bg-green-500 w-[6px] h-[6px] rounded-full"></div>
          </div>
        </div>
        <div
          className="flex flex-col flex-1 overflow-y-auto py-[10px] px-[20px] gap-[10px]"
          style={{
            backgroundColor: bgChat,
          }}
        >
          {chatExample.map(chat => {
            return chat.user === "assistant" ? (
              <MessageSofia
                key={`chat-msg-${chat.id}`}
                menssage={chat.text}
                date={chat.created_at}
                bg={bgAssistant}
                textDate={textDate}
              />
            ) : (
              <MessageUser
                key={`chat-msg-${chat.id}`}
                menssage={chat.text}
                date={chat.created_at}
                bg={bgUser}
                textDate={textDate}
              />
            );
          })}
        </div>
        <div
          className="w-full h-[50px] flex gap-[10px] p-[10px]"
          style={{
            backgroundColor: bgColor,
          }}
        >
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex flex-1 bg-transparent border-none bg-white p-[10px]"
          />
          <button
            type="button"
            className="w-[80px] h-full text-white"
            style={{
              backgroundColor: buttonColor,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatEditor;
