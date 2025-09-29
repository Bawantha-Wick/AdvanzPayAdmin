import * as React from 'react';
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
import { InputAdornment, TextField, Switch } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import AddCorporateUser, { type CorporateUserFormData } from './AddCorporateUser';

interface Column {
  id: 'name' | 'email' | 'blockStatus' | 'accountStatus' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'NAME', minWidth: 200 },
  { id: 'email', label: 'EMAIL', minWidth: 200 },
  { id: 'blockStatus', label: 'BLOCK STATUS', minWidth: 150 },
  { id: 'accountStatus', label: 'ACCOUNT STATUS', minWidth: 150 },
  { id: 'action', label: 'ACTION', minWidth: 150 }
];

interface CorporateUser {
  name: string;
  email: string;
  blockStatus: 'Active' | 'Inactive';
  accountStatus: 'Yes' | 'No';
}

function createData(name: string, email: string, blockStatus: 'Active' | 'Inactive', accountStatus: 'Yes' | 'No'): CorporateUser {
  return {
    name,
    email,
    blockStatus,
    accountStatus
  };
}

const initialRows = [
  createData('Christine Brooks', 'dummy@gmail.com', 'Active', 'No'),
  createData('Rosie Pearson', 'rosie@gmail.com', 'Inactive', 'Yes'),
  createData('Darrell Caldwell', 'darrell@gmail.com', 'Active', 'No'),
  createData('Gilbert Johnston', 'gilbert@gmail.com', 'Active', 'No'),
  createData('Alan Cain', 'alan@gmail.com', 'Active', 'No'),
  createData('Alfred Murray', 'alfred@gmail.com', 'Active', 'No')
];

export default function EmployeeRequests() {
  const [rows, setRows] = React.useState<CorporateUser[]>(initialRows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<CorporateUserFormData | undefined>(undefined);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = searchTerm === '' || Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = filterStatus === 'All' || (filterStatus === 'Active' && row.blockStatus === 'Active') || (filterStatus === 'Inactive' && row.blockStatus === 'Inactive') || (filterStatus === 'Account Yes' && row.accountStatus === 'Yes') || (filterStatus === 'Account No' && row.accountStatus === 'No');

      return matchesSearch && matchesFilter;
    });
  }, [rows, searchTerm, filterStatus]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedUser(undefined);
    setOpenModal(true);
  };

  const handleOpenEditModal = (user: CorporateUser) => {
    setModalMode('edit');
    setSelectedUser({
      name: user.name,
      jobTitle: 'Job title', // Default job title since it's not in the table data
      email: user.email,
      mobile: '0789652805', // Default mobile number as shown in screenshot
      accountStatus: user.blockStatus, // blockStatus from table becomes accountStatus in modal
      blockStatus: user.accountStatus === 'Yes' ? 'Yes' : 'No' // accountStatus from table becomes blockStatus in modal
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveUser = (userData: CorporateUserFormData) => {
    console.log('Saving user data:', userData);
    // Here you would typically make an API call to save the user
    // For now, just log the data and close the modal
    setOpenModal(false);
  };

  const handleFilterClick = (status: string) => {
    setFilterStatus(status);
  };

  const handleToggleBlockStatus = (index: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...newRows[index],
        blockStatus: newRows[index].blockStatus === 'Active' ? 'Inactive' : 'Active'
      };
      return newRows;
    });
  };

  const handleToggleAccountStatus = (index: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...newRows[index],
        accountStatus: newRows[index].accountStatus === 'Yes' ? 'No' : 'Yes'
      };
      return newRows;
    });
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#e5fff1ff', borderRadius: 2, p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', lg: 'center' },
          mb: 2,
          gap: { xs: 2, lg: 0 }
        }}
      >
        <TextField
          placeholder="Search users..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', lg: '250px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IoMdSearch />
                </InputAdornment>
              )
            }
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}>
            Filtered by
          </Typography>
          <Button
            variant={filterStatus === 'All' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('All')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'All' ? '#20bf6c' : 'transparent',
              color: filterStatus === 'All' ? 'white' : 'black',
              borderColor: '#eefff3ff',
              '&:hover': {
                backgroundColor: filterStatus === 'All' ? '#0d4829' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'All' ? '#0d4829' : '#eefff3ff'
              }
            }}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Active' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Active')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Active' ? '#20bf6c' : 'transparent',
              color: filterStatus === 'Active' ? 'white' : 'black',
              borderColor: '#eefff3ff',
              '&:hover': {
                backgroundColor: filterStatus === 'Active' ? '#0d4829' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Active' ? '#0d4829' : '#eefff3ff'
              }
            }}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'Inactive' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Inactive')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Inactive' ? '#20bf6c' : 'transparent',
              color: filterStatus === 'Inactive' ? 'white' : 'black',
              borderColor: '#eefff3ff',
              '&:hover': {
                backgroundColor: filterStatus === 'Inactive' ? '#0d4829' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Inactive' ? '#0d4829' : '#eefff3ff'
              }
            }}
          >
            Inactive
          </Button>
          <Button
            variant="contained"
            startIcon={<IoAddCircleOutline />}
            onClick={handleOpenAddModal}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#20bf6c',
              color: 'white',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#0d4829'
              }
            }}
          >
            Add Corporate User
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
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={row.blockStatus === 'Active'}
                        onChange={() => handleToggleBlockStatus(page * rowsPerPage + index)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#20bf6c'
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#20bf6c'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                        {row.blockStatus}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={row.accountStatus === 'Yes'}
                        onChange={() => handleToggleAccountStatus(page * rowsPerPage + index)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#20bf6c'
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#20bf6c'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                        {row.accountStatus}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FaRegEdit />}
                      onClick={() => handleOpenEditModal(row)}
                      sx={{
                        color: '#20bf6c',
                        borderColor: '#20bf6c',
                        borderRadius: '4px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#20bf6c',
                          backgroundColor: 'rgba(32, 191, 108, 0.04)'
                        }
                      }}
                    >
                      View & Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'No corporate users found matching your search.' : 'No corporate users found.'}
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
            backgroundColor: '#e5fff1ff',
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
            Showing {filteredRows.length > 0 ? page * rowsPerPage + 1 : 0} of {filteredRows.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={page === 0}
              onClick={(e) => handleChangePage(e, page - 1)}
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
              disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
              onClick={(e) => handleChangePage(e, page + 1)}
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

      {/* Add/Edit Corporate User Modal */}
      <AddCorporateUser open={openModal} onClose={handleCloseModal} onSave={handleSaveUser} mode={modalMode} userData={selectedUser} />
    </Box>
  );
}
