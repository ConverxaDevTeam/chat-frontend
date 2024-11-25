import { RootState } from "@store";
import { useSelector } from "react-redux";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import DashboardOrganization from "./DashboardOrganization";

const Dashboard = () => {
  const { selectOrganizationId, user, organizations } = useSelector(
    (state: RootState) => state.auth
  );
  if (
    (organizations.length === 0 && user?.is_super_admin) ||
    (selectOrganizationId === 0 && !user?.is_super_admin)
  ) {
    return <DashboardSuperAdmin />;
  } else {
    return <DashboardOrganization />;
  }
};

export default Dashboard;
