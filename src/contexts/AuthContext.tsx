
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    password: "password123",
    avatar: "/placeholder.svg"
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulating API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && (u as any).password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user as any;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
          toast.success("Đăng nhập thành công!");
          resolve();
        } else {
          toast.error("Email hoặc mật khẩu không đúng!");
          reject(new Error("Email hoặc mật khẩu không đúng!"));
        }
        setLoading(false);
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    // Simulating API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const userExists = mockUsers.some((u) => u.email === email);
        
        if (userExists) {
          toast.error("Email đã được sử dụng!");
          reject(new Error("Email đã được sử dụng!"));
        } else {
          const newUser = {
            id: (mockUsers.length + 1).toString(),
            name,
            email,
            avatar: "/placeholder.svg"
          };
          
          mockUsers.push({ ...newUser, password } as any);
          setCurrentUser(newUser);
          localStorage.setItem("currentUser", JSON.stringify(newUser));
          toast.success("Đăng ký tài khoản thành công!");
          resolve();
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.info("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
