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
    back: {
      main: '#FFFFFF',
    }, 
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--primary-color': '#020246',
          '--primary-color-light5': '#10109c', 
          '--primary-color-light4': '#3636e3',
          '--primary-color-light3': '#6c6ce0',
          '--primary-color-light2': '#a5a5fa',
          '--primary-color-light1': '#cfcfff',
          '--secondary-color' : '#4E54B5',
          '--secondary-color-light': '#ecebf7',
          '--secondary-color-hover': '#cbc7fc',
          '--background-color' : '#FFFFFF',
          '--navbar-height' : '55px',
          '--button-main-color' : '#020246',
          '--button-main-color-light' : '#1f1f91',
        },
        'h1, h2, h3, h4, h5, h6, p': {
          fontFamily: 'Inter',
          fontWeight: 700,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter"',
    'h1, h2, h3, h4, h5, h6, body1, body2': {
      fontFamily: 'Inter',
      fontWeight: 700,
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
