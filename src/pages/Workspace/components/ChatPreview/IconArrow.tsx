interface IconArrowProps {
  color: string;
  className: string;
  onClick: () => void;
}
const IconArrow = ({ color, className, onClick }: IconArrowProps) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="256.000000pt"
      height="256.000000pt"
      viewBox="0 0 256.000000 256.000000"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      onClick={onClick}
    >
      <g
        transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke={color}
      >
        <path
          d="M870 1911 c-86 -95 -497 -531 -542 -575 -27 -26 -48 -52 -46 -56 2
-4 55 -63 119 -131 63 -68 135 -146 160 -174 24 -27 87 -95 140 -150 53 -55
120 -126 149 -157 29 -32 56 -58 61 -58 5 0 9 101 9 225 l0 225 278 -1 c152 0
309 -4 347 -9 133 -18 155 -22 155 -30 0 -4 16 -10 35 -13 19 -3 77 -26 129
-50 130 -62 272 -176 363 -292 17 -22 35 -37 39 -32 4 4 2 13 -4 19 -7 7 -12
29 -12 49 0 21 -4 41 -10 44 -5 3 -10 17 -10 29 0 39 -68 193 -128 286 -55 87
-177 215 -265 278 -81 58 -204 122 -312 162 -81 30 -320 54 -483 48 l-122 -4
0 203 c0 112 -3 203 -7 203 -5 0 -24 -18 -43 -39z"
        />
      </g>
    </svg>
  );
};

export default IconArrow;
