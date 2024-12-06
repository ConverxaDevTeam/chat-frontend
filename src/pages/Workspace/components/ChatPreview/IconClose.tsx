interface IconCloseProps {
  color: string;
  className: string;
}

const IconClose = ({ color, className }: IconCloseProps) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="256.000000pt"
      height="256.000000pt"
      viewBox="0 0 256.000000 256.000000"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke={color}
      >
        <path
          d="M377 2183 l-107 -108 397 -397 398 -398 -398 -398 -397 -397 107
-108 108 -107 397 397 398 398 398 -398 397 -397 108 107 107 108 -397 397
-398 398 398 398 397 397 -107 108 -108 107 -397 -397 -398 -398 -398 398
-397 397 -108 -107z"
        />
      </g>
    </svg>
  );
};

export default IconClose;
