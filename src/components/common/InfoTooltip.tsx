import React from "react";

interface InfoTooltipProps {
  text: string;
  width?: string;
  iconSrc?: string;
  position?: "left" | "right" | "top" | "bottom";
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  width = "178px",
  iconSrc = "/mvp/Vector.svg",
  position = "right",
}) => {
  const positionClasses = {
    right: "left-full top-0 ml-2",
    left: "right-full top-0 mr-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <div className="group relative inline-flex">
      <img src={iconSrc} alt="Info" className="cursor-pointer" />
      <div
        className={`
          absolute z-10 ${positionClasses[position]} group-hover:flex hidden 
          bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
          font-[400] whitespace-normal tracking-[0.17px] leading-[143%] text-left
        `}
        style={{ width }}
      >
        {text}
      </div>
    </div>
  );
};

export default InfoTooltip;
