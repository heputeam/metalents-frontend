import { Stack } from '@mui/material';
import React from 'react';

export type IFontsProps = {};

const Fonts: React.FC<IFontsProps> = ({}) => {
  return (
    <>
      <Stack
        sx={{ fontSize: 30, color: '#999' }}
        direction="row"
        spacing={10}
        title="Roboto"
      >
        <span style={{ fontWeight: 400 }}>400</span>
        <span style={{ fontWeight: 500 }}>500</span>
        <span style={{ fontWeight: 700 }}>700/bold</span>
      </Stack>
      <hr />
      <Stack
        title="Roboto Condensed"
        sx={{ fontSize: 30, fontFamily: 'HelveticaCondensed' }}
        direction="row"
        spacing={10}
      >
        <span style={{ fontWeight: 400 }}>400</span>

        <span style={{ fontWeight: 700 }}>700/bold</span>
      </Stack>
    </>
  );
};

export default Fonts;
