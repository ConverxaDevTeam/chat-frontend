import { Fragment, useState, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Integracion } from "./CustomizeChat";
import ChatPreview from "./ChatPreview";
import { themeColors } from "@utils/lists";
import { Sketch } from "@uiw/react-color";

interface ChatEditorProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

const ThemeSelector = ({
  integration,
  setIntegration,
  themeId,
  setThemeId,
}: {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  themeId: number;
  setThemeId: (id: number) => void;
}) => (
  <div className="flex flex-col items-start gap-[10px] flex-1 col-span-1.5 w-full">
    <h3 className="my-2 text-sofia-superDark text-[14px] font-semibold leading-[16px]">
      Temas predeterminados
    </h3>
    <div className="grid grid-cols-5 auto-rows-auto gap-2 w-full px-1">
      {themeColors.map(theme => (
        <button
          key={theme.id}
          type="button"
          className={`h-[10px] w-[60px] rounded transition overflow-hidden ${
            themeId === theme.id
              ? "ring-2 ring-app-gray"
              : "hover:ring-1 hover:ring-app-gray/50"
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
          <div className="flex h-full w-full">
            <div
              className="flex-1"
              style={{ backgroundColor: theme.bg_color }}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: theme.bg_chat }}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: theme.bg_assistant }}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: theme.bg_user }}
            />
          </div>
        </button>
      ))}
    </div>
    <div className="w-full h-[1px] bg-[#2C2C2C] mt-4" />
  </div>
);

const ControlItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="col-span-2 flex flex-col gap-4">
    <div className="w-full h-[1px] bg-[#DBEAF2]" />
    <div className="flex items-center justify-between w-full gap-4">
      <span className="text-[12px] text-sofia-superDark font-normal">
        {label}
      </span>
      <div className="w-[95px]">{children}</div>
    </div>
  </div>
);

const RadiusControls = ({
  integration,
  setIntegration,
}: {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}) => {
  const handleChangeRadius = (value: number | number[]) => {
    if (typeof value === "number") {
      setIntegration({
        ...integration,
        config: {
          ...integration.config,
          edge_radius: value,
        },
      });
    }
  };

  const handleChangeMessageRadius = (value: number | number[]) => {
    if (typeof value === "number") {
      setIntegration({
        ...integration,
        config: {
          ...integration.config,
          message_radius: value,
        },
      });
    }
  };

  return (
    <Fragment>
      <ControlItem label="Radio de ventana">
        <Slider
          min={0}
          max={20}
          value={integration.config.edge_radius}
          onChange={handleChangeRadius}
          styles={{
            rail: { backgroundColor: "#001126", height: 1, width: 95 },
            track: { backgroundColor: "#001126", height: 1, width: 95 },
            handle: {
              width: 12,
              height: 12,
              backgroundColor: "#15ECDA",
              border: "1px solid #001126",
              opacity: 1,
              boxShadow: "none",
              marginTop: -6,
            },
          }}
        />
      </ControlItem>
      <ControlItem label="Radio de mensajes">
        <Slider
          min={0}
          max={20}
          value={integration.config.message_radius}
          onChange={handleChangeMessageRadius}
          styles={{
            rail: { backgroundColor: "#001126", height: 1, width: 95 },
            track: { backgroundColor: "#001126", height: 1, width: 95 },
            handle: {
              width: 12,
              height: 12,
              backgroundColor: "#15ECDA",
              border: "1px solid #001126",
              opacity: 1,
              boxShadow: "none",
              marginTop: -6,
            },
          }}
        />
      </ControlItem>
    </Fragment>
  );
};

const ColorControl = ({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (color: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <ControlItem label={label}>
      <div className="w-full flex flex-2 gap-1">
        <button
          ref={buttonRef}
          className="w-[40px] h-[16px] border border-sofia-navyBlue rounded flex items-center"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker(true)}
        />

        <div className="flex-1 text-[13px] text-sofia-superDark px-1">
          {color.replace("#", "").toUpperCase()}
        </div>
        {showPicker && (
          <div
            className="fixed z-50"
            style={{
              top: buttonRef.current?.getBoundingClientRect().bottom,
              left: buttonRef.current?.getBoundingClientRect().left,
            }}
          >
            <div
              className="fixed inset-0"
              onClick={() => setShowPicker(false)}
            />
            <div className="relative bg-white rounded-lg shadow-lg p-2">
              <Sketch
                color={color}
                onChange={color => {
                  onChange(color.hex);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ControlItem>
  );
};

const colorConfigs = [
  { key: "bg_color", label: "Header" },
  { key: "text_title", label: "Textos de cabecera" },
  { key: "bg_chat", label: "Fondo" },
  { key: "text_color", label: "Nombre IA y usuario" },
  { key: "bg_assistant", label: "Globos mensaje IA" },
  { key: "bg_user", label: "Globos mensaje usuario" },
  { key: "button_color", label: "Fondo de enviar mensaje" },
  { key: "button_text", label: "Botón de enviar" },
  { key: "text_date", label: "Hora" },
] as const;

const ColorPicker = ({
  integration,
  setIntegration,
}: {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}) => {
  return (
    <Fragment>
      {colorConfigs.map(config => (
        <ColorControl
          key={config.key}
          label={config.label}
          color={integration.config[config.key]}
          onChange={color => {
            setIntegration({
              ...integration,
              config: {
                ...integration.config,
                [config.key]: color,
              },
            });
          }}
        />
      ))}
    </Fragment>
  );
};

const ChatConfigurations = ({
  integration,
  setIntegration,
  themeId,
  setThemeId,
}: {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  themeId: number;
  setThemeId: (id: number) => void;
}) => (
  <div className="flex flex-col gap-[10px]">
    <h3 className="text-sofia-superDark text-[14px] font-semibold leading-[16px] mb-2">
      Colores y estilo
    </h3>
    <ThemeSelector
      integration={integration}
      setIntegration={setIntegration}
      themeId={themeId}
      setThemeId={setThemeId}
    />
    <p className="text-[14px] text-[#2C2C2C] font-bold mt-4">
      Colores personalizados
    </p>
    <RadiusControls integration={integration} setIntegration={setIntegration} />
    <ColorPicker integration={integration} setIntegration={setIntegration} />
  </div>
);

const ChatEditor = ({ integration, setIntegration }: ChatEditorProps) => {
  const [themeId, setThemeId] = useState<number>(0);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-[20px] w-full max-w-[1000px] overflow-y-auto pr-[20px]">
      
      <ChatConfigurations
        integration={integration}
        setIntegration={setIntegration}
        themeId={themeId}
        setThemeId={setThemeId}
      />
      <div className="w-[320px]">
      <h3 className="text-sofia-superDark text-[14px] font-semibold leading-[16px] mb-2">
      Vista previa del chat
    </h3>
        <ChatPreview config={integration.config} />
      </div>
    </div>
  );
};

export default ChatEditor;
