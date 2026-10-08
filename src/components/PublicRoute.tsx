import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

// alleen voor uitgelogde gebruikers zoals de login pagina al ingelogd dan naar de pagina
// die je eerst wilde openen uit state from van privateroute anders naar dashboard
// navigate https://reactrouter.com/api/components/Navigate
export default function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to={from} replace />;

  return children;
}
