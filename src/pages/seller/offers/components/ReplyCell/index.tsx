import styles from './index.less';
import { Typography } from '@mui/material';
import moment from 'moment';

export interface IReplyCell {
  description: string;
  createdAt: number;
}

const ReplyCell: React.FC<IReplyCell> = ({ description, createdAt }) => {
  const formatedCreatedAt = moment(createdAt * 1000).format('MMM D,YYYY HH:mm');

  return (
    <div className={styles['reply-cell']}>
      <div>
        <Typography className={styles['reply']}>{description}</Typography>

        {createdAt && (
          <Typography variant="body2" className={styles['create-time']}>
            {formatedCreatedAt}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ReplyCell;
