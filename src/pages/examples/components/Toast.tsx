import React from 'react';
import { Stack } from '@mui/material';
import Toast from '@/components/Toast';
import Button from '@/components/Button';
export type IExamToastProps = {};

const ExamToast: React.FC<IExamToastProps> = ({}) => {
  return (
    <Stack direction="row" spacing={10}>
      <Button
        variant="contained"
        size="small"
        sx={{ bgcolor: '#9c27b0' }}
        onClick={() => {
          Toast.success(
            <div>
              定制化<span style={{ color: 'red' }}>Success</span>
            </div>,
            { hideProgressBar: false, closeButton: true },
          );
        }}
      >
        定制化
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={() => {
          Toast.success('Successfully saved!');
        }}
        sx={{ bgcolor: 'var(--ps-toast-success)' }}
      >
        Success
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={() => {
          Toast.warn('Warn');
        }}
        sx={{ bgcolor: 'var(--ps-toast-warn)' }}
      >
        Warn
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          Toast.error('Unknown system failure: Please try');
        }}
        sx={{ bgcolor: 'var(--ps-toast-error)' }}
      >
        Error
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          Toast.removeAll();
        }}
      >
        Remove all
      </Button>
    </Stack>
  );
};

export default ExamToast;
