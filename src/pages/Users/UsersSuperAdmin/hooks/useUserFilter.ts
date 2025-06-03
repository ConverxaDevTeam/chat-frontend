import { useState, useMemo, useEffect } from "react";
import { IUserApi } from "../../UsersOrganization";

/**
 * Hook personalizado para filtrar usuarios por término de búsqueda y rol
 * @param users
 */
const useUserFilter = (users: IUserApi[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.email?.toLowerCase().includes(searchTermLower) ||
          (user.first_name &&
            user.first_name.toLowerCase().includes(searchTermLower)) ||
          (user.last_name &&
            user.last_name.toLowerCase().includes(searchTermLower)) ||
          user.userOrganizations.some(org =>
            org.organization?.name?.toLowerCase().includes(searchTermLower)
          )
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(user =>
        user.userOrganizations.some(org => org.role === selectedRole)
      );
    }

    return filtered;
  }, [users, searchTerm, selectedRole]);

  useEffect(() => {}, [searchTerm, selectedRole]);

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const selectRole = (role: string) => {
    setSelectedRole(role === selectedRole ? "" : role);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    isSearchOpen,
    setIsSearchOpen,
    filteredUsers,
    toggleSearch,
    clearSearch,
    selectRole,
  };
};

export default useUserFilter;
