import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setOrganizationId } from "@store/actions/auth";
import { useNavigate } from "react-router-dom";
import { joinRoom, leaveRoom } from "@services/websocket.service";

type SelectOrganizationProps = {
  mobileResolution: boolean;
};

const SelectOrganization = ({ mobileResolution }: SelectOrganizationProps) => {
  const { myOrganizations, selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<boolean>(false);
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

  const text = user?.is_super_admin
    ? selectOrganizationId === 0 || selectOrganizationId === null
      ? "Panel admin"
      : selectOrganizationId === null
        ? myOrganizations[0]?.organization?.name
        : myOrganizations.find(
            organization =>
              organization.organization.id === selectOrganizationId
          )?.organization.name
    : selectOrganizationId === null
      ? myOrganizations[0]?.organization?.name
      : myOrganizations.find(
          organization => organization.organization.id === selectOrganizationId
        )?.organization.name;

  const handleSelectOrganization = (organizationId: number) => {
    if (organizationId === selectOrganizationId) {
      setOpen(false);
      return;
    }
    navigate("/dashboard");
    dispatch(setOrganizationId(organizationId));
    setOpen(false);
  };

  return (
    <div
      className={` bg-custom-gradient border-[2px] border-[#B8CCE0] border-inherit h-[36px] relative rounded-lg flex justify-between items-center p-[6px] cursor-pointer ${mobileResolution ? "w-full" : "w-[200px]"}`}
      onClick={() => setOpen(!open)}
    >
      <p>{text}</p>
      <img
        className="w-6 h-6 fill-current"
        src="/mvp/chevron-down.svg"
        alt="arrow"
      />
      {open && (
        <div className="absolute w-full bg-app-c2 top-[36px] left-0 rounded-lg border-[1px] border-app-c3 z-50">
          {user?.is_super_admin && (
            <div
              onClick={() => handleSelectOrganization(0)}
              className={`p-[6px] cursor-pointer hover:bg-app-c1 ${selectOrganizationId === 0 || selectOrganizationId === null ? "bg-app-c1" : ""}`}
            >
              Panel Admin
            </div>
          )}
          {myOrganizations?.map(organization => (
            <div
              key={organization.organization.id}
              onClick={() =>
                handleSelectOrganization(organization.organization.id)
              }
              className={`p-[6px] cursor-pointer hover:bg-app-c1 ${selectOrganizationId === organization.organization.id ? "bg-app-c1" : ""}`}
            >
              {organization.organization.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectOrganization;
