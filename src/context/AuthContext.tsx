import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth } from "../../config/firebase";
import apiClient, { setOnSessionExpired } from "../api/apiClient";


export interface AuthenticatedUser {
  id: number;
  uid: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  role: "user" | "admin";
  isAdmin: boolean;
}

interface AuthContextValue {
  authenticatedUser: AuthenticatedUser | null; 
  isAuthenticated: boolean;
  loading: boolean; 
  backendLoading: boolean; 
  authError: string | null;
  // de echte fout van api auth voor de foutkaart
  authErrorDetail: unknown;
  // true als je automatisch bent uitgelogd omdat je sessie verlopen is
  sessionExpired: boolean;
  retryAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  
  // https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  
  // https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries
  const uid = firebaseUser?.uid;

  const authQuery = useQuery({
    queryKey: ["auth", uid],
    queryFn: async () => {
      const response = await apiClient.get<AuthenticatedUser>("/auth");
      return response.data;
    },
    
    enabled: !!uid,
  });

  
  // apiclient roept dit aan als de backend ons token niet meer accepteert
  // uitloggen data weggooien en op de loginpagina een melding tonen
  useEffect(() => {
    setOnSessionExpired(() => {
      setSessionExpired(true);
      queryClient.clear();
      signOut(auth);
    });
    return () => setOnSessionExpired(null);
  }, [queryClient]);

  const login = async (email: string, password: string) => {
    setSessionExpired(false);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    setSessionExpired(false);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  };

  const register = async (email: string, password: string, name: string) => {
    setSessionExpired(false);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    //https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation
    await queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const logout = async () => {
    await signOut(auth);
    // alle data van de vorige gebruiker weggooien dus todos users en auth
    queryClient.clear();
  };

  const value: AuthContextValue = {
    authenticatedUser: authQuery.data ?? null,
    isAuthenticated: firebaseUser !== null,
    loading,
    backendLoading: firebaseUser !== null && authQuery.isPending,
    authError: authQuery.error ? "backend kon je Firebase account niet verifieren" : null,
    authErrorDetail: authQuery.error,
    sessionExpired,
    retryAuth: () => authQuery.refetch(),
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
