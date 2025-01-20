import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const realOrganizations = myOrganizations.filter(
    organization => organization.organization
  );

  useEffect(() => {
    realOrganizations.every(organization => {
      joinRoom(`organization-${organization.organization.id}`);
    });
    return () => {
      realOrganizations.every(organization => {
        leaveRoom(`organization-${organization.organization.id}`);
      });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOrganization = (organizationId: unknown) => {
    if (organizationId === selectOrganizationId) {
      return;
    }
    navigate("/dashboard");
    dispatch(setOrganizationId(Number(organizationId)));
  };

  const options = realOrganizations.map(org => ({
    id: org.organization.id,
    name: org.organization.name,
  }));

  const isGlobalUser =
    user?.is_super_admin || myOrganizations.some(org => !org.organization);
  const customOptions = isGlobalUser ? (
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
    <div ref={selectRef} className="w-[200px]">
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
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default SelectOrganization;
