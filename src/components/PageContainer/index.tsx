import { ReactNode } from "react";
import Loading from "@components/Loading";

interface PageContainerProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  loading?: boolean;
  children: ReactNode;
  appends?: ReactNode;
}

const PageContainer = ({
  buttonText,
  onButtonClick,
  loading,
  children,
  appends,
}: PageContainerProps) => {
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          {buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="flex items-center gap-1 px-4 py-2 bg-[#001130] text-white rounded-[4px] hover:bg-opacity-90"
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
