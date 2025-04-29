import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoginCredentials, User, InsertUser } from "@shared/schema";

// Create Auth Context
type AuthContextType = {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  isUpdating: boolean;
  loading: boolean;
  authenticated: boolean;
  login: (credentials: LoginCredentials) => void;
  register: (userData: InsertUser) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for consumers to use
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

// The actual implementation with all the logic
function useAuthProvider() {
  const { toast } = useToast();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Check if user is already authenticated
  const { data, isLoading, isError } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
    refetchOnWindowFocus: true,
    retry: false,
  });
  
  useEffect(() => {
    if (!isLoading) {
      setInitialLoadComplete(true);
    }
  }, [isLoading]);
  
  // Login mutation
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/session"], data);
      toast({
        title: "Login successful",
        description: "Welcome back to Wugweb Team",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });
  
  // Register mutation
  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/session"], data);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    },
  });
  
  // Logout mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive",
      });
    },
  });
  
  // Update user mutation
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const res = await apiRequest("PUT", "/api/users/profile", userData);
      return res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/auth/session"], { user: updatedUser });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Unable to update profile",
        variant: "destructive",
      });
    },
  });
  
  return {
    user: data?.user,
    isLoading,
    isError,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    isUpdating,
    loading: isLoading && !initialLoadComplete,
    authenticated: !!data?.user,
    login,
    register,
    logout,
    updateUser,
  };
}