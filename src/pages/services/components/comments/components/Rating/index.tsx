import { Stack, Rating, Typography } from '@mui/material';
import styles from './index.less';

export const ratingLabels: { [index: string]: string } = {
  0: 'So bad',
  1: 'Not good',
  2: "It's just okay",
  3: 'Can be better',
  4: 'Very good!',
  5: 'Excellent job!',
};

export interface IRating {
  defaultValue?: number;
  value?: number | undefined | null;
  precision: number;
  showLabel?: boolean;
}

const MyRating: React.FC<IRating> = ({
  defaultValue,
  value,
  precision = 0.5,
  showLabel,
}) => {
  console.log('value: ', value);

  return (
    <Stack direction="row" alignItems="center" spacing={10}>
      <Rating
        defaultValue={defaultValue}
        value={value}
        precision={precision}
        readOnly
        sx={{
          fontSize: `16px`,
        }}
        classes={{
          root: styles['rating-root'],
          icon: styles['rating-icon'],
        }}
      />

      <Typography className={styles['rating']}>
        {value ? value?.toFixed(1) : '-'}
      </Typography>

      {showLabel && value && (
        <Typography className={styles['rating-text']}>
          {ratingLabels[Math.ceil(Number(value))]}
        </Typography>
      )}
    </Stack>
  );
};

export default MyRating;
