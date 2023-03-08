import { EOfferStatus, IUserOffer } from '@/service/user/types';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { useDispatch, useHistory } from 'umi';
import styles from './index.less';

export type IOperationCellProps = {
  offerId: number;
  requestId: number;
  offerStatus: EOfferStatus;
  onSuccess?: () => void;
  offerData: IUserOffer;
};

const OperationCell: React.FC<IOperationCellProps> = ({
  offerId,
  requestId,
  offerStatus,
  onSuccess,
  offerData,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();

  switch (offerStatus) {
    case EOfferStatus.waiting:
      return (
        <div className={styles['waiting-operation-cell']}>
          <Button
            classes={{ root: classNames(styles['btn'], styles['edit-btn']) }}
            onClick={() => {
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'makeEditOfferDialog',
                  title: 'Edit my offer',
                  id: offerId,
                  requestId: requestId,
                  offerData,
                  onSuccess,
                },
              });
            }}
          >
            Edit
          </Button>

          <Button
            classes={{ root: classNames(styles['btn'], styles['cancel-btn']) }}
            onClick={() => {
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'cancelOfferDialog',
                  offerId,
                  onSuccess,
                },
              });
            }}
          >
            Cancel
          </Button>
        </div>
      );

    case EOfferStatus.accepted:
      return (
        <Button
          classes={{
            root: classNames(styles['btn'], styles['order-detail-btn']),
          }}
          onClick={() => {
            history.push(`/request/details?requestId=${requestId}`);
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
