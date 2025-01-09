import { FiPlus } from "react-icons/fi";
import { ReactNode } from "react";
import Loading from "@components/Loading";

interface PageContainerProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  loading?: boolean;
  children: ReactNode;
  appends?: ReactNode;
}

const PageContainer = ({
  title,
  buttonText,
  onButtonClick,
  loading,
  children,
  appends,
}: PageContainerProps) => {
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="flex items-center gap-1 px-4 py-2 bg-app-dark text-white rounded hover:bg-opacity-90"
            >
              <FiPlus /> {buttonText}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-4">
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
