import api from './api';
import type { User, LoginData, RegisterData, AuthResponse } from '../types/api';

// Dummy data for development when API fails
const getDummyUser = (): User => ({
  id: 'dummy-user-1',
  name: 'Admin User',
  email: 'admin@advanzpay.com',
  role: 'Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
});

const getDummyAuthResponse = (): AuthResponse => ({
  user: getDummyUser(),
  token: 'dummy-token-' + Date.now(),
  refreshToken: 'dummy-refresh-token-' + Date.now()
});

export const authService = {
  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token, refreshToken } = response.data.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return { user, token, refreshToken };
    } catch (error) {
      console.warn('Login API failed, using dummy data for development:', error);
      const dummyResponse = getDummyAuthResponse();

      // Store dummy tokens in localStorage
      localStorage.setItem('authToken', dummyResponse.token);
      if (dummyResponse.refreshToken) {
        localStorage.setItem('refreshToken', dummyResponse.refreshToken);
      }

      return dummyResponse;
    }
  },

  // Register user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token, refreshToken } = response.data.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return { user, token, refreshToken };
    } catch (error) {
      console.warn('Register API failed, using dummy data for development:', error);
      const dummyResponse = getDummyAuthResponse();

      // Store dummy tokens in localStorage
      localStorage.setItem('authToken', dummyResponse.token);
      if (dummyResponse.refreshToken) {
        localStorage.setItem('refreshToken', dummyResponse.refreshToken);
      }

      return dummyResponse;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      console.warn('Get current user API failed, using dummy data for development:', error);
      return getDummyUser();
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      const { user, token, refreshToken: newRefreshToken } = response.data.data;

      // Update tokens in localStorage
      localStorage.setItem('authToken', token);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return { user, token, refreshToken: newRefreshToken };
    } catch (error) {
      console.warn('Refresh token API failed, using dummy data for development:', error);
      const dummyResponse = getDummyAuthResponse();

      // Update tokens in localStorage
      localStorage.setItem('authToken', dummyResponse.token);
      if (dummyResponse.refreshToken) {
        localStorage.setItem('refreshToken', dummyResponse.refreshToken);
      }

      return dummyResponse;
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification', { email });
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data.data;
    } catch (error) {
      console.warn('Update profile API failed, using dummy data for development:', error);
      return { ...getDummyUser(), ...userData };
    }
  },

  // Check if user is authenticated - always true for development\n  isAuthenticated: (): boolean => {\n    return true; // Always authenticated for development\n    // return !!localStorage.getItem('authToken'); // Commented out for development\n  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  }
};
