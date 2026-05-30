import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthLoadingSkeleton from "../components/ui/skeletons/AuthLoadingSkeleton";

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <AuthLoadingSkeleton />;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
