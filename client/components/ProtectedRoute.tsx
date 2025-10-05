import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { toast } from "sonner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.warning("Sign-In is required to get started");
    }
  }, [user, location.pathname]);

  if (!user)
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}
