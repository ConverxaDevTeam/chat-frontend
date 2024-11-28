import { RootState } from "@store";
import { useSelector } from "react-redux";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import DashboardOrganization from "./DashboardOrganization";
import ProtectedSuperAdmin from "@components/ProtectedSuperAdmin";

const Dashboard = () => {
  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  if (
    (selectOrganizationId === null && user?.is_super_admin) ||
    (selectOrganizationId === 0 && user?.is_super_admin)
  ) {
    return (
      <ProtectedSuperAdmin>
        <DashboardSuperAdmin />
      </ProtectedSuperAdmin>
    );
  } else {
    return <DashboardOrganization />;
  }
};

export default Dashboard;
