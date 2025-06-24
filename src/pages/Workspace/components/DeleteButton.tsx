const DeleteButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >
      <g filter="url(#filter0_d_4429_1947)">
        <rect x="5" y="5" width="21" height="21" rx="6" fill="white" />
        <rect
          x="5.5"
          y="5.5"
          width="20"
          height="20"
          rx="5.5"
          stroke="#001126"
        />
      </g>
      <path
        d="M13.6138 17.6213L17.8564 13.3787"
        stroke="#001126"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.8564 17.6213L13.6138 13.3787"
        stroke="#001126"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_4429_1947"
          x="0"
          y="0"
          width="31"
          height="31"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4429_1947"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4429_1947"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default DeleteButton;
