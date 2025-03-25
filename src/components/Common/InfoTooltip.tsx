import React from "react";

interface InfoTooltipProps {
  text: string;
  width?: string;
  iconSrc?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  width = "178px",
  iconSrc = "/mvp/Vector.svg",
}) => {
  return (
    <div className="group relative inline-flex">
      <img src={iconSrc} alt="Info" className="cursor-pointer" />
      <div
        className={`
          absolute left-1/2 bottom-full -translate-x-1/2 mb-2 group-hover:flex hidden z-10
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
