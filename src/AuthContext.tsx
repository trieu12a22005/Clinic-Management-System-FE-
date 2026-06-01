import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import authApi from "./apis/auth";

type User = {
  accountID: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleDescription: string;
  avatar?: string;
  permissions?: string[];
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Bảo vệ ứng dụng khỏi sập do cache bị lỗi object role
        if (typeof parsedUser.role === 'object' && parsedUser.role !== null) {
          parsedUser.role = parsedUser.role.roleName || "Unknown";
        }
        return parsedUser;
      }
      return null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  });

  // Tự động tải lại thông tin User (kèm permissions mới nhất) mỗi khi F5
  useEffect(() => {
    if (user) {
      authApi.getProfile()
        .then(res => {
          if (res.user) {
             setUser(res.user);
             localStorage.setItem("user", JSON.stringify(res.user));
          }
        })
        .catch(err => {
          console.error("Failed to refresh profile on load", err);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};