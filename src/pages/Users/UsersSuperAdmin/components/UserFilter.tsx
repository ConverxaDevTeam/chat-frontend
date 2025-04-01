import React, { useRef, useEffect, useState } from 'react';
import { FiX } from "react-icons/fi";
import { OrganizationRoleType } from "@utils/interfaces";
import ContextMenu from "@components/ContextMenu";

interface UserFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  selectedRole: string;
  selectRole: (role: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({
  searchTerm,
  setSearchTerm,
  isSearchOpen,
  setIsSearchOpen,
  selectedRole,
  selectRole
}) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  const handleRoleSelect = (role: string) => {
    selectRole(role);
    handleCloseMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) && menuPosition) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuPosition]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
      <div className={`relative mt-2 md:mt-0 ${isSearchOpen ? 'block' : 'hidden md:block'} w-full md:w-auto`}>
        <button
          ref={buttonRef}
          onClick={handleOpenMenu}
          className={`inline-flex items-center justify-between px-3 py-2 text-sm rounded-md border w-full md:w-auto ${
            selectedRole ? ' border-gray-300 bg-white text-gray-700' : 'bg-white border-gray-300 text-gray-700'
          }`}
          aria-label="Filtrar por rol"
          aria-expanded={menuPosition !== null}
          id="roleFilter"
        >
          <span className="mr-2">
            {selectedRole ? 
              (selectedRole === OrganizationRoleType.ADMIN ? "Administrador" : 
                selectedRole === OrganizationRoleType.OWNER ? "Owner" : 
                selectedRole === OrganizationRoleType.SUPERVISOR ? "Supervisor" : 
                selectedRole === OrganizationRoleType.HITL ? "HITL" : 
                selectedRole === OrganizationRoleType.USER ? "Usuario" : 
                selectedRole === OrganizationRoleType.ING_PREVENTA ? "Ing. Preventa" : 
                selectedRole === OrganizationRoleType.USR_TECNICO ? "Usuario Técnico" : 
                "Rol desconocido") 
            : "Todos los roles"}
          </span>
          <img src="/mvp/chevron-down.svg" alt="" className="w-4 h-4" aria-hidden="true" />
        </button>
        {menuPosition && (
          <ContextMenu
            x={menuPosition.x}
            y={menuPosition.y}
            onClose={handleCloseMenu}
          >
            <button
              onClick={() => handleRoleSelect("")}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Todos los roles
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.ADMIN)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Administrador
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.OWNER)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Owner
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.SUPERVISOR)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Supervisor
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.HITL)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              HITL
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.USER)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Usuario
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.ING_PREVENTA)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Ing. Preventa
            </button>
            <button
              onClick={() => handleRoleSelect(OrganizationRoleType.USR_TECNICO)}
              className="w-full flex items-start text-sm text-gray-700"
            >
              Usuario Técnico
            </button>
          </ContextMenu>
        )}
      </div>
      {!isSearchOpen && (
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 md:hidden"
          aria-label="Abrir búsqueda"
          aria-expanded={isSearchOpen}
        >
          <img src="/mvp/magnifying-glass.svg" alt="Buscar" className="w-5 h-5 text-gray-500" />
        </button>
      )}
      <div className={`relative ${isSearchOpen ? 'flex' : 'hidden'} md:flex w-full md:w-auto`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" aria-hidden="true">
          <img src="/mvp/magnifying-glass.svg" alt="" className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px] py-2 pl-10 pr-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-[4px]"
          placeholder="Buscar usuario..."
          aria-label="Buscar usuario"
          id="searchInput"
        />
        <button
          onClick={() => {
            if (searchTerm) {
              setSearchTerm("");
            } else if (isSearchOpen) {
              setIsSearchOpen(false);
            }
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label={searchTerm ? "Limpiar búsqueda" : "Cerrar búsqueda"}
        >
          <FiX className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </button>
      </div>

      
    </div>
  );
};

export default UserFilter;
