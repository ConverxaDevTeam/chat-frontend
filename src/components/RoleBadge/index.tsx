import React from 'react';
import { OrganizationRoleType } from '@utils/interfaces';

interface RoleBadgeProps {
  role: OrganizationRoleType | string;
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const getBadgeStyle = () => {
    if (role === OrganizationRoleType.ADMIN || role === OrganizationRoleType.OWNER) {
      return 'bg-[#58CC16] text-white';
    } else if (
      role === OrganizationRoleType.USER || 
      role === OrganizationRoleType.USR_TECNICO
    ) {
      return 'bg-[rgba(120,40,200,0.20)] text-[#782864]';
    } else if (role === OrganizationRoleType.SUPERVISOR) {
      return 'bg-[#F8E473] text-[#343E4F]';
    } else if (role === OrganizationRoleType.HITL) {
      return 'bg-[#15ECDA] text-[#343E4F]';
    } else if (role === OrganizationRoleType.ING_PREVENTA) {
      return 'bg-[#FFB800] text-white';
    } else {
      return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <span 
      className={`text-[12px] font-poppinsMedium px-[8px] py-[3px] rounded-[4px] inline-block ${getBadgeStyle()} ${className}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
