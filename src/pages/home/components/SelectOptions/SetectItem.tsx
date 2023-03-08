import { ReactChild, ReactNode, useCallback, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import styles from './SelectItem.less';
import arrowDownSvg from './assets/arrow-down.svg';
import { uid } from 'react-uid';
import styled from '@emotion/styled';
import classNames from 'classnames';

const MyPopover = styled(Popover)(() => {
  return {
    '.MuiPopover-paper': {
      borderRadius: 10,
      marginTop: 20,
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.1)',
    },
  };
});

const defaultOptions = ['Options', 'Seller Details', 'Deliver Time', 'Budget'];

interface ISelectItem {
  children?: ReactChild | never[];
  value?: string | number;
  showItemStr: string;
  title: string;
  prefix: ReactNode | string;
  type?: 'Button' | 'Select';
  clickAmount?: number;
  className?: string;
}

const SelectItem = ({
  children,
  value,
  showItemStr,
  title,
  prefix,
  type = 'Button',
  clickAmount,
  className,
}: ISelectItem) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

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
        {type === 'Select' ? (
          <div className={`${styles['select-box']} ${className}`}>
            {/* 下拉选项样式 */}
            <span className={styles['prefix']}>{prefix}</span>
            <p>{showItemStr}</p>
            <img
              src={arrowDownSvg}
              alt=""
              className={Boolean(anchorEl) ? styles['reversal'] : ''}
            />
          </div>
        ) : (
          <div className={styles['button-box']}>
            {/* 按钮样式 */}
            {/* <img src={prefixIcon} alt="" /> */}
            {prefix}
            <p>{showItemStr}</p>
            <img
              src={arrowDownSvg}
              alt=""
              className={Boolean(anchorEl) ? styles['reversal'] : ''}
            />
            {!defaultOptions.includes(showItemStr) && (
              <div className={styles['sub-heading']}>{title}</div>
            )}
          </div>
        )}
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

export default SelectItem;
