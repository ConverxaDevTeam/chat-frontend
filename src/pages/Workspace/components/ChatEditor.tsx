import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ConfigWebChat, Integracion } from "./CustomizeChat";
import ChatPreview from "./ChatPreview";
import { Chrome } from "@uiw/react-color";
import LabelColor from "./LabelColor";
import { themeColors } from "@utils/lists";

interface ChatEditorProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

const ChatConfigurations = ({
  integration,
  setIntegration,
  selectColor,
  setSelectColor,
  themeId,
  setThemeId,
  handleChangeColor,
}: {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  selectColor: { color: string; element: string | null };
  setSelectColor: (selectColor: {
    color: string;
    element: string | null;
  }) => void;
  themeId: number;
  setThemeId: (id: number) => void;
  handleChangeColor: (color: { hex: string }) => void;
}) => (
  <div className="grid grid-cols-2 gap-[10px] items-start flex-1">
    <div className="flex flex-col items-start gap-[10px] flex-1 col-span-2">
      <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
        Tema predeterminado
      </p>
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
                setIntegration({
                  ...integration,
                  config: {
                    ...integration.config,
                    bg_color: theme.bg_color,
                    text_title: theme.text_title,
                    bg_chat: theme.bg_chat,
                    text_color: theme.text_color,
                    bg_assistant: theme.bg_assistant,
                    bg_user: theme.bg_user,
                    button_color: theme.button_color,
                    button_text: theme.button_text,
                    text_date: theme.text_date,
                  },
                });
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: theme.bg_color,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>

    <div className="flex flex-col items-start gap-[10px]">
      <p className="text-[12px] mx-auto font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
        Radio de ventana
      </p>
      <Slider
        min={0}
        max={16}
        step={1}
        value={integration.config.edge_radius}
        onChange={newValue => {
          if (typeof newValue === "number") {
            setIntegration({
              ...integration,
              config: {
                ...integration.config,
                edge_radius: newValue,
              },
            });
          }
        }}
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

    <div className="flex flex-col items-start gap-[10px]">
      <p className="text-[12px] mx-auto font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
        Radio de mensajes
      </p>
      <Slider
        min={0}
        max={30}
        step={1}
        value={integration.config.message_radius}
        onChange={newValue => {
          if (typeof newValue === "number") {
            setIntegration({
              ...integration,
              config: {
                ...integration.config,
                message_radius: newValue,
              },
            });
          }
        }}
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

    <LabelColor
      label="bg_color"
      title="Color de header"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="text_title"
      title="Texto de header"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="bg_chat"
      title="Fondo del chat"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="text_color"
      title="Color de Textos"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="bg_assistant"
      title="Mensaje sofia"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="bg_user"
      title="Mensaje usuario"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="button_color"
      title="Color de Enviar"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="button_text"
      title="Color de Enviar"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <LabelColor
      label="text_date"
      title="Fecha de mensajes"
      integration={integration}
      selectColor={selectColor}
      setSelectColor={setSelectColor}
    />

    <div className="col-span-2 px-[10px]">
      <Chrome
        color={
          selectColor.element &&
          selectColor.element in integration.config &&
          typeof integration.config[
            selectColor.element as keyof ConfigWebChat
          ] === "string"
            ? (integration.config[
                selectColor.element as keyof ConfigWebChat
              ] as string)
            : selectColor.color
        }
        onChange={handleChangeColor}
        style={{
          boxShadow: "none",
          border: "none",
          padding: "0px",
          width: "100%",
        }}
      />
    </div>
  </div>
);

const ChatPreviewContainer = ({ config }: { config: ConfigWebChat }) => (
  <ChatPreview config={config} />
);

const ChatEditor = ({ integration, setIntegration }: ChatEditorProps) => {
  const [themeId, setThemeId] = useState<number>(0);
  const [selectColor, setSelectColor] = useState<{
    color: string;
    element: string | null;
  }>({
    element: "bg_color",
    color: integration.config.bg_color,
  });

  const handleChangeColor = (color: { hex: string }) => {
    setSelectColor({ ...selectColor, color: color.hex });
    if (selectColor.element) {
      setIntegration({
        ...integration,
        config: {
          ...integration.config,
          [selectColor.element]: color.hex,
        },
      });
    }
  };

  return (
    <div className="flex gap-[20px] items-start">
      <ChatConfigurations
        integration={integration}
        setIntegration={setIntegration}
        selectColor={selectColor}
        setSelectColor={setSelectColor}
        themeId={themeId}
        setThemeId={setThemeId}
        handleChangeColor={handleChangeColor}
      />
      <ChatPreviewContainer config={integration.config} />
    </div>
  );
};

export default ChatEditor;
