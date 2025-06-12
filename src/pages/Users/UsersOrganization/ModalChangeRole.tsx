import { useState } from "react";
import { OrganizationRoleType } from "@utils/interfaces";
import { IconCancel } from "@utils/svgs";

interface ModalChangeRoleProps {
  close: () => void;
  handleChangeRole: (newRole: OrganizationRoleType) => void;
  currentRole: OrganizationRoleType;
  userEmail: string;
}

const ModalChangeRole = ({
  close,
  handleChangeRole,
  currentRole,
  userEmail,
}: ModalChangeRoleProps) => {
  const [selectedRole, setSelectedRole] = useState<OrganizationRoleType>(
    currentRole === OrganizationRoleType.USER
      ? OrganizationRoleType.HITL
      : OrganizationRoleType.USER
  );

  const availableRoles = [OrganizationRoleType.USER, OrganizationRoleType.HITL];

  const getRoleDisplayName = (role: OrganizationRoleType) => {
    switch (role) {
      case OrganizationRoleType.USER:
        return "Usuario";
      case OrganizationRoleType.HITL:
        return "Agente Humano";
      default:
        return role;
    }
  };

  const handleConfirm = () => {
    handleChangeRole(selectedRole);
    close();
  };

  return (
    <div className="bg-white w-[calc(100%-20px)] sm:w-[464px] px-[28px] py-[36px] rounded-[20px] relative">
      <IconCancel
        onClick={close}
        className="cursor-pointer text-[30px] text-black absolute top-[26px] right-[30px]"
      />

      <p className="text-sofiaCall-black font-poppinsMedium text-[20px]">
        Cambiar Rol de Usuario
      </p>

      <div className="flex flex-col pt-[24px] mt-[24px] border-t-[1px] border-t-sofiaCall-gray">
        <p className="text-[14px] font-poppinsRegular text-[#0C0C0C] text-opacity-70 mb-4">
          ¿Deseas cambiar el rol del usuario <strong>{userEmail}</strong>?
        </p>

        <div className="mb-6">
          <p className="text-[14px] font-poppinsMedium text-[#0C0C0C] mb-3">
            Rol actual:{" "}
            <span className="text-[#782864]">
              {getRoleDisplayName(currentRole)}
            </span>
          </p>

          <p className="text-[14px] font-poppinsMedium text-[#0C0C0C] mb-3">
            Nuevo rol:
          </p>

          <div className="flex flex-col gap-2">
            {availableRoles
              .filter(role => role !== currentRole)
              .map(role => (
                <label
                  key={role}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                    className="w-4 h-4 text-[#001130] bg-gray-100 border-gray-300 focus:ring-[#001130] focus:ring-2"
                  />
                  <span className="text-[14px] font-poppinsRegular text-[#0C0C0C]">
                    {getRoleDisplayName(role)}
                  </span>
                </label>
              ))}
          </div>
        </div>

        <div className="flex gap-4 mt-[32px]">
          <button
            type="button"
            onClick={close}
            className="w-[150px] hover:bg-sofiaCall-dark h-[45px] rounded-full border-[1px] border-[#BBBBBB] text-[#BBBBBB] hover:border-sofiaCall-dark hover:text-sofiaCall-electricGreen transition-all"
          >
            <p className="font-poppinsSemiBold leading-[27px] text-[18px]">
              Cancelar
            </p>
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-[150px] bg-sofiaCall-dark h-[45px] rounded-full border-[1px] border-sofiaCall-dark hover:bg-opacity-90 transition-all"
          >
            <p className="font-poppinsSemiBold text-sofiaCall-electricGreen leading-[27px] text-[18px]">
              Confirmar
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChangeRole;
