import { ERequestStatus } from '@/service/user/types';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { useDispatch, useHistory } from 'umi';
import styles from './index.less';

export type IOperationCellProps = {
  requestId: number;
  orderId: number;
  requestStatus: ERequestStatus;
  onSuccess?: () => void;
};

const OperationCell: React.FC<IOperationCellProps> = ({
  requestId,
  orderId,
  requestStatus,
  onSuccess,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();

  switch (requestStatus) {
    case ERequestStatus.waiting:
      return (
        <Button
          classes={{ root: classNames(styles['btn'], styles['cancel-btn']) }}
          onClick={() => {
            dispatch({
              type: 'dialog/show',
              payload: {
                key: 'cancelRequestDialog',
                requestId: requestId,
                onSuccess,
              },
            });
          }}
        >
          Cancel
        </Button>
      );

    case ERequestStatus.completed:
      return (
        <Button
          classes={{
            root: classNames(styles['btn'], styles['order-detail-btn']),
          }}
          onClick={() => {
            history.push(`/orders/details?id=${orderId}`);
          }}
        >
          Order detail
        </Button>
      );

    default:
      return <></>;
  }
};

export default OperationCell;
