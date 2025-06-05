import Loading from "@components/Loading";
import { FC, ReactNode } from "react";
import Tab from "./Tab";

interface ConfigPanelProps {
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

const ConfigPanel: FC<ConfigPanelProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  actions,
  isLoading,
}) => (
  <div
    className={`${isLoading ? "bg-transparent" : "bg-sofia-blancoPuro"} shadow-lg rounded-[4px] w-[1180px] h-[719px] flex flex-col`}
  >
    {isLoading ? (
      <div className="w-full min-h-[400px] flex justify-center items-center">
        <Loading />
      </div>
    ) : (
      <>
        <div className="flex flex-1 pt-[38px] overflow-hidden">
          <div className="w-[263px] relative px-[18px]">
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#DBEAF2]" />
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={onTabChange}
              />
            ))}
          </div>
          <div className="flex-1 px-[24px] overflow-y-auto max-h-[640px]">
            <div className="w-full flex flex-col">
              <div>{children}</div>
            </div>
          </div>
        </div>
        {actions && (
          <div className="flex justify-end gap-[10px] pr-[24px] pb-[24px] mt-auto">{actions}</div>
        )}
      </>
    )}
  </div>
);

export default ConfigPanel;
