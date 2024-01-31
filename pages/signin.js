import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Typography, createTheme, ThemeProvider, Box, Paper, Grid, CssBaseline } from '@mui/material';
import { styled } from '@mui/system';
import Container from '@mui/material/Container';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue color
    },
    secondary: {
      main: '#008080', // Vibrant teal color
    },
    background: {
      default: 'linear-gradient(45deg, #3f51b5 30%, #1a237e 90%)', // Elegant blue gradient background
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignin = async () => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the response contains accessToken
        const accessToken = data.accessToken;
        // Save accessToken to localStorage or sessionStorage
        localStorage.setItem('accessToken', accessToken);
        // Redirect to home
        router.push('/home');
      } else {
        // Handle unsuccessful login
        setError('Login unsuccessful. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={3}>
          <Typography variant="h6" color="primary">
            Smart Aquaculture
          </Typography>
          {error && <p>{error}</p>}
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  variant="outlined"
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <StyledButton variant="contained" color="primary" fullWidth onClick={handleSignin}>
              Sign In
            </StyledButton>
          </Box>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  );
};

export default Signin;