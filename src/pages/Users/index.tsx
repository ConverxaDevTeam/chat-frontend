import { RootState } from "@store";
import { useSelector } from "react-redux";
import ProtectedSuperAdmin from "@components/ProtectedSuperAdmin";
import UsersOrganization from "./UsersOrganization";
import UsersSuperAdmin from "./UsersSuperAdmin";

const Users = () => {
  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  if (
    (selectOrganizationId === null && user?.is_super_admin) ||
    (selectOrganizationId === 0 && user?.is_super_admin)
  ) {
    return (
      <ProtectedSuperAdmin>
        <UsersSuperAdmin />
      </ProtectedSuperAdmin>
    );
  } else {
    return <UsersOrganization />;
  }
};

export default Users;
