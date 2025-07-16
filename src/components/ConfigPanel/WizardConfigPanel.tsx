import Loading from "@components/Loading";
import { FC, ReactNode } from "react";

interface WizardConfigPanelProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  actions?: ReactNode;
  isLoading?: boolean;
}

const WizardConfigPanel: FC<WizardConfigPanelProps> = ({
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
          <div className="w-[263px] bg-sofia-blancoPuro border-r border-sofia-darkBlue flex flex-col">
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
              <ol className="list-decimal list-inside space-y-3 text-sofia-superDark">
                {tabs.map(tab => (
                  <li
                    key={tab.id}
                    className={`cursor-pointer px-4 py-3 -ml-4 rounded transition-colors ${
                      activeTab === tab.id
                        ? "bg-sofia-superDark text-white"
                        : "hover:bg-sofia-electricGreen/10"
                    }`}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <span className="font-medium ml-2">{tab.label}</span>
                  </li>
                ))}
              </ol>
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

export default WizardConfigPanel;
