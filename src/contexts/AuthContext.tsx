import React, { createContext } from 'react';
// Commented out for development - bypass authentication
// import { useCurrentUser, useLogin, useLogout, useRegister } from '../hooks/useAuth';
// import { authService } from '../services/authService';
import type { User, LoginData, RegisterData } from '../types/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isInitialized = true; // Always initialized for development

  // Commented out for development - bypass authentication
  // const { data: user, isLoading: isUserLoading, refetch } = useCurrentUser();
  // const loginMutation = useLogin();
  // const registerMutation = useRegister();
  // const logoutMutation = useLogout();

  // Dummy user data for development
  const dummyUser: User = {
    id: 'dummy-user-1',
    name: 'Admin User',
    email: 'admin@advanzpay.com',
    role: 'Admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  // Commented out authentication initialization for development
  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     if (authService.isAuthenticated()) {
  //       try {
  //         await refetch();
  //       } catch (error) {
  //         console.error('Failed to fetch current user:', error);
  //         // Clear invalid token
  //         localStorage.removeItem('authToken');
  //         localStorage.removeItem('refreshToken');
  //       }
  //     }
  //     setIsInitialized(true);
  //   };

  //   initializeAuth();
  // }, [refetch]);

  // Dummy login function for development
  const login = async (credentials: LoginData) => {
    console.log('Development mode: Login bypassed', credentials);
    // await loginMutation.mutateAsync(credentials);
    return Promise.resolve();
  };

  // Dummy register function for development
  const register = async (userData: RegisterData) => {
    console.log('Development mode: Register bypassed', userData);
    // await registerMutation.mutateAsync(userData);
    return Promise.resolve();
  };

  // Dummy logout function for development
  const logout = async () => {
    console.log('Development mode: Logout bypassed');
    // try {
    //   await logoutMutation.mutateAsync();
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }
    return Promise.resolve();
  };

  const value: AuthContextType = {
    user: dummyUser, // Always use dummy user for development
    isAuthenticated: true, // Always authenticated for development
    isLoading: false, // Never loading for development
    // isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login,
    register,
    logout
  };

  // Show loading spinner while initializing
  if (!isInitialized) {
    return <LoadingSpinner fullScreen message="Initializing..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
