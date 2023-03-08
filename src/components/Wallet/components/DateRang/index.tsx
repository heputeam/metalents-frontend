import { ReactChild, ReactNode, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import styles from './index.less';
import arrowDownSvg from '@/pages/home/components/SelectOptions/assets/arrow-down.svg';
import { uid } from 'react-uid';
import styled from '@emotion/styled';
import classNames from 'classnames';

const MyPopover = styled(Popover)(() => {
  return {
    '.MuiPopover-paper': {
      borderRadius: 10,
      marginTop: 20,
    },
  };
});

interface ISelectItem {
  children?: ReactChild | never[];
  value?: string | number;
  valueStr: string;
  showItemStr: string;
  title: string;
  prefix: ReactNode | string;
  type?: 'Button' | 'Select';
  clickAmount?: number;
  className?: string;
  anchorEl: HTMLDivElement | null;
  setAnchorEl: (val: HTMLDivElement | null) => void;
}

const DateRang = ({
  children,
  value,
  valueStr,
  showItemStr,
  title,
  prefix,
  type = 'Button',
  clickAmount,
  className,
  anchorEl,
  setAnchorEl,
}: ISelectItem) => {
  const handleClickSelectBox = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClosePopover();
  }, [value, clickAmount]);

  return (
    <div className={`${styles['selectItem-container']}`}>
      <div onClick={handleClickSelectBox}>
        <div className={styles['button-box']}>
          {prefix}
          <p>{showItemStr}</p>
          <img
            src={arrowDownSvg}
            alt=""
            className={Boolean(anchorEl) ? styles['reversal'] : ''}
          />
          {valueStr && <div className={styles['sub-heading']}>{title}</div>}
        </div>
      </div>

      <MyPopover
        id={uid(children)}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={styles['popover-container']}
      >
        <div
          className={classNames(
            styles['popover-box'],
            type === 'Select' && styles['popover-select-box'],
          )}
        >
          {children}
        </div>
      </MyPopover>
    </div>
  );
};

export default DateRang;
