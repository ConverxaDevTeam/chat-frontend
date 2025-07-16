import { ReactNode } from "react";
import Loading from "@components/Loading";

interface PageContainerProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  loading?: boolean;
  children: ReactNode;
  appends?: ReactNode;
  titleClassName?: string;
}

const PageContainer = ({
  title,
  buttonText,
  onButtonClick,
  loading,
  children,
  appends,
  titleClassName,
}: PageContainerProps) => {
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2
              className={`text-xl font-semibold text-app-superDark flex items-center ${titleClassName || ""}`}
            >
              {title}
            </h2>
          )}
          {buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="flex items-center gap-1 px-4 py-2 bg-[#001130] text-white rounded hover:bg-opacity-90"
            >
              {buttonText}
            </button>
          )}
        </div>

        <div className="rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-4 bg-transparent">
              <Loading />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      {appends}
    </>
  );
};

export default PageContainer;
