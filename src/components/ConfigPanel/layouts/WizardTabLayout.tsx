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
  activeTab,
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
          <div className="w-[280px] bg-sofia-blancoPuro border-r border-sofia-darkBlue flex flex-col">
            <div className="p-6">
              <img
                src="/img/logo-sofia-horizontal.svg"
                alt="SOF.IA"
                className="h-6 mb-8"
              />
              <p className="text-sofia-superDark text-xl font-normal mb-12 leading-[27px]">
                Sigue estos pasos para personalizar tu organización y activar tu
                asistente con IA.
              </p>
              <div className="space-y-3 text-sofia-superDark pr-2">
                {tabs.map((tab, index) => {
                  const isCompleted = tab.status === "completed";
                  const isCurrent = tab.status === "current";
                  const isPending = tab.status === "pending";

                  return (
                    <div
                      key={tab.id}
                      className={`relative px-3 py-2 rounded transition-colors flex items-center ${
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
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8 overflow-y-auto">{children}</div>
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
