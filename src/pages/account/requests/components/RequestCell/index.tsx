import styles from './index.less';
import { history } from 'umi';
import { Typography } from '@mui/material';
import moment from 'moment';
import Toast from '@/components/Toast';
import { ERequestStatus } from '@/service/user/types';

export interface IFirstCell {
  id: number;
  description: string;
  createdAt: number;
  modifyAt: number;
  status: ERequestStatus;
}

const RequestCell: React.FC<IFirstCell> = ({
  id,
  description,
  createdAt,
  modifyAt,
  status,
}) => {
  // 跳转详情
  const goDetail = () => {
    if (status === ERequestStatus.disable) {
      history.push('/request/disabled');
    } else {
      history.push(`/request/details?requestId=${id}`);
    }
  };

  const formatedCreateAt = moment(createdAt * 1000).format('MMM D,YYYY HH:mm');
  const formatedCreateAtAdd7Days = moment(createdAt * 1000)
    .add(7, 'days')
    .format('MMM D,YYYY HH:mm');
  const formatedModifyAt = moment(modifyAt * 1000).format('MMM D,YYYY HH:mm');

  return (
    <div className={styles['service-cell']}>
      <div>
        <div className={styles['service-title']} onClick={goDetail}>
          <a data-underline>{description}</a>
        </div>

        {createdAt && modifyAt && (
          <Typography variant="body2" className={styles['create-time']}>
            {status === ERequestStatus.waiting
              ? `${formatedCreateAt} - ${formatedCreateAtAdd7Days}`
              : `${formatedCreateAt} - ${formatedModifyAt}`}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default RequestCell;
