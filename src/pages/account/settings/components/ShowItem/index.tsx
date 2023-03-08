import { Box, Input, InputProps } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from './index.less';

interface IShowItem extends InputProps {
  label: string;
  context?: string;
  require?: Boolean;
  after?: ReactNode;
}

const ShowItem = ({ label, after, context, require }: IShowItem) => {
  return (
    <div className={styled['inputItem-container']}>
      <h4>
        {label} {require && <span>*</span>}
      </h4>
      <div className={styled['inputItem-box']}>
        <p className={styled['context']}>{context}</p>
        {after && after}
      </div>
    </div>
  );
};

export default ShowItem;
