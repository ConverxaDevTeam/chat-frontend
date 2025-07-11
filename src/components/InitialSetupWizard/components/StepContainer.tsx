import React from "react";

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-medium text-sofia-superDark leading-5 mb-1">
          {title}
        </h1>
        <p className="text-xs font-normal text-[#343E4F]">{subtitle}</p>
      </div>

      {/* Divider line */}
      <hr className="border-t border-gray-200 mb-8 flex-shrink-0" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2">{children}</div>
    </div>
  );
};

export default StepContainer;
