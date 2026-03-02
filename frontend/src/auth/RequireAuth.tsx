import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("[v0] RequireAuth check:", { isAuthenticated, path: location.pathname });

  if (!isAuthenticated) {
    console.log("[v0] RequireAuth: redirecting to /login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("[v0] RequireAuth: authenticated, rendering children");
  return <>{children}</>;
};

