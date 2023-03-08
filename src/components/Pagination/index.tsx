import React from 'react';
import { Pagination as InitPagination, PaginationClasses } from '@mui/material';
import styles from './index.less';

export interface IPagination {
  total: number;
  size: number;
  current: number;
  onChange: (event: object, page: number) => void;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  classes?: Partial<PaginationClasses>;
}

const Pagination: React.FC<IPagination> = ({
  total,
  size,
  current,
  onChange,
  hideNextButton,
  hidePrevButton,
  classes,
}) => {
  return (
    <InitPagination
      count={Math.ceil(total / size)}
      page={current}
      color="primary"
      shape="rounded"
      variant="outlined"
      onChange={onChange}
      classes={{ root: styles['pagination-root'], ...classes }}
      hidePrevButton={hidePrevButton}
      hideNextButton={hideNextButton}
    />
  );
};

export default Pagination;
