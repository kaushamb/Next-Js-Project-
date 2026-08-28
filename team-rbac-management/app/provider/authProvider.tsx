"use client";
import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { AuthContextType, Role, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState = {
  success?: boolean;
  user?: User | null;
  error?: string;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // React 19 useActionState for login
  const [loginState, loginAction, isLoadingPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const data = (await apiClient.login(email, password)) as unknown as {user: User};
        setUser(data.user);
        return { success: true, user: data.user };
      } catch (error) {
        console.log("Error", error);
        return {
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    {
      error: undefined,
      success: undefined,
      user: undefined,
    } as LoginState,
  );

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.log("Logout error :", error);
    }
  };

  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHierarchy = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData || null);
      } catch (error) {
        console.log("failed to load user: ", error);
      }
    };
    loadUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =()=>{
    const context= useContext(AuthContext);
    if(context === undefined){
        throw new Error(`useAuth must be used within an AuthProvider`)
    }
    return context;
}

export default AuthProvider;