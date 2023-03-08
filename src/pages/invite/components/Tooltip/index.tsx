import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';
import classNames from 'classnames';
import styles from './index.less';

export interface ITooltipProps extends TooltipProps {}

const Tooltip: React.FC<ITooltipProps> = ({
  children,
  title,
  className,
  ...rest
}) => {
  return (
    <MuiTooltip
      title={title}
      classes={{
        tooltip: classNames(styles['tooltip'], className),
        arrow: styles['tooltip-arrow'],
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
