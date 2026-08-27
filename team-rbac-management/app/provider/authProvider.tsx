"use client"
import { createContext, useActionState, useState } from "react";
import { AuthContextType, User } from "../types";

type loginState = {
    success?: boolean,
    user?: User | null;
    error?: string
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // React 19 useActionState for login
  const [loginState, loginAction, isLoadingPending]= useActionState(,initialState)
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
