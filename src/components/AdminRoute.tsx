import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorState from "./ErrorState";
import LoadingScreen from "./LoadingScreen";
import Sidebar from "./Sidebar";

// alleen voor admins geen admin dan naar dashboard
// kon de backend je account niet controleren dan een foutkaart in plaats van stilletjes doorsturen
// navigate https://reactrouter.com/api/components/Navigate
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { authenticatedUser, authErrorDetail, backendLoading, loading, retryAuth } = useAuth();

  if (loading || backendLoading) return <LoadingScreen />;

  if (authErrorDetail) {
    return (
      <Flex bg="bg.muted" minH="100vh" direction={{ base: "column", md: "row" }}>
        <Sidebar />
        <Box flex="1" p={{ base: 4, md: 8 }}>
          <ErrorState error={authErrorDetail} onRetry={retryAuth} />
        </Box>
      </Flex>
    );
  }

  if (!authenticatedUser?.isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
