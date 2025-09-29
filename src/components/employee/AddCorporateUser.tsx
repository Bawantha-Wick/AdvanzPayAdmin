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
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

export interface CorporateUserFormData {
  name: string;
  jobTitle: string;
  email: string;
  mobile: string;
  accountStatus?: 'Active' | 'Inactive';
  blockStatus?: 'Yes' | 'No';
}

interface AddCorporateUserProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: CorporateUserFormData) => void;
  mode?: 'add' | 'edit';
  userData?: CorporateUserFormData;
}

const AddCorporateUser: React.FC<AddCorporateUserProps> = ({ open, onClose, onSave, mode = 'add', userData: initialUserData }) => {
  const [userData, setUserData] = React.useState<CorporateUserFormData>({
    name: '',
    jobTitle: '',
    email: '',
    mobile: '',
    accountStatus: 'Active',
    blockStatus: 'No'
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  // Initialize form with user data when in edit mode
  React.useEffect(() => {
    setError(''); // Clear error when dialog opens

    if (mode === 'edit' && initialUserData) {
      setUserData(initialUserData);
    } else if (mode === 'add') {
      // Reset form for add mode
      setUserData({
        name: '',
        jobTitle: '',
        email: '',
        mobile: '',
        accountStatus: 'Active',
        blockStatus: 'No'
      });
    }
  }, [mode, initialUserData, open]);

  const handleChange = (field: keyof CorporateUserFormData, value: string) => {
    setUserData({
      ...userData,
      [field]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Basic validation
      if (!userData.name || !userData.jobTitle || !userData.email || !userData.mobile) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Mobile validation (basic)
      if (userData.mobile.length < 10) {
        setError('Please enter a valid mobile number');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSave(userData);
      onClose();
    } catch (err: unknown) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} corporate user:`, err);
      const errorMessage = err instanceof Error ? err.message : `Failed to ${mode === 'add' ? 'create' : 'update'} corporate user. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          p: 3
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            {mode === 'add' ? 'Add new Corporate User' : 'Edit Corporate User'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DialogContent sx={{ p: 0, minHeight: '45vh', position: 'relative' }}>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
                placeholder="Enter name"
                value={userData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                value={userData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
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
                placeholder="Enter email"
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
                Mobile number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter mobile number"
                value={userData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
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

          {/* Status Fields - Only show in edit mode */}
          {mode === 'edit' && (
            <>
              {/* Account Status Section */}
              <Typography variant="h6" color="#0c4829" fontWeight="medium" mb={2}>
                Account Status
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Account status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                    <Chip
                      label={userData.accountStatus}
                      sx={{
                        backgroundColor: userData.accountStatus === 'Active' ? '#d1eddb' : '#ffebe6',
                        color: userData.accountStatus === 'Active' ? '#00875a' : '#de350b',
                        fontSize: '12px',
                        fontWeight: 500,
                        height: '28px'
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="#666" fontWeight="medium" mb={1}>
                    Block status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                    <Chip
                      label={userData.blockStatus}
                      sx={{
                        backgroundColor: userData.blockStatus === 'No' ? '#d1eddb' : '#ffebe6',
                        color: userData.blockStatus === 'No' ? '#00875a' : '#de350b',
                        fontSize: '12px',
                        fontWeight: 500,
                        height: '28px'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons for Edit Mode */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    height: '48px',
                    borderColor: '#76d8a5',
                    color: '#0c4829',
                    px: 3,
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
                  Block user
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    height: '48px',
                    borderColor: '#76d8a5',
                    color: '#0c4829',
                    px: 3,
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
                  Deactivate user
                </Button>
              </Box>
            </>
          )}

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
              {loading ? 'Saving...' : mode === 'add' ? 'Save Corporate User' : 'Update Corporate User'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddCorporateUser;
