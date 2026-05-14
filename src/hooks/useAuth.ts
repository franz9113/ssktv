import { useState, useCallback } from "react";

export type Role = "admin" | "staff" | "super-admin" | null;

export function useAuth() {
  const [userRole, setUserRole] = useState<Role>(() => {
    return localStorage.getItem("ktv_session_role") as Role;
  });

  const login = useCallback((role: Role) => {
    if (role) {
      localStorage.setItem("ktv_session_role", role);
    } else {
      localStorage.removeItem("ktv_session_role");
    }
    setUserRole(role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ktv_session_role");
    setUserRole(null);
  }, []);

  const isAdmin = userRole === "admin" || userRole === "super-admin";
  const isSuperAdmin = userRole === "super-admin";

  return { userRole, isAdmin, isSuperAdmin, login, logout };
}