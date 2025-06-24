import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  text: string;
  width?: string;
  iconSrc?: string;
  position?: "left" | "right" | "top" | "bottom";
  onClick?: () => void;
  active?: boolean;
}

const ensureTooltipRoot = (): HTMLElement => {
  if (typeof document === "undefined") {
    return {} as HTMLElement;
  }

  let tooltipRoot = document.getElementById("tooltip-root");
  
  if (!tooltipRoot) {
    tooltipRoot = document.createElement("div");
    tooltipRoot.id = "tooltip-root";
    tooltipRoot.className = "tooltip-root";
    tooltipRoot.style.position = "fixed";
    tooltipRoot.style.top = "0";
    tooltipRoot.style.left = "0";
    tooltipRoot.style.width = "100%";
    tooltipRoot.style.height = "100%";
    tooltipRoot.style.pointerEvents = "none";
    tooltipRoot.style.zIndex = "9999";
    document.body.appendChild(tooltipRoot);
  } else {
    tooltipRoot.className = "tooltip-root";
    tooltipRoot.style.zIndex = "9999";
  }
  
  return tooltipRoot;
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  width = "178px",
  iconSrc = "/mvp/Vector.svg",
  position = "right",
  onClick,
  active,
  }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef<HTMLImageElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipRoot, setTooltipRoot] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setTooltipRoot(ensureTooltipRoot());
  }, []);
  
  const updatePosition = () => {
    if (isHovered && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;
      
      switch (position) {
        case "right":
          top = rect.top;
          left = rect.right + 8;
          break;
        case "left":
          top = rect.top;
          left = rect.left - 8;
          break;
        case "top":
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
      }
      
      setTooltipPosition({ top, left });
    }
  };
  
  useEffect(() => {
    if (isHovered) {
      updatePosition();
      
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isHovered, position]);

  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: "fixed",
      pointerEvents: "auto",
      width,
      zIndex: 9999,
    };
    
    switch (position) {
      case "right":
        styles.top = tooltipPosition.top + "px";
        styles.left = tooltipPosition.left + "px";
        break;
      case "left":
        styles.top = tooltipPosition.top + "px";
        styles.left = (tooltipPosition.left - parseInt(width)) + "px";
        break;
      case "top":
        styles.top = (tooltipPosition.top - 40) + "px";
        styles.left = (tooltipPosition.left - parseInt(width) / 2) + "px";
        break;
      case "bottom":
        styles.top = tooltipPosition.top + "px";
        styles.left = (tooltipPosition.left - parseInt(width) / 2) + "px";
        break;
    }
    
    return styles;
  };

  return (
    <>
      <img 
        ref={iconRef}
        src={iconSrc} 
        alt="Info" 
        className={`cursor-pointer ${active ? "brightness-0 invert" : ""}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={(e) => {
          e.preventDefault();
          setIsHovered(!isHovered);
        }}
      />
      {isHovered && tooltipRoot && createPortal(
        <div
          className="bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                    font-[400] whitespace-normal tracking-[0.17px] leading-[143%] text-left z-[9999]"
          style={getPositionStyles()}
        >
          {text}
        </div>,
        tooltipRoot
      )}
    </>
  );
};

export default InfoTooltip;
