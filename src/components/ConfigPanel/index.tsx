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
    className={`bg-sofia-blancoPuro shadow-lg rounded-2xl overflow-hidden py-[38px]`}
  >
    {isLoading ? (
      <div className="w-full min-h-[400px] flex justify-center items-center">
        <Loading />
      </div>
    ) : (
      <div className="flex flex-col">
        <div className="flex h-full">
          <div className="w-[263px] relative">
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
          <div className="flex-1 px-[38px]">
            <div className="w-fit flex flex-col gap-[38px]">
              <div>{children}</div>
              {actions && (
                <div className="flex justify-end gap-[10px]">{actions}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default ConfigPanel;
