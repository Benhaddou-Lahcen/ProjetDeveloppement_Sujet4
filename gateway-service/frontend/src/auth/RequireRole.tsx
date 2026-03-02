import { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface Props {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireRole = ({ role, children, fallback }: Props) => {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return <>{fallback ?? <p>Accès refusé.</p>}</>;
  }

  return <>{children}</>;
};

