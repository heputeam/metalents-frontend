import themes from '@/layouts/themes';
import { ThemeProvider } from '@mui/material';
import React from 'react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={themes}>
      <Story />
    </ThemeProvider>
  ),
];
