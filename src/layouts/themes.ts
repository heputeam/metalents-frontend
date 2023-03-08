import {
  PaletteColorOptions,
  PaletteOptions,
  ThemeOptions,
} from '@mui/material';

export type ThemeOptionsExt = ThemeOptions & {
  palette: PaletteOptions & {
    strong?: PaletteColorOptions;
  };
};

export const darkTheme: ThemeOptionsExt = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#111',
      contrastText: '#fff',
    },
    error: {
      main: '#E03A3A',
    },
  },
};
export const lightTheme: ThemeOptionsExt = {
  palette: {
    mode: 'light',
    primary: {
      main: '#111',
      contrastText: '#fff',
    },
    strong: {},
    error: {
      main: '#E03A3A',
    },
  },
};

const theme: ThemeOptions = {
  spacing: 1,
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 750,
      lg: 1200,
      xl: 1920,
    },
  },

  typography: {
    h1: {
      fontSize: 32,
    },
    h2: {
      fontSize: 24,
    },
    h3: {
      fontSize: 18,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {},
    },
  },
};

export default theme;
