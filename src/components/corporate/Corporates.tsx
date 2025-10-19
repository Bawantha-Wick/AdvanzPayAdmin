import * as React from 'react';
import constant from '../../constant';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FaRegEdit } from 'react-icons/fa';
import { InputAdornment, TextField, Switch } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import AddCorporate, { type AddCorporateData } from './AddCorporate';
import { corporateService } from '../../services/corporateService';
import type { Corporate } from '../../types/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay';

interface Column {
  id: 'name' | 'employees' | 'accountStatus' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number | boolean | string) => string | boolean | number;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'NAME', minWidth: 200 },
  { id: 'employees', label: 'EMPLOYEES', minWidth: 150 },
  { id: 'accountStatus', label: 'ACCOUNT STATUS', minWidth: 200 },
  { id: 'action', label: 'ACTION', minWidth: 200 }
];

export default function Corporates() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = React.useState<AddCorporateData | undefined>(undefined);

  // API state
  const [employees, setEmployees] = React.useState<Corporate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({ total: 0, pages: 0 });

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch employees when page or search term changes
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await corporateService.getCorps(currentPage, debouncedSearchTerm);
        setEmployees(response.data.corporates);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage, debouncedSearchTerm]);

  const retryFetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await corporateService.getCorps(currentPage, debouncedSearchTerm);
      setEmployees(response.data.corporates);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleOpenAddEmployeeModal = () => {
    setModalMode('add');
    setSelectedEmployee(undefined);
    setOpenEmployeeModal(true);
  };

  const handleOpenEditEmployeeModal = (employee: Corporate) => {
    setModalMode('edit');
    // Convert Corporate to AddCorporateData
    const AddCorporateData: AddCorporateData = {
      id: employee.no.toString(),
      corporationName: '', // Not available in Corporate, use default
      registeredAddress: '', // Not available in Corporate, use default
      registrationId: '', // Not available in Corporate, use default
      payDate: '1', // Not available in Corporate, use default
      name: employee.name,
      jobTitle: 'Manager', // Not available in Corporate, use default
      email: employee.email,
      mobile: employee.mobile,
      salaryLimits: {
        minimum: '10000',
        maximum: '10000',
        percentage: '10000',
        capAmount: '10000'
      },
      ewaConfiguration: {
        maxEwaPercentage: 51,
        adHocTransactionFee: '5',
        enableAutoApproval: true
      },
      feeStructure: {
        manualWithdrawalFee: '3',
        automatedWithdrawalFee: '2'
      },
      accountStatus: employee.status === constant.status.active,
      approveStatus: employee.status === constant.status.active,
      status: (employee.status as 'ACTV' | 'INAC' | 'BLCK') || 'ACTV'
    };
    setSelectedEmployee(AddCorporateData);
    setOpenEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setOpenEmployeeModal(false);
  };

  const handleSaveEmployee = () => {
    // For now, just close the modal and refresh the data
    // In a real application, you would make an API call to save the employee
    handleCloseEmployeeModal();
    retryFetchEmployees(); // Refresh the employee list
  };

  const handleStatusToggle = async (employeeId: number, currentStatus: string) => {
    try {
      // Update the employee status optimistically
      setEmployees((prev) => prev.map((emp) => (emp.no === employeeId ? { ...emp, status: currentStatus === 'active' ? 'inactive' : 'active' } : emp)));

      // TODO: Add API call to update employee status
      // await corporateService.updateEmployeeStatus(employeeId, newStatus);
    } catch (err) {
      // Revert the optimistic update on error
      setEmployees((prev) => prev.map((emp) => (emp.no === employeeId ? { ...emp, status: currentStatus } : emp)));
      setError(err instanceof Error ? err.message : 'Failed to update employee status');
    }
  };

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  // Show error message
  if (error) {
    return <ErrorDisplay error={error} onRetry={retryFetchEmployees} variant="page" />;
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#eefff3ff', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search employees..."
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: '250px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoMdSearch />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<IoAddCircleOutline />}
            onClick={handleOpenAddEmployeeModal}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#0d4829',
              '&:hover': {
                backgroundColor: '#25BD6F'
              }
            }}
          >
            Add New Corporation
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#ffffff' } }}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={employee.no} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {employee.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{employee.count || '20'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={employee.status === 'active'}
                        onChange={() => handleStatusToggle(employee.no, employee.status)}
                        color="success"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#278b56ff'
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#278b56ff'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => handleOpenEditEmployeeModal(employee)}
                        sx={{
                          color: '#0D4829',
                          borderColor: '#0D4829',
                          borderRadius: '4px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#0D4829',
                            backgroundColor: 'rgba(245, 124, 0, 0.04)'
                          }
                        }}
                      >
                        VIEW & EDIT
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            backgroundColor: '#eefff3ff',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: '#888888',
              fontWeight: 400
            }}
          >
            Showing {employees.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, pagination.total)} of {pagination.total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={currentPage === 1}
              onClick={() => handleChangePage(currentPage - 1)}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #eefff3ff',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &lt;
            </Button>
            <Button
              disabled={currentPage >= pagination.pages}
              onClick={() => handleChangePage(currentPage + 1)}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #eefff3ff',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &gt;
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Add/Edit Corporate Modal */}
      <AddCorporate open={openEmployeeModal} onClose={handleCloseEmployeeModal} onSave={handleSaveEmployee} mode={modalMode} employeeData={selectedEmployee} />
    </Box>
  );
}
