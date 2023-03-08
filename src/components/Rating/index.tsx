import { Stack, Rating } from '@mui/material';
import React from 'react';
import styles from './index.less';
import StarIcon from '@mui/icons-material/Star';

export const ratingLabels: { [index: string]: string } = {
  0: '',
  1: 'Not good',
  2: "It's just okay",
  3: 'Can be better',
  4: 'Very good!',
  5: 'Excellent job!',
};

export interface IRating {
  defaultValue?: number;
  value: number | null;
  size: number;
  precision: number;
  onChange?: (event: object, value: number | null) => void;
  readOnly?: boolean;
  className?: string;
  showLabel?: boolean;
  fontSize?: string;
  ratingDirection?: 'column' | 'row';
  hideScope?: boolean;
}

const MyRating: React.FC<IRating> = ({
  defaultValue,
  value,
  size,
  precision = 0.5,
  readOnly,
  onChange,
  className,
  showLabel,
  fontSize = '12px',
  ratingDirection = 'row',
  hideScope = false,
}) => {
  const [hover, setHover] = React.useState(-1);
  return (
    <div className={className}>
      <Stack direction="row" alignItems="center">
        <Rating
          defaultValue={defaultValue}
          value={value}
          // size={size}
          precision={precision}
          readOnly={readOnly}
          onChange={onChange}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          sx={{
            fontSize: `${size}px`,
          }}
          classes={{
            root: styles['rating-root'],
            icon: styles['rating-icon'],
            iconEmpty: styles['rating-empty'],
          }}
          emptyIcon={<StarIcon fontSize="inherit" />}
        />
        {!hideScope && (
          <span className={styles['rating']} style={{ fontSize: fontSize }}>
            {value ? value?.toFixed(1) : '-'}
          </span>
        )}

        {showLabel && ratingDirection === 'row' && (
          <div className={styles['rating-text-row']}>
            {hover !== -1
              ? ratingLabels[hover]
              : ratingLabels[Math.ceil(Number(value))]}
          </div>
        )}
      </Stack>
      {showLabel && ratingDirection === 'column' && (
        <div className={styles['rating-text-column']}>
          {hover !== -1
            ? ratingLabels[hover]
            : ratingLabels[Math.ceil(Number(value))]}
        </div>
      )}
    </div>
  );
};

export default MyRating;
