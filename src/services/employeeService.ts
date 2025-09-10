import api from './api';
import type { Employee, CreateEmployeeData, CreateCorpEmployeeData, UpdateCorpEmployeeData, EmployeeRequest, UpdateRequestStatusData, PaginatedResponse, PaginationParams, Transaction, CorpEmployeesResponse, CorpEmployee } from '../types/api';

// Dummy data for development when API fails
const getDummyCorpEmployees = (): CorpEmployeesResponse => ({
  statusCode: 200,
  status: true,
  responseCode: 'SUCCESS',
  message: 'Dummy data for development',
  data: {
    pagination: {
      total: 5,
      pages: 1
    },
    employees: [
      {
        no: 1,
        name: 'John Doe',
        email: 'john.doe@company.com',
        mobile: '+1234567890',
        basicSalAmt: '50000',
        accNo: '123456789',
        accName: 'John Doe',
        accBank: 'ABC Bank',
        accBranch: 'Main Branch',
        status: 'active',
        statusLabel: 'Active',
        apStatus: 'approved',
        apStatusLabel: 'Approved'
      },
      {
        no: 2,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        mobile: '+1234567891',
        basicSalAmt: '45000',
        accNo: '123456790',
        accName: 'Jane Smith',
        accBank: 'XYZ Bank',
        accBranch: 'Central Branch',
        status: 'active',
        statusLabel: 'Active',
        apStatus: 'pending',
        apStatusLabel: 'Pending'
      }
    ]
  }
});

const getDummyEmployeeRequests = (): PaginatedResponse<EmployeeRequest> => ({
  data: [
    {
      requestId: 'req-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      requestedDate: new Date().toISOString(),
      requestedType: 'Advance',
      amount: '5000',
      processStatus: 'Pending',
      remark: 'Emergency medical expenses'
    },
    {
      requestId: 'req-002',
      employeeId: 'emp-002',
      employeeName: 'Jane Smith',
      requestedDate: new Date(Date.now() - 86400000).toISOString(),
      requestedType: 'Leave',
      processStatus: 'Approved',
      processedBy: 'admin-001',
      processedDate: new Date().toISOString(),
      remark: 'Personal reasons'
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1
  }
});

export const employeeService = {
  // Get corporate employees with pagination and search (new API)
  getCorpEmployees: async (page: number = 1, search: string = ''): Promise<CorpEmployeesResponse> => {
    try {
      const response = await api.get('/corp-emp', {
        params: { page, search }
      });
      return response.data;
    } catch (error) {
      console.warn('Get corporate employees API failed, using dummy data for development:', error);
      return getDummyCorpEmployees();
    }
  },

  // Get all employees with pagination and search
  getEmployees: async (params?: PaginationParams): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get employee by ID
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  // Create new employee
  createEmployee: async (employee: CreateEmployeeData): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data.data;
  },

  // Create new corporate employee
  createCorpEmployee: async (employee: CreateCorpEmployeeData): Promise<CorpEmployee> => {
    try {
      const response = await api.post('/corp-emp', employee);
      return response.data;
    } catch (error) {
      console.warn('Create corporate employee API failed, using dummy data for development:', error);
      return {
        no: Math.floor(Math.random() * 1000),
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        basicSalAmt: employee.basicSalAmt.toString(),
        accNo: employee.accNo,
        accName: employee.accName,
        accBank: employee.accBank,
        accBranch: employee.accBranch,
        status: 'active',
        statusLabel: 'Active',
        apStatus: 'pending',
        apStatusLabel: 'Pending'
      };
    }
  },

  // Update corporate employee
  updateCorpEmployee: async (employee: UpdateCorpEmployeeData): Promise<CorpEmployee> => {
    try {
      const response = await api.put('/corp-emp', employee);
      return response.data;
    } catch (error) {
      console.warn('Update corporate employee API failed, using dummy data for development:', error);
      return {
        no: employee.no,
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        basicSalAmt: employee.basicSalAmt.toString(),
        accNo: employee.accNo,
        accName: employee.accName,
        accBank: employee.accBank,
        accBranch: employee.accBranch,
        status: employee.status,
        statusLabel: employee.status === 'active' ? 'Active' : 'Inactive',
        apStatus: 'approved',
        apStatusLabel: 'Approved'
      };
    }
  },

  // Update employee
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  // Toggle employee active status
  toggleEmployeeStatus: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/toggle-status`);
    return response.data.data;
  },

  // Verify employee
  verifyEmployee: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/verify`);
    return response.data.data;
  },

  // Get employee requests
  getEmployeeRequests: async (params?: PaginationParams): Promise<PaginatedResponse<EmployeeRequest>> => {
    try {
      const response = await api.get('/employee-requests', { params });
      return response.data;
    } catch (error) {
      console.warn('Get employee requests API failed, using dummy data for development:', error);
      return getDummyEmployeeRequests();
    }
  },

  // Get employee request by ID
  getEmployeeRequest: async (requestId: string): Promise<EmployeeRequest> => {
    const response = await api.get(`/employee-requests/${requestId}`);
    return response.data.data;
  },

  // Update request status
  updateRequestStatus: async (requestId: string, statusData: UpdateRequestStatusData): Promise<EmployeeRequest> => {
    const response = await api.patch(`/employee-requests/${requestId}/status`, {
      ...statusData,
      processedDate: new Date().toISOString()
    });
    return response.data.data;
  },

  // Approve request
  approveRequest: async (requestId: string, processedBy: string, remark?: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'Approved',
      processedBy,
      remark
    });
  },

  // Reject request
  rejectRequest: async (requestId: string, processedBy: string, remark?: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'Rejected',
      processedBy,
      remark
    });
  },

  // Get employee transactions
  getEmployeeTransactions: async (employeeId: string, params?: PaginationParams): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get(`/employees/${employeeId}/transactions`, { params });
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async (): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    verifiedEmployees: number;
    pendingRequests: number;
  }> => {
    const response = await api.get('/employees/stats');
    return response.data.data;
  }
};
