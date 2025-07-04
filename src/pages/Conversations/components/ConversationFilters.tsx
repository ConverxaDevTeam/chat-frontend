import React, { useState, useRef, useEffect } from "react";
import { ConversationFilters } from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { IDepartment } from "@interfaces/departments";
import { getDepartments } from "@services/department";
import { useAppSelector } from "@store/hooks";
import ContextMenu from "@components/ContextMenu";

interface ConversationFiltersProps {
  filters: ConversationFilters;
  onUpdateFilter: (
    key: keyof ConversationFilters,
    value:
      | string
      | boolean
      | number
      | IntegrationType
      | "ia"
      | "pendiente"
      | "asignado"
      | undefined
  ) => void;
  onClearFilters: () => void;
  onClearFilter: (key: keyof ConversationFilters) => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  isLoading?: boolean;
}

const ConversationFiltersComponent: React.FC<ConversationFiltersProps> = ({
  filters,
  onUpdateFilter,
  onClearFilters,
  onClearFilter,
  hasActiveFilters,
  activeFiltersCount,
  isLoading = false,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
  const departmentRef = useRef<HTMLButtonElement>(null);
  const channelRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!organizationId) return;

      setLoadingDepartments(true);
      try {
        const departmentsData = await getDepartments(organizationId);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [organizationId]);

  const handleMenuOpen = (
    type: "department" | "channel" | "status",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom + 5,
    });

    setDepartmentMenuOpen(type === "department");
    setChannelMenuOpen(type === "channel");
    setStatusMenuOpen(type === "status");
  };

  const handleMenuClose = () => {
    setDepartmentMenuOpen(false);
    setChannelMenuOpen(false);
    setStatusMenuOpen(false);
  };

  const getChannelLabel = (type?: IntegrationType) => {
    switch (type) {
      case IntegrationType.CHAT_WEB:
        return "Web Chat";
      case IntegrationType.WHATSAPP:
        return "WhatsApp";
      case IntegrationType.MESSENGER:
        return "Messenger";
      case IntegrationType.SLACK:
        return "Slack";
      case IntegrationType.WHATSAPP_MANUAL:
        return "WhatsApp Manual";
      case IntegrationType.MESSENGER_MANUAL:
        return "Messenger Manual";
      default:
        return "Todos los canales";
    }
  };

  const getStatusLabel = () => {
    switch (filters.status) {
      case "ia":
        return "IA";
      case "pendiente":
        return "Pendiente";
      case "asignado":
        return "Asignado";
      default:
        return "Todos los estados";
    }
  };

  const getChannelIcon = (type?: IntegrationType) => {
    switch (type) {
      case IntegrationType.CHAT_WEB:
        return "/mvp/globe.svg";
      case IntegrationType.WHATSAPP:
        return "/mvp/whatsapp.svg";
      case IntegrationType.MESSENGER:
        return "/mvp/messenger.svg";
      case IntegrationType.SLACK:
        return "/mvp/slack.svg";
      case IntegrationType.MESSENGER_MANUAL:
        return "/mvp/messenger-gray.svg";
      case IntegrationType.WHATSAPP_MANUAL:
        return "/mvp/whatsapp.svg";
      default:
        return "/mvp/chat-dots.svg";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
      {/* Mobile Filter Toggle */}
      <div className="flex lg:hidden justify-between items-center mb-4">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md"
        >
          <img src="/mvp/sliders-vertical.svg" alt="" className="w-4 h-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Filters Container */}
      <div
        className={`${isFiltersOpen ? "block" : "hidden"} lg:block space-y-4`}
      >
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <img
              src="/mvp/magnifying-glass-gray.svg"
              alt=""
              className="w-5 h-5 text-gray-500"
            />
          </div>
          <input
            type="text"
            value={filters.search || ""}
            onChange={e => onUpdateFilter("search", e.target.value)}
            className="w-full md:w-[250px] lg:w-[300px] py-2 pl-10 pr-4 text-sm bg-[#FCFCFC] border border-[#DBEAF2] rounded-[4px] focus:ring-[#DBEAF2] focus:border-[#DBEAF4]"
            placeholder="Buscar por nombre, email o teléfono"
            disabled={isLoading}
          />
          {filters.search && (
            <button
              onClick={() => onClearFilter("search")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <img
                src="/mvp/vector-x.svg"
                alt=""
                className="w-4 h-4 text-gray-500"
              />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-4 items-start md:items-center">
          {/* Department Filter */}
          <div className="relative">
            <button
              ref={departmentRef}
              onClick={e => handleMenuOpen("department", e)}
              className="inline-flex items-center justify-between px-3 py-2 text-sm rounded-md border bg-[#FCFCFC] border-[#DBEAF2] text-gray-700 min-w-[120px] md:min-w-[140px] lg:min-w-[150px]"
              disabled={isLoading || loadingDepartments}
            >
              <span className="mr-2">
                {filters.department || "Todos los departamentos"}
              </span>
              <img src="/mvp/chevron-down.svg" alt="" className="w-4 h-4" />
            </button>
            {departmentMenuOpen && (
              <ContextMenu position={menuPosition} onClose={handleMenuClose}>
                <button
                  onClick={() => {
                    onClearFilter("department");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700"
                >
                  Todos los departamentos
                </button>
                {departments.map(department => (
                  <button
                    key={department.id}
                    onClick={() => {
                      onUpdateFilter("department", department.name);
                      handleMenuClose();
                    }}
                    className="w-full text-left text-sm text-gray-700"
                  >
                    {department.name}
                  </button>
                ))}
              </ContextMenu>
            )}
          </div>

          {/* Channel Filter */}
          <div className="relative">
            <button
              ref={channelRef}
              onClick={e => handleMenuOpen("channel", e)}
              className="inline-flex items-center justify-between px-3 py-2 text-sm rounded-md border bg-[#FCFCFC] border-[#DBEAF2] text-gray-700 min-w-[120px] md:min-w-[140px] lg:min-w-[150px]"
              disabled={isLoading}
            >
              <span className="mr-2">
                {getChannelLabel(filters.integrationType)}
              </span>
              <img src="/mvp/chevron-down.svg" alt="" className="w-4 h-4" />
            </button>
            {channelMenuOpen && (
              <ContextMenu position={menuPosition} onClose={handleMenuClose}>
                <button
                  onClick={() => {
                    onClearFilter("integrationType");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700"
                >
                  Todos los canales
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("integrationType", IntegrationType.CHAT_WEB);
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/globe.svg" alt="" className="w-4 h-4" />
                  Web Chat
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("integrationType", IntegrationType.WHATSAPP);
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/whatsapp.svg" alt="" className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter(
                      "integrationType",
                      IntegrationType.MESSENGER
                    );
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/messenger.svg" alt="" className="w-4 h-4" />
                  Messenger
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("integrationType", IntegrationType.SLACK);
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/slack.svg" alt="" className="w-4 h-4" />
                  Slack
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter(
                      "integrationType",
                      IntegrationType.WHATSAPP_MANUAL
                    );
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/whatsapp.svg" alt="" className="w-4 h-4" />
                  WhatsApp Manual
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter(
                      "integrationType",
                      IntegrationType.MESSENGER_MANUAL
                    );
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img
                    src="/mvp/messenger-gray.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                  Messenger Manual
                </button>
              </ContextMenu>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              ref={statusRef}
              onClick={e => handleMenuOpen("status", e)}
              className="inline-flex items-center justify-between px-3 py-2 text-sm rounded-md border bg-[#FCFCFC] border-[#DBEAF2] text-gray-700 min-w-[120px] md:min-w-[140px] lg:min-w-[150px]"
              disabled={isLoading}
            >
              <span className="mr-2">{getStatusLabel()}</span>
              <img src="/mvp/chevron-down.svg" alt="" className="w-4 h-4" />
            </button>
            {statusMenuOpen && (
              <ContextMenu position={menuPosition} onClose={handleMenuClose}>
                <button
                  onClick={() => {
                    onClearFilter("status");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700"
                >
                  Todos los estados
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("status", "ia");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/bot.svg" alt="" className="w-4 h-4" />
                  IA
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("status", "pendiente");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/circle-alert.svg" alt="" className="w-4 h-4" />
                  Pendiente
                </button>
                <button
                  onClick={() => {
                    onUpdateFilter("status", "asignado");
                    handleMenuClose();
                  }}
                  className="w-full text-left text-sm text-gray-700 flex items-center gap-2"
                >
                  <img src="/mvp/users.svg" alt="" className="w-4 h-4" />
                  Asignado
                </button>
              </ContextMenu>
            )}
          </div>

          {/* Date Filters */}
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={e => onUpdateFilter("dateFrom", e.target.value)}
              className="px-3 py-2 text-sm bg-[#FCFCFC] border border-[#DBEAF2] rounded-[4px] focus:ring-[#DBEAF2] focus:border-[#DBEAF4]"
              disabled={isLoading}
            />
            <span className="flex items-center text-gray-500">-</span>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={e => onUpdateFilter("dateTo", e.target.value)}
              className="px-3 py-2 text-sm bg-[#FCFCFC] border border-[#DBEAF2] rounded-[4px] focus:ring-[#DBEAF2] focus:border-[#DBEAF4]"
              disabled={isLoading}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
              disabled={isLoading}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {filters.search && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                <span>Búsqueda: {filters.search}</span>
                <button onClick={() => onClearFilter("search")}>
                  <img src="/mvp/vector-x.svg" alt="" className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.department && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                <span>{filters.department}</span>
                <button onClick={() => onClearFilter("department")}>
                  <img src="/mvp/vector-x.svg" alt="" className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.integrationType && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                <img
                  src={getChannelIcon(filters.integrationType)}
                  alt=""
                  className="w-3 h-3"
                />
                <span>{getChannelLabel(filters.integrationType)}</span>
                <button onClick={() => onClearFilter("integrationType")}>
                  <img src="/mvp/vector-x.svg" alt="" className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.status && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                <span>{getStatusLabel()}</span>
                <button onClick={() => onClearFilter("status")}>
                  <img src="/mvp/vector-x.svg" alt="" className="w-3 h-3" />
                </button>
              </div>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                <img src="/mvp/calendar.svg" alt="" className="w-3 h-3" />
                <span>
                  Fechas: {filters.dateFrom || "..."} -{" "}
                  {filters.dateTo || "..."}
                </span>
                <button
                  onClick={() => {
                    onClearFilter("dateFrom");
                    onClearFilter("dateTo");
                  }}
                >
                  <img src="/mvp/vector-x.svg" alt="" className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationFiltersComponent;
