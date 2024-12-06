import { Integracion } from "./CustomizeChat";

interface LabelColorProps {
  selectColor: { color: string; element: string | null };
  setSelectColor: (obj: { color: string; element: string | null }) => void;
  integration: Integracion;
  label: keyof Integracion["config"];
  title: string;
}

const LabelColor = ({
  selectColor,
  setSelectColor,
  integration,
  label,
  title,
}: LabelColorProps) => {
  const backgroundColor =
    typeof integration.config[label] === "string"
      ? integration.config[label]
      : "#FFFFFF";

  if (!backgroundColor) return null;
  const hexToRgb = (hex: string) => {
    const sanitizedHex = hex.replace("#", "");
    const bigint = parseInt(sanitizedHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const getContrastingTextColor = (backgroundColor: string): string => {
    const { r, g, b } = hexToRgb(backgroundColor);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "#000000" : "#FFFFFF";
  };
  const textColor = getContrastingTextColor(backgroundColor);
  return (
    <div className="flex flex-col items-start">
      <p
        className="text-[12px] mx-auto font-poppinsSemiBold px-[6px] rounded-t-lg pt-[4px] cursor-pointer"
        style={{
          backgroundColor:
            selectColor.element === label ? backgroundColor : "#ebebeb",
          color: selectColor.element === label ? textColor : "#000000",
        }}
        onClick={() => {
          setSelectColor({
            color: backgroundColor || "#ebebeb",
            element: label,
          });
        }}
      >
        {title}
      </p>
      <p
        className="w-full text-[12px] bg-app-c3 py-[2px] px-[10px] border-[2px] rounded cursor-pointer"
        onClick={() =>
          setSelectColor({
            color: backgroundColor || "#ebebeb",
            element: label,
          })
        }
        style={{
          borderColor:
            selectColor.element === label ? backgroundColor : "#ebebeb",
        }}
      >
        {backgroundColor || "Invalid label"}
      </p>
    </div>
  );
};

export default LabelColor;
