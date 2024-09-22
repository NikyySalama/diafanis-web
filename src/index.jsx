import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/inter'; 
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3079E1',
    },
    secondary: {
      main: '#4E54B5',
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
          '--primary-color': '#020246',
          '--secondary-color' : '#360269',
          '--navbar-height' : '45px',
          '--button-main-color' : '#7aafff',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter"',
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
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
