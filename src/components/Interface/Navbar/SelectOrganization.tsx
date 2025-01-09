import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setOrganizationId } from "@store/actions/auth";
import { useNavigate } from "react-router-dom";
import { joinRoom, leaveRoom } from "@services/websocket.service";
import Select from "@components/Select";

type SelectOrganizationProps = {
  mobileResolution: boolean;
};

const SelectOrganization = ({ mobileResolution }: SelectOrganizationProps) => {
  const { myOrganizations, selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    myOrganizations.every(organization => {
      joinRoom(`organization-${organization.organization.id}`);
    });
    return () => {
      myOrganizations.every(organization => {
        leaveRoom(`organization-${organization.organization.id}`);
      });
    };
  }, []);

  const handleSelectOrganization = (organizationId: number) => {
    if (organizationId === selectOrganizationId) {
      return;
    }
    navigate("/dashboard");
    dispatch(setOrganizationId(organizationId));
  };

  const options = myOrganizations.map(org => ({
    id: org.organization.id,
    name: org.organization.name,
  }));

  const customOptions = user?.is_super_admin ? (
    <div
      onClick={() => handleSelectOrganization(0)}
      className={`p-[6px] cursor-pointer hover:bg-app-c1 ${
        selectOrganizationId === 0 || selectOrganizationId === null
          ? "bg-app-c1"
          : ""
      }`}
    >
      Panel Admin
    </div>
  ) : null;

  const placeholder = user?.is_super_admin
    ? "Panel admin"
    : "Seleccionar Organización";

  return (
    <Select
      value={
        selectOrganizationId === 0 || selectOrganizationId === null
          ? undefined
          : selectOrganizationId
      }
      options={options}
      onChange={handleSelectOrganization}
      placeholder={placeholder}
      mobileResolution={mobileResolution}
      customOptions={customOptions}
    />
  );
};

export default SelectOrganization;
