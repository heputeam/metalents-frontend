import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
const TestScrollPage = () => {
  const [list, setList] = useState(
    new Array(10).fill(0).map((_, i) => ({ value: i + 100 })),
  );

  return (
    <Box mt={120}>
      <Typography>page </Typography>
      <Box
        sx={{
          width: 200,
          height: 300,
          overflow: 'auto',
          background: 'rgba(50, 250, 250, 0.8)',
        }}
      >
        {list.map((item) => {
          return (
            <Box
              className={`test-${item.value}`}
              key={item.value}
              sx={{ height: 50, background: 'rgba(200, 20, 0, 0.5)' }}
              mt={10}
            >
              {item.value}
            </Box>
          );
        })}
      </Box>
      <Button
        onClick={() => {
          setList([
            ...new Array(10).fill(0).map((_, i) => ({ value: i + 89 })),
            ...list,
          ]);
          setTimeout(() => {
            document
              .getElementsByClassName(`test-${list[0].value}`)[0]
              ?.scrollIntoView({ behavior: 'smooth' });
          }, 10);
        }}
      >
        Add Top more massage
      </Button>
    </Box>
  );
};
export default TestScrollPage;
