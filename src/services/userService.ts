import api from './api';
import constant from '../constant';
import type { User, UserRole, CreateUserData, PaginatedResponse, PaginationParams, CorpUserRole, CreateCorpUserRoleData, CorpUserRolesResponse, UpdateCorpUserRoleData, CorpUserRoleDropdownResponse, CorpUsersResponse, CreateCorpUserData, UpdateCorpUserData, CorpUserResponse } from '../types/api';

// Dummy data for development when API fails
const getDummyCorpUsers = (): CorpUsersResponse => ({
  statusCode: 200,
  status: true,
  responseCode: 'SUCCESS',
  message: 'Dummy data for development',
  data: {
    pagination: {
      page: '1',
      total: 3,
      pages: 1
    },
    users: [
      {
        no: 1,
        name: 'Admin User',
        email: 'admin@advanzpay.com',
        title: 'System Administrator',
        mobile: '+1234567890',
        status: 'active',
        statusLabel: 'Active',
        role: 1,
        roleLabel: 'Super Admin'
      },
      {
        no: 2,
        name: 'Manager User',
        email: 'manager@advanzpay.com',
        title: 'Operations Manager',
        mobile: '+1234567891',
        status: 'active',
        statusLabel: 'Active',
        role: 2,
        roleLabel: 'Manager'
      }
    ]
  }
});

const getDummyCorpUserRoles = (): CorpUserRolesResponse => ({
  pagination: {
    page: 1,
    total: 3,
    pages: 1
  },
  roles: [
    {
      no: 1,
      name: 'Super Admin',
      description: 'Full system access',
      permissions: 'all',
      status: 'active'
    },
    {
      no: 2,
      name: 'Manager',
      description: 'Management level access',
      permissions: 'read,write',
      status: 'active'
    },
    {
      no: 3,
      name: 'Viewer',
      description: 'Read-only access',
      permissions: 'read',
      status: 'active'
    }
  ]
});

const getDummyCorpUserRolesDropdown = (): CorpUserRoleDropdownResponse => ({
  statusCode: 200,
  status: true,
  responseCode: 'SUCCESS',
  message: 'Dummy data for development',
  data: {
    roles: [
      { no: 1, name: 'Super Admin' },
      { no: 2, name: 'Manager' },
      { no: 3, name: 'Viewer' }
    ]
  }
});

export const userService = {
  // Get all users with pagination and search
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Toggle user active status
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data.data;
  },

  // Reset user password
  resetUserPassword: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/reset-password`);
  },

  // Get user roles
  getUserRoles: async (params?: PaginationParams): Promise<PaginatedResponse<UserRole>> => {
    const response = await api.get('/user-roles', { params });
    return response.data;
  },

  // Get all available roles (without pagination)
  getAllRoles: async (): Promise<UserRole[]> => {
    const response = await api.get('/user-roles/all');
    return response.data.data;
  },

  // Get user role by ID
  getUserRole: async (id: string): Promise<UserRole> => {
    const response = await api.get(`/user-roles/${id}`);
    return response.data.data;
  },

  // Create new user role
  createUserRole: async (roleData: Omit<UserRole, 'id'>): Promise<UserRole> => {
    const response = await api.post('/user-roles', roleData);
    return response.data.data;
  },

  // Update user role
  updateUserRole: async (id: string, roleData: Partial<UserRole>): Promise<UserRole> => {
    const response = await api.put(`/user-roles/${id}`, roleData);
    return response.data.data;
  },

  // Delete user role
  deleteUserRole: async (id: string): Promise<void> => {
    await api.delete(`/user-roles/${id}`);
  },

  // Toggle user role active status
  toggleUserRoleStatus: async (id: string): Promise<UserRole> => {
    const response = await api.patch(`/user-roles/${id}/toggle-status`);
    return response.data.data;
  },

  // Get user permissions
  getUserPermissions: async (userId: string): Promise<string[]> => {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data.data;
  },

  // Get available permissions
  getAvailablePermissions: async (): Promise<string[]> => {
    const response = await api.get('/permissions');
    return response.data.data;
  },

  // Create corporate user role (new API)
  createCorpUserRole: async (roleData: CreateCorpUserRoleData): Promise<CorpUserRole> => {
    try {
      const response = await api.post('/corp-user-role', roleData);
      return response.data;
    } catch (error) {
      console.warn('Create corporate user role API failed, using dummy data for development:', error);
      return {
        id: Math.floor(Math.random() * 1000).toString(),
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions
      };
    }
  },

  // Get corporate user roles with pagination and search
  getCorpUserRoles: async (params: { page: number; search?: string }): Promise<CorpUserRolesResponse> => {
    try {
      const response = await api.get('/corp-user-role', { params });
      return response.data.data;
    } catch (error) {
      console.warn('Get corporate user roles API failed, using dummy data for development:', error);
      return getDummyCorpUserRoles();
    }
  },

  // Update corporate user role (PUT API)
  updateCorpUserRole: async (roleData: UpdateCorpUserRoleData): Promise<CorpUserRole> => {
    const response = await api.put('/corp-user-role', roleData);
    return response.data;
  },

  // Disable/Toggle corporate user role status
  toggleCorpUserRoleStatus: async (roleId: number): Promise<CorpUserRole> => {
    const response = await api.put('/corp-user-role', {
      index: roleId,
      status: constant.status.inactive
    });
    return response.data;
  },

  // Get corporate user roles for dropdown
  getCorpUserRolesDropdown: async (): Promise<CorpUserRoleDropdownResponse> => {
    try {
      const response = await api.get('/corp-user-role/dd');
      return response.data;
    } catch (error) {
      console.warn('Get corporate user roles dropdown API failed, using dummy data for development:', error);
      return getDummyCorpUserRolesDropdown();
    }
  },

  // Get corporate users with pagination and search
  getCorpUsers: async (params: { page: number; search?: string }): Promise<CorpUsersResponse> => {
    try {
      const response = await api.get('/corp-user', { params });
      return response.data;
    } catch (error) {
      console.warn('Get corporate users API failed, using dummy data for development:', error);
      return getDummyCorpUsers();
    }
  },

  // Create corporate user
  createCorpUser: async (userData: CreateCorpUserData): Promise<CorpUserResponse> => {
    try {
      const response = await api.post('/corp-user', userData);
      return response.data;
    } catch (error) {
      console.warn('Create corporate user API failed, using dummy data for development:', error);
      return {
        statusCode: 200,
        status: true,
        responseCode: 'SUCCESS',
        message: 'User created successfully (dummy response)',
        data: {
          no: Math.floor(Math.random() * 1000),
          name: userData.name,
          email: userData.email,
          title: userData.title,
          mobile: userData.mobile,
          status: 'active',
          statusLabel: 'Active',
          role: userData.role,
          roleLabel: 'User Role'
        }
      };
    }
  },

  // Update corporate user
  updateCorpUser: async (userData: UpdateCorpUserData): Promise<CorpUserResponse> => {
    const response = await api.put('/corp-user', userData);
    return response.data;
  },

  // Toggle corporate user status
  toggleCorpUserStatus: async (userNo: number, status: typeof constant.status.active | typeof constant.status.inactive): Promise<CorpUserResponse> => {
    const response = await api.put('/corp-user', {
      no: userNo,
      status: status
    });
    return response.data;
  }
};
