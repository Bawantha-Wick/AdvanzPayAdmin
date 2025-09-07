import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Paper, Popover } from '@mui/material';
import { ArrowUpward, Business, People, RequestQuote, AccountBalance } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';

const Dashboard: React.FC = () => {
  // Use the current date as default
  const currentDate = dayjs();
  // Make sure we have fresh instances of dayjs objects
  const startDate = currentDate.subtract(30, 'day');
  const endDate = currentDate;

  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(startDate);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  // Keep track of highlighted range for visualization
  const [highlightRange, setHighlightRange] = useState<boolean>(false);

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Start by showing the existing selection in visualization mode
    setHighlightRange(true);
    // Default to selecting the start date first
    setSelectionStep('start');
    // Always start with the current start date selected
    setSelectedDate(dateRange.start);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectionStep('start');
    // Stop highlighting range when closed
    setHighlightRange(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    if (selectionStep === 'start') {
      // When selecting start date
      const newStart = date;

      // Update date range with new start date
      setDateRange((prev) => ({ ...prev, start: newStart }));
      setSelectedDate(newStart);

      // Enable range highlighting
      setHighlightRange(true);

      // Switch to end date selection
      setSelectionStep('end');
    } else {
      // When selecting end date
      // Ensure end date is not before start date
      if (date.isBefore(dateRange.start)) {
        // If user selects a date before start, swap the dates
        setDateRange({
          start: date,
          end: dateRange.start
        });
      } else {
        // Set the end date
        setDateRange((prev) => ({ ...prev, end: date }));
      }

      // Close the calendar after end date is selected
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  // Chart data for loan amount over time
  const chartData = [
    { period: 'Jan', amount: 20 },
    { period: 'Feb', amount: 30 },
    { period: 'Mar', amount: 45 },
    { period: 'Apr', amount: 35 },
    { period: 'May', amount: 60 },
    { period: 'Jun', amount: 70 },
    { period: 'Jul', amount: 55 },
    { period: 'Aug', amount: 85 },
    { period: 'Sep', amount: 75 },
    { period: 'Oct', amount: 90 },
    { period: 'Nov', amount: 80 },
    { period: 'Dec', amount: 95 }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Date Range Display */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box /> {/* Empty box for alignment to match Reports.tsx layout */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer'
          }}
          onClick={handleDateRangeClick}
        >
          <BsCalendar3 size={20} color="#767676" style={{ marginRight: '8px' }} />
          <Typography variant="body2" sx={{ color: '#606060', fontWeight: 500 }}>
            <span style={{ fontWeight: 'bold' }}>{dateRange.start.format('MMM DD, YYYY')}</span>
            <span style={{ margin: '0 8px', color: '#999' }}>{'->'}</span>
            <span style={{ fontWeight: 'bold' }}>{dateRange.end.format('MMM DD, YYYY')}</span>
          </Typography>
          <IoChevronDown size={20} color="#767676" style={{ marginLeft: '8px' }} />
        </Box>{' '}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiPopover-paper': {
              overflow: 'hidden',
              borderRadius: '24px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff'
            }
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#ff6b00', color: 'white' }}>
            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}> */}
            {/* {selectionStep === 'start' ? 'Select Start Date' : 'Select End Date'} */}
            {/* </Typography> */}
            {/* Show current date range information */}
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {highlightRange ? (
                <>
                  Current range: {dateRange.start.format('MMM DD')} - {dateRange.end.format('MMM DD, YYYY')}
                </>
              ) : (
                selectionStep === 'end' && <>Start date: {dateRange.start.format('MMM DD, YYYY')}</>
              )}
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              views={['day']}
              slotProps={{
                day: (ownerState) => {
                  if (!ownerState.day) return {};

                  // Format dates to compare
                  const currentDayFormatted = ownerState.day.format('YYYY-MM-DD');
                  const startDateFormatted = dateRange.start.format('YYYY-MM-DD');
                  const endDateFormatted = dateRange.end.format('YYYY-MM-DD');

                  // Check if this day is the start date
                  const isStartDate = currentDayFormatted === startDateFormatted;

                  // Check if this day is the end date
                  const isEndDate = currentDayFormatted === endDateFormatted;

                  // Check if this day is between start and end (for highlighting the range)
                  const isInRange = highlightRange && ownerState.day.isAfter(dateRange.start) && ownerState.day.isBefore(dateRange.end);

                  if (isStartDate) {
                    return {
                      sx: {
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#ff6b00'
                        }
                      }
                    };
                  } else if (isEndDate) {
                    return {
                      sx: {
                        backgroundColor: '#ff8c40',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#ff8c40'
                        }
                      }
                    };
                  } else if (isInRange) {
                    return {
                      sx: {
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 0, 0.2)'
                        }
                      }
                    };
                  }
                  return {};
                }
              }}
              sx={{
                width: '320px',
                bgcolor: '#ffffff',
                color: '#333',
                padding: '12px',
                '& .MuiPickersCalendarHeader-label': {
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  margin: 'auto'
                },
                '& .MuiPickersCalendarHeader-root': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                  marginBottom: '8px'
                },
                '& .MuiPickersCalendarHeader-switchViewButton': {
                  color: '#666'
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: '#666'
                },
                '& .MuiDayCalendar-header': {
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: '#666',
                    fontSize: '12px',
                    width: '36px',
                    height: '36px',
                    margin: '0'
                  }
                },
                '& .MuiPickersDay-root': {
                  color: '#333',
                  fontSize: '14px',
                  width: '32px',
                  height: '32px',
                  margin: '2px',
                  borderRadius: '50%',
                  '&.Mui-selected': {
                    backgroundColor: '#ff6b00',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#ff6b00'
                    },
                    '&:focus': {
                      backgroundColor: '#ff6b00'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 0, 0.1)'
                  },
                  '&.MuiPickersDay-today': {
                    border: '1px solid #ff6b00'
                  },
                  '&.Mui-disabled': {
                    color: '#cccccc'
                  }
                },
                '& .MuiPickersDay-hiddenDaySpacingFiller': {
                  backgroundColor: 'transparent'
                },
                '& .MuiDialogActions-root': {
                  display: 'none'
                },
                '& .MuiPickersSlideTransition-root': {
                  minHeight: '240px'
                }
              }}
            />
          </LocalizationProvider>
        </Popover>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Corporate Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <Card sx={{ bgcolor: '#fff3e0', borderRadius: '20px', position: 'relative', height: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#ffb74d',
                    p: 1,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <Business sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  Corporate
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                40
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Employees Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <Card sx={{ bgcolor: '#e8f5e8', borderRadius: '20px', position: 'relative', height: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#66bb6a',
                    p: 1,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <People sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  Employees
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                09
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Loan Requests Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <Card sx={{ bgcolor: '#fff8e1', borderRadius: '20px', position: 'relative', height: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#ffa726',
                    p: 1,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <RequestQuote sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  Loan requests
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                40
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Total Loans Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <Card sx={{ bgcolor: '#f3e5f5', borderRadius: '20px', position: 'relative', height: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#8e24aa',
                    p: 1,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <AccountBalance sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                  Total loans
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                0
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                  Commission gained
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mt: 0.5 }}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Top Corporates Section */}
        <Box sx={{ flex: '1 1 30%', minWidth: '300px' }}>
          <Paper sx={{ p: 3, borderRadius: '20px', height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Top Corporates
            </Typography>
            <Box sx={{ height: 'calc(100% - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
                No data available
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Chart Section */}
        <Box sx={{ flex: '1 1 70%', minWidth: '400px' }}>
          <Paper sx={{ p: 3, borderRadius: '20px', height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Loan Amount Over Time
            </Typography>
            <Box sx={{ height: 'calc(100% - 80px)', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickMargin={10} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}k`} tick={{ fontSize: 12, fill: '#666' }} />
                  <Tooltip
                    formatter={(value) => [`${value}k USD`, 'Amount']}
                    labelFormatter={(label) => `Period: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="none" fill="url(#colorAmount)" />
                  <Line type="monotone" dataKey="amount" stroke="#ff9800" strokeWidth={3} dot={{ r: 4, fill: '#ff9800', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#ff9800', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
