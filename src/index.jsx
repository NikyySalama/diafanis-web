import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/inter'; 
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0047E0',
    },
    secondary: {
      main: '#30B3E1',
    },
    primary2: {
      main: '#020246',
    },
    secondary2: {
      main: '#360269',
    },
    back: {
      main: '#FFFFFF',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--primary-color': '#0047E0',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 400, 
    },
    body1: {
      fontWeight: 400, 
    },
    button: {
      textTransform: 'none', 
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
