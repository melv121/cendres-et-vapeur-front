import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React from "react";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  element: React.ReactElement;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, element }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRole = user?.role || "GUEST";
  
  console.log("RoleProtectedRoute check:", {
    userRole,
    allowedRoles,
    isAuthenticated,
    user,
    hasAccess: allowedRoles.includes(userRole)
  });

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }
  return element;
};

export default RoleProtectedRoute;