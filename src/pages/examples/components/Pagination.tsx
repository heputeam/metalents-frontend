import Pagination from '@/components/Pagination';
import { Box } from '@mui/material';
import React, { useState } from 'react';

const ExamPagination: React.FC = () => {
  const total = 86;
  const size = 8;
  const [page, setPage] = useState<number>(1);

  const handleChange = (event: object, page: number) => {
    setPage(page);
  };

  return (
    <Box mt={20}>
      <Pagination
        total={total}
        size={size}
        current={page}
        onChange={handleChange}
      />
    </Box>
  );
};

export default ExamPagination;
