const EditButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >
      <g filter="url(#filter0_d_4429_1954)">
        <rect x="5.25" y="5" width="21" height="21" rx="6" fill="white" />
        <rect
          x="5.75"
          y="5.5"
          width="20"
          height="20"
          rx="5.5"
          stroke="#001126"
        />
      </g>
      <path
        d="M16.3802 11.3001L12.2752 15.6451C12.1202 15.8101 11.9702 16.1351 11.9402 16.3601L11.7552 17.9801C11.6902 18.5651 12.1102 18.9651 12.6902 18.8651L14.3002 18.5901C14.5252 18.5501 14.8402 18.3851 14.9952 18.2151L19.1002 13.8701C19.8102 13.1201 20.1302 12.2651 19.0252 11.2201C17.9252 10.1851 17.0902 10.5501 16.3802 11.3001Z"
        fill="white"
        stroke="#001126"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6953 12.0249C15.9103 13.4049 17.0303 14.4599 18.4203 14.5999L15.6953 12.0249Z"
        fill="white"
      />
      <path
        d="M15.6953 12.0249C15.9103 13.4049 17.0303 14.4599 18.4203 14.5999"
        stroke="#001126"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_4429_1954"
          x="0.25"
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
            result="effect1_dropShadow_4429_1954"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4429_1954"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default EditButton;
