import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// import { employeeService } from '../../services/employeeService';
// import type { CreateCorpEmployeeData, UpdateCorpEmployeeData } from '../../types/api';

export interface AddCorporateData {
  id?: string;
  corporationName: string;
  registeredAddress: string;
  registrationId: string;
  payDate: string;
  name: string;
  jobTitle: string;
  email: string;
  mobile: string;
  salaryLimits: {
    minimum: string;
    maximum: string;
    percentage: string;
    capAmount: string;
  };
  ewaConfiguration: {
    maxEwaPercentage: number;
    adHocTransactionFee: string;
    enableAutoApproval: boolean;
  };
  feeStructure: {
    manualWithdrawalFee: string;
    automatedWithdrawalFee: string;
  };
  accountStatus?: boolean;
  approveStatus?: boolean;
  status?: 'ACTV' | 'INAC' | 'BLCK';
}

interface AddCorporateProps {
  open: boolean;
  onClose: () => void;
  onSave: (employeeData: AddCorporateData) => void;
  mode?: 'add' | 'edit';
  employeeData?: AddCorporateData;
}

const AddCorporate: React.FC<AddCorporateProps> = ({ open, onClose, onSave, mode = 'add', employeeData: initialEmployeeData }) => {
  const [employeeData, setEmployeeData] = React.useState<AddCorporateData>({
    corporationName: '',
    registeredAddress: '',
    registrationId: '',
    payDate: '1',
    name: '',
    jobTitle: 'Manager',
    email: '',
    mobile: '',
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
    accountStatus: true,
    approveStatus: true,
    status: 'ACTV'
  });
  const [currentView, setCurrentView] = React.useState<'main' | 'configuration'>('main');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [isFormDisabled, setIsFormDisabled] = React.useState<boolean>(false);
  const [isFixedTransactionFeeEnabled, setIsFixedTransactionFeeEnabled] = React.useState<boolean>(true);
  const [isFixedPercentageFeeEnabled, setIsFixedPercentageFeeEnabled] = React.useState<boolean>(true);

  // Initialize form with employee data when in edit mode
  React.useEffect(() => {
    setError(''); // Clear error when dialog opens

    if (mode === 'edit' && initialEmployeeData) {
      setEmployeeData({
        ...initialEmployeeData,
        // Ensure salaryLimits exists
        salaryLimits: initialEmployeeData.salaryLimits || {
          minimum: '10000',
          maximum: '10000',
          percentage: '10000',
          capAmount: '10000'
        },
        // Ensure ewaConfiguration exists
        ewaConfiguration: initialEmployeeData.ewaConfiguration || {
          maxEwaPercentage: 51,
          adHocTransactionFee: '5',
          enableAutoApproval: true
        },
        // Ensure feeStructure exists
        feeStructure: initialEmployeeData.feeStructure || {
          manualWithdrawalFee: '3',
          automatedWithdrawalFee: '2'
        },
        // Set default status if not provided
        status: initialEmployeeData.status || 'ACTV'
      });
      // Set form disabled state based on status
      setIsFormDisabled(initialEmployeeData.status === 'INAC');
    } else if (mode === 'add') {
      // Reset form for add mode
      setEmployeeData({
        corporationName: '',
        registeredAddress: '',
        registrationId: '',
        payDate: '1',
        name: '',
        jobTitle: 'Manager',
        email: '',
        mobile: '',
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
        accountStatus: true,
        approveStatus: true,
        status: 'ACTV'
      });
      setIsFormDisabled(false);
    }
  }, [mode, initialEmployeeData, open]);

  const handleChange = (field: keyof AddCorporateData, value: string) => {
    setEmployeeData({
      ...employeeData,
      [field]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSalaryLimitsChange = (field: keyof typeof employeeData.salaryLimits, value: string) => {
    setEmployeeData({
      ...employeeData,
      salaryLimits: {
        ...employeeData.salaryLimits,
        [field]: value
      }
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleEwaConfigurationChange = (field: keyof typeof employeeData.ewaConfiguration, value: string | number | boolean) => {
    setEmployeeData({
      ...employeeData,
      ewaConfiguration: {
        ...employeeData.ewaConfiguration,
        [field]: value
      }
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFeeStructureChange = (field: keyof typeof employeeData.feeStructure, value: string) => {
    setEmployeeData({
      ...employeeData,
      feeStructure: {
        ...employeeData.feeStructure,
        [field]: value
      }
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const showConfigurationView = () => {
    setCurrentView('configuration');
  };

  const showMainView = () => {
    setCurrentView('main');
  };

  const handleSaveConfiguration = async () => {
    try {
      setLoading(true);
      setError('');

      // You can add specific configuration validation here if needed
      console.log('Saving configuration:', employeeData.ewaConfiguration, employeeData.feeStructure);

      // Simulate API call or actual save logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message or handle as needed
      setCurrentView('main');
    } catch (err: unknown) {
      console.error('Error saving configuration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Basic validation
      // if (!employeeData.corporationName || !employeeData.name || !employeeData.email || !employeeData.mobile) {
      //   setError('Please fill in all required fields');
      //   setLoading(false);
      //   return;
      // }

      // if (!employeeData.salaryLimits.minimum || !employeeData.salaryLimits.maximum || !employeeData.salaryLimits.percentage || !employeeData.salaryLimits.capAmount) {
      //   setError('Please fill in all salary limit details');
      //   setLoading(false);
      //   return;
      // }

      if (mode === 'add') {
        // Map form data to API format for creation
        // const apiData: CreateCorpEmployeeData = {
        // name: employeeData.name,
        // email: employeeData.email,
        // mobile: employeeData.mobile,
        // basicSalAmt: parseFloat(employeeData.salary) || 0,
        // accNo: employeeData.bankDetails.accountNumber,
        // accName: employeeData.bankDetails.accountName,
        // accBank: employeeData.bankDetails.bankName,
        // accBranch: employeeData.bankDetails.branch
        // };
        // await employeeService.createCorpEmployee(apiData);
      } else {
        // Map form data to API format for update
        // const updateData: UpdateCorpEmployeeData = {
        // no: parseInt(employeeData.id) || 0,
        // name: employeeData.name,
        // email: employeeData.email,
        // mobile: employeeData.mobile,
        // basicSalAmt: parseFloat(employeeData.salary) || 0,
        // accNo: employeeData.bankDetails.accountNumber,
        // accName: employeeData.bankDetails.accountName,
        // accBank: employeeData.bankDetails.bankName,
        // accBranch: employeeData.bankDetails.branch,
        // status: employeeData.status || 'ACTV'
        // };
        // await employeeService.updateCorpEmployee(updateData);
      }

      onSave(employeeData);
      onClose();
    } catch (err: unknown) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} employee:`, err);
      const errorMessage = err instanceof Error ? err.message : `Failed to ${mode === 'add' ? 'create' : 'update'} employee. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          p: 3
        }
      }}
    >
      {currentView !== 'configuration' && (
        <DialogTitle sx={{ p: 0, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="medium">
              {mode === 'add' ? 'Add New Corporation' : 'Edit Corporation'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DialogContent sx={{ p: 0, minHeight: currentView !== 'configuration' ? '65vh' : '35vh', position: 'relative', bgcolor: '' }}>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {/* Main Form View */}
          <Collapse in={currentView === 'main'} timeout={300}>
            <Box>
              {/* Corporation name and Pay date row */}
              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Business Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Name"
                    value={employeeData.corporationName}
                    onChange={(e) => handleChange('corporationName', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Registered Address
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Address"
                    value={employeeData.registeredAddress}
                    onChange={(e) => handleChange('registeredAddress', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Registration ID
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Registration ID"
                    value={employeeData.registrationId}
                    onChange={(e) => handleChange('registrationId', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Pay Day
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={employeeData.payDate}
                    onChange={(e) => handleChange('payDate', e.target.value)}
                    disabled={isFormDisabled}
                    SelectProps={{
                      native: true
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {/* Contact Details Section */}
              <Typography variant="h6" color="#0c4829" fontWeight="medium" mb={2}>
                Contact Details
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Name"
                    value={employeeData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8cdeb3'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#76d8a5'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Job Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Manager"
                    value={employeeData.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Email"
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Mobile Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Mobile Number"
                    value={employeeData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Earned Wage Limits Section */}
              <Typography variant="h6" color="#333" fontWeight="medium" mb={2}>
                Earned Wage Limits
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Maximum
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="10000"
                    value={employeeData.salaryLimits.maximum}
                    onChange={(e) => handleSalaryLimitsChange('maximum', e.target.value)}
                    disabled={isFormDisabled}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Add more button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                  onClick={showConfigurationView}
                  variant="outlined"
                  startIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    color: '#0c4829',
                    borderColor: '#76d8a5',
                    fontSize: '14px',
                    fontWeight: 'medium',
                    py: 1,
                    px: 2,
                    '&:hover': {
                      borderColor: '#76d8a5',
                      backgroundColor: 'rgba(118,216,165,0.04)'
                    }
                  }}
                >
                  Advanced Configuration
                </Button>
              </Box>
            </Box>
          </Collapse>

          {/* EWA Configuration and Fee Structure View */}
          <Collapse in={currentView === 'configuration'} timeout={300}>
            <Box>
              {/* Back Button */}
              <Box sx={{ mb: 3 }}>
                <Button
                  onClick={showMainView}
                  variant="outlined"
                  startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    color: '#0c4829',
                    borderColor: '#76d8a5',
                    fontSize: '14px',
                    fontWeight: 'medium',
                    py: 1,
                    px: 2,
                    '&:hover': {
                      borderColor: '#76d8a5',
                      backgroundColor: 'rgba(118,216,165,0.04)'
                    }
                  }}
                >
                  Back to Main Form
                </Button>
              </Box>

              {/* EWA Configuration */}
              <Typography variant="h6" color="#0c4829" fontWeight="medium" mb={3}>
                EWA Configuration
              </Typography>

              <Box mb={3}>
                <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={2}>
                  Max EWA Percentage ({employeeData.ewaConfiguration.maxEwaPercentage}%)
                </Typography>
                <Slider
                  value={employeeData.ewaConfiguration.maxEwaPercentage}
                  onChange={(_, value) => handleEwaConfigurationChange('maxEwaPercentage', value as number)}
                  min={0}
                  max={100}
                  step={1}
                  disabled={isFormDisabled}
                  sx={{
                    color: '#76d8a5',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#278b56ff'
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#278b56ff'
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                />
              </Box>

              {/* Fee Structure */}
              <Typography variant="h6" color="#0c4829" fontWeight="medium" mb={3} mt={4}>
                Fee Structure
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Fixed Transaction Fee ($)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      placeholder="5"
                      value={employeeData.ewaConfiguration.adHocTransactionFee}
                      onChange={(e) => handleEwaConfigurationChange('adHocTransactionFee', e.target.value)}
                      disabled={isFormDisabled || !isFixedTransactionFeeEnabled}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontSize: '14px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          }
                        }
                      }}
                    />
                    <Switch
                      checked={isFixedTransactionFeeEnabled}
                      onChange={(e) => setIsFixedTransactionFeeEnabled(e.target.checked)}
                      disabled={isFormDisabled}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#278b56ff'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#278b56ff'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Fixed Percentage Fee (%)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      placeholder="3"
                      value={employeeData.feeStructure.manualWithdrawalFee}
                      onChange={(e) => handleFeeStructureChange('manualWithdrawalFee', e.target.value)}
                      disabled={isFormDisabled || !isFixedPercentageFeeEnabled}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                          fontSize: '14px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          }
                        }
                      }}
                    />
                    <Switch
                      checked={isFixedPercentageFeeEnabled}
                      onChange={(e) => setIsFixedPercentageFeeEnabled(e.target.checked)}
                      disabled={isFormDisabled}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#278b56ff'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#278b56ff'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={employeeData.ewaConfiguration.enableAutoApproval}
                          onChange={(e) => handleEwaConfigurationChange('enableAutoApproval', e.target.checked)}
                          disabled={isFormDisabled}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#278b56ff'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#278b56ff'
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="subtitle2" color="#666" fontWeight="medium">
                          Enable Auto-Approval for Requests
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Configuration Save Button */}
              <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                <Button
                  variant="outlined"
                  onClick={showMainView}
                  sx={{
                    borderRadius: '8px',
                    height: '48px',
                    borderColor: '#76d8a5',
                    color: '#0c4829',
                    px: 4,
                    py: 1,
                    fontSize: '14px',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#76d8a5',
                      backgroundColor: 'rgba(118,216,165,0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveConfiguration}
                  disabled={loading}
                  sx={{
                    borderRadius: '8px',
                    height: '48px',
                    backgroundColor: '#0c4829',
                    color: 'white',
                    px: 4,
                    py: 1,
                    fontSize: '14px',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#0b3b24'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc'
                    }
                  }}
                >
                  {loading ? 'Saving Configuration...' : mode === 'add' ? 'Save Configuration' : 'Update Configuration'}
                </Button>
              </Box>
            </Box>
          </Collapse>

          {/* Main Form Save Button - Only show when in main view */}
          <Collapse in={currentView === 'main'} timeout={300}>
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  height: '48px',
                  backgroundColor: '#0c4829',
                  color: 'white',
                  px: 4,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 'medium',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#0b3b24'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc'
                  }
                }}
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Save Corporate' : 'Update Corporate'}
              </Button>
            </Box>
          </Collapse>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddCorporate;
