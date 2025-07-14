import Loading from "@components/Loading";
import { FC, ReactNode } from "react";

interface WizardTabLayoutProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    status?: "completed" | "current" | "pending";
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  actions?: ReactNode;
  isLoading?: boolean;
}

const WizardTabLayout: FC<WizardTabLayoutProps> = ({
  tabs,
  onTabChange,
  children,
  actions,
  isLoading,
}) => (
  <div
    className={`${isLoading ? "bg-transparent" : "bg-sofia-blancoPuro"} shadow-lg rounded-lg w-[1180px] h-[719px] flex`}
  >
    {isLoading ? (
      <div className="w-full min-h-[400px] flex justify-center items-center">
        <Loading />
      </div>
    ) : (
      <>
        <div className="flex flex-1">
          <div className="w-[80px] sm:w-[280px] bg-sofia-blancoPuro border-r border-sofia-darkBlue flex flex-col">
            <div className="sm:p-6 p-2">
              <img
                src="/img/logo-sofia-horizontal.svg"
                alt="SOF.IA"
                className="h-6 mb-8 hidden sm:block mx-auto"
              />
              <p className="text-sofia-superDark text-xl font-normal mb-12 leading-[27px] hidden sm:block">
                Sigue estos pasos para personalizar tu organización y activar tu
                asistente con IA.
              </p>
              <div className="space-y-3 text-sofia-superDark sm:pr-2 pr-0">
                {tabs.map((tab, index) => {
                  const isCompleted = tab.status === "completed";
                  const isCurrent = tab.status === "current";
                  const isPending = tab.status === "pending";

                  return (
                    <div
                      key={tab.id}
                      className={`group relative sm:px-3 px-1 py-2 rounded transition-colors flex items-center justify-center sm:justify-start ${
                        isCurrent
                          ? "bg-sofia-superDark text-white cursor-pointer"
                          : isCompleted
                            ? "text-sofia-success cursor-pointer hover:bg-sofia-success/10"
                            : isPending
                              ? "text-gray-400 cursor-not-allowed opacity-60"
                              : "hover:bg-sofia-electricGreen/10 cursor-pointer"
                      }`}
                      onClick={() => !isPending && onTabChange(tab.id)}
                    >
                      {/* Mobile view - Only number/icon */}
                      <div className="flex items-center justify-center w-full sm:hidden">
                        {isCompleted ? (
                          <img
                            src="/mvp/check-circle.svg"
                            alt="Completado"
                            className="w-5 h-5 flex-shrink-0"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(52%) sepia(81%) saturate(2878%) hue-rotate(142deg) brightness(87%) contrast(88%)",
                            }}
                          />
                        ) : (
                          <span className="font-medium text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Desktop view - Full layout */}
                      <div className="hidden sm:flex items-center w-full">
                        <span className="font-medium text-sm mr-2">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-sm flex-1">
                          {tab.label}
                        </span>
                        {isCompleted && (
                          <img
                            src="/mvp/check-circle.svg"
                            alt="Completado"
                            className="w-4 h-4 ml-2 flex-shrink-0"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(52%) sepia(81%) saturate(2878%) hue-rotate(142deg) brightness(87%) contrast(88%)",
                            }}
                          />
                        )}
                      </div>

                      {/* Tooltip for mobile */}
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 sm:hidden">
                        {tab.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-[600px]">
            <div className="p-8 overflow-y-auto flex-1">{children}</div>
            {actions && (
              <div className="flex justify-end gap-3 p-6 border-t border-sofia-darkBlue">
                {actions}
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);

export default WizardTabLayout;
