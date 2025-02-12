import React from "react";

const GuideConfig = () => {
  return (
    <div className="flex flex-col gap-[16px] w-[166px] h-[427px]">
      <div className="bg-[#F4FAFF] flex-1 rounded-[8px] p-[16px] flex flex-col gap-[16px] items-start">
        <p className="text-sofia-superDark font-semibold">
          Configura tu agente y empieza a automatizar
        </p>
        <img
          className="select-none h-[200px]"
          src="/img/mono.png"
          alt="character"
        />
      </div>
      <div className="bg-sofia-gradient1 w-full h-[96px] rounded-[8px] py-[8px] px-[16px] gap-[8px] flex flex-col">
        <p className="text-sofia-superDark font-semibold text-[12px]">
          ¿Necesitas ayuda? Visita nuestro centro de soporte
        </p>
        <button
          type="button"
          className="w-full h-[24px] text-[12px] text-sofia-navyBlue bg-white border-sofia-navyBlue border-[1px] font-semibold rounded-[4px]"
        >
          Ir ahora
        </button>
      </div>
    </div>
  );
};

export default GuideConfig;
