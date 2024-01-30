import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, createTheme, ThemeProvider, Typography, Modal, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue color
    },
    secondary: {
      main: '#008080', // Vibrant teal color
    },
    background: {
      default: '#bbdefb', // Light blue color
      paper: '#e0e0e0', // Darker grey for paper components
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Modern sans-serif font
    h6: {
      fontWeight: 500,
      fontSize: 16,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)', // Light blue gradient background
        },
      },
    },
  },
});

const StyledButton = styled(Button)({
  position: 'absolute',
  top: '10px',
  right: '10px'
});

const StyledDataGrid = styled(DataGrid)({
  marginTop: '50px',
});

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledPaper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'username', headerName: 'Username', width: 200 },
  { field: 'firstName', headerName: 'First Name', width: 200 },
  { field: 'lastName', headerName: 'Last Name', width: 200 },
  { field: 'role', headerName: 'Role', width: 200 },
];

const Home = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  let accessToken;

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch('http://139.59.54.184:8080/user/list', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching user list:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };

    if (accessToken) {
      fetchUserList();
    } else {
      router.push('/signin');
    }
  }, [accessToken]);

  const handleOpen = () => {
    setOpen(true);
    setErrorMessage(''); // Reset error message when modal is opened
  };

  const handleClose = () => {
    setOpen(false);
  };

const handleCreateUser = async () => {
  try {
    const response = await fetch('http://139.59.54.184:8080/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        username,
        password,
        firstName,
        lastName,
      }),
    });

    if (response.ok) {
      // User created successfully
      console.log('User created successfully');
      handleClose();
      // Fetch the updated list of users
      const userListResponse = await fetch('http://139.59.54.184:8080/user/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (userListResponse.ok) {
        const data = await userListResponse.json();
        setUsers(data);
      } else {
        const data = await userListResponse.json();
        setErrorMessage(data.errorMessage || 'Error fetching user list');
      }
    } else {
      // Show the error message in the modal below the submit button
      const data = await response.json();
      setErrorMessage(data.errorMessage || 'Error creating user');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('An error occurred while creating the user.');
  }
};

  const handleOpenEditModal = (user) => {
    setUsername(user.username);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEditUserId(user.id);
    setOpen(true);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      router.push('/signin');
    }
  };

  const handleRowClick = (param) => {
    console.log(param.row.id)
    router.push(`/user/${param.row.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h6" color="primary">
          Smart Aquaculture
        </Typography>
        <StyledButton variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </StyledButton>
        <div style={{ height: 400, width: '100%' }}>
          <StyledDataGrid
            rows={[...users].sort((a, b) => a.id - b.id)}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={handleRowClick}
            getRowId={(row) => row.id}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add User
        </Button>
        <StyledModal open={open} onClose={handleClose}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography id="add-user-title">Add User</Typography>
    <Box marginBottom={2}>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    </Box>
    <Box marginBottom={2}>
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </Box>
    <Box marginBottom={2}>
      <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    </Box>
    <Box marginBottom={2}>
      <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
    </Box>
    <Button variant="contained" color="primary" onClick={handleCreateUser}>
      Submit
    </Button>
    {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
  </Box>
</StyledModal>
      </div>
    </ThemeProvider>
  );
};

export default Home;

