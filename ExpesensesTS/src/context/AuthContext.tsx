import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { LOGIN, REGISTER } from "../api/auth/mutations";
import { useMutation } from "@apollo/client/react";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } });
    
    const { accessToken, user } = data.login;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(accessToken);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    await registerMutation({ variables: { input: { name, email, password } } });
    // 👉 After registration, redirect to login manually (Option 2 from earlier)
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ✅ Ensure state sync with localStorage on reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
