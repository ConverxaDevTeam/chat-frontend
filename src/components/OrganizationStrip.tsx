import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store';
import { setOrganizationId } from '@store/actions/auth';
import { OrganizationRoleType } from '@utils/interfaces';
import ModalCreateOrganization from '@pages/Organizations/ModalCreateUser';
import ReactDOM from 'react-dom';
import { fetchNotifications } from '@store/reducers/notifications';
import { useNavigate } from 'react-router-dom';
import { joinRoom, leaveRoom } from '@services/websocket.service';
import { getInitials } from '@utils/format';
import { fetchDepartments } from '@store/reducers/department';
import { useAlertContext } from '@components/Diagrams/components/AlertContext';

interface OrganizationStripProps {
}

export const OrganizationStrip: React.FC<OrganizationStripProps> = ({ }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, selectOrganizationId, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const { departments, loadingDepartments } = useSelector(
    (state: RootState) => state.department
  );
  const { showConfirmation } = useAlertContext();

  const isAdmin = user?.is_super_admin || myOrganizations.some(
    org => org.role === OrganizationRoleType.ADMIN || org.role === OrganizationRoleType.OWNER
  );

  const realOrganizations = myOrganizations.filter(
    organization => organization.organization
  );

  useEffect(() => {
    realOrganizations.forEach(organization => {
      joinRoom(`organization-${organization.organization.id}`);
    });
    return () => {
      realOrganizations.forEach(organization => {
        leaveRoom(`organization-${organization.organization.id}`);
      });
    };
  }, [user?.is_super_admin]);

  useEffect(() => {
    if (
      !user?.is_super_admin &&
      realOrganizations.length > 0 &&
      !selectOrganizationId
    ) {
      dispatch(setOrganizationId(realOrganizations[0].organization.id));
    }
  }, [realOrganizations, selectOrganizationId]);

  useEffect(() => {
    if (selectOrganizationId !== null) {
      dispatch(fetchNotifications(selectOrganizationId));
      dispatch(fetchDepartments(selectOrganizationId));
    }
  }, [selectOrganizationId]);

  useEffect(() => {
    if (
      selectOrganizationId !== null && 
      !loadingDepartments && 
      departments.length === 0 && 
      selectOrganizationId !== 0
    ) {
      showConfirmation({
        title: "No hay departamentos",
        text: "Es necesario crear un departamento para crear agentes",
        confirmButtonText: "Ir a departamentos",
        cancelButtonText: "Cancelar",
        onConfirm: async () => {
          navigate("/departments");
          return true;
        },
      });
    }
  }, [departments, loadingDepartments, selectOrganizationId]);

  const handleSelectOrganization = (organizationId: number | null) => {
    if (organizationId === selectOrganizationId) {
      return;
    }
    dispatch(setOrganizationId(organizationId));

    if (organizationId === null) {
      navigate('/dashboard');
    } 
    else if (window.location.pathname.includes('/organizations')) {
      navigate("/dashboard");
    } 
    else {
      navigate(0);
    }
  };

  const isGlobalUser = user?.is_super_admin || myOrganizations.some(org => !org.organization);

  return (
    <div className="fixed top-0 left-0 flex flex-col items-center gap-0 p-0 w-[74px] h-full bg-[#F4FAFF] z-10 overflow-visible">
      <div className="w-full flex flex-col items-center pt-[70px] pb-2 gap-4 overflow-visible">
        {isGlobalUser && (
          <div className="group relative overflow-visible">
            <button
              className={`w-8 h-8 rounded-md bg-[#F8E473] flex items-center justify-center text-[#343E4F] font-bold border ${selectOrganizationId === null ? 'border-[#343E4F] border-2' : 'border-[#343E4F] border'} text-[10px]`}
              aria-label="Panel Administrador"
              onClick={() => handleSelectOrganization(null)}
            >
              ADM
            </button>
            <div
              className={`
                fixed z-[9999] group-hover:flex hidden 
                bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
                shadow-md items-center pointer-events-none
              `}
              style={{ 
                left: '64px',
                top: '70px',
                transform: 'translateY(0)'
              }}
            >
              Panel Administrador
            </div>
          </div>
        )}
      </div>
      
      <div className="w-full flex-1 overflow-y-auto overflow-x-visible flex flex-col items-center gap-4 py-2 custom-scrollbar">
        {realOrganizations.map((org) => {
        const orgName = org.organization.name;
        const isSelected = selectOrganizationId === org.organization.id;
        
        return (
          <div key={org.organization.id} className="group relative overflow-visible">
            <button
              className={`w-8 h-8 rounded-md ${isSelected ? 'border-2 border-[#343E4F]' : ''} flex items-center justify-center font-bold overflow-hidden`}
              aria-label={orgName}
              onClick={() => handleSelectOrganization(org.organization.id)}
              onMouseEnter={(e) => {
                document.documentElement.style.setProperty('--tooltip-org-y-position', `${e.currentTarget.getBoundingClientRect().top}px`);
              }}
            >
              {org.organization.logo ? (
                <img 
                  src={org.organization.logo} 
                  alt={`${orgName} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#343E4F] text-[10px] bg-gray-200 w-full h-full flex items-center justify-center">
                  {getInitials(orgName)}
                </span>
              )}
            </button>
            <div
              className={`
                fixed z-[9999] group-hover:flex hidden 
                bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
                shadow-md items-center pointer-events-none
              `}
              style={{ 
                left: '64px',
                top: 'var(--tooltip-org-y-position)',
                transform: 'translateY(0)'
              }}
            >
              {orgName}
            </div>
          </div>
        );
      })}
      
        {isAdmin && (
          <div className="group relative overflow-visible">
            <button
              className="w-8 h-8 rounded-md bg-[#EEEEEE] flex items-center justify-center text-[#343E4F] hover:bg-gray-200 transition"
              aria-label="Agregar organización"
              onClick={() => setShowCreateModal(true)}
              onMouseEnter={(e) => {
                document.documentElement.style.setProperty('--tooltip-add-y-position', `${e.currentTarget.getBoundingClientRect().top}px`);
              }}
            >
              <FiPlus className="w-4 h-4" />
            </button>
            <div
              className={`
                fixed z-[9999] group-hover:flex hidden 
                bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
                shadow-md items-center pointer-events-none
              `}
              style={{ 
                left: '64px',
                top: 'var(--tooltip-add-y-position)',
                transform: 'translateY(0)'
              }}
            >
              Agregar organización
            </div>
          </div>
        )}
      </div>
      
      {showCreateModal && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] overflow-auto">
            <ModalCreateOrganization
              close={() => setShowCreateModal(false)}
              getAllOrganizations={async () => {
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};