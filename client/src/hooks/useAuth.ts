import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, LoginCredentials, InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
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
        description: error.message || "Invalid username or password",
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
        description: "Welcome to Wugweb Team",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
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
    loading: isLoading || !initialLoadComplete,
    isError,
    login,
    logout,
    register,
    updateUser,
    isLoggingIn,
    isLoggingOut,
    isRegistering,
    isUpdating,
  };
}
