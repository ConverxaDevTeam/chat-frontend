import { FC, ReactNode } from "react";
import DefaultTabLayout from "./layouts/DefaultTabLayout";
import WizardTabLayout from "./layouts/WizardTabLayout";

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
  layout?: "default" | "wizard";
}

const ConfigPanel: FC<ConfigPanelProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  actions,
  isLoading,
  layout = "default",
}) => {
  const commonProps = {
    tabs,
    activeTab,
    onTabChange,
    children,
    actions,
    isLoading,
  };

  if (layout === "wizard") {
    return <WizardTabLayout {...commonProps} />;
  }

  return <DefaultTabLayout {...commonProps} />;
};

export default ConfigPanel;
