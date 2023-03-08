import Avatar from '@/components/Avatar';
import MyRating from '@/components/Rating';
import Flags from 'country-flag-icons/react/3x2';
import styles from './index.less';
import { history } from 'umi';
import { ICommentItem } from '.';

type ICountryType = keyof typeof Flags;

interface ICommentItemProps {
  commentItem: ICommentItem;
}

const CommentItem = ({ commentItem }: ICommentItemProps) => {
  const location = 'CN';
  const Flag = location ? Flags[commentItem.location as ICountryType] : null;

  return (
    <div className={styles['CommentItem-container']}>
      <div className={styles['header']}>
        <div
          className={styles['seller-info']}
          onClick={() =>
            history.push(
              `/account/profile?sidebar&userId=${commentItem.userAvatar.userId}`,
            )
          }
        >
          <Avatar
            src={
              commentItem.userAvatar.fileThumbnailUrl ||
              commentItem.userAvatar.fileUrl
            }
            sx={{
              width: 44,
              height: 44,
            }}
            className={styles['avatar']}
          >
            {commentItem.userName?.length > 0
              ? commentItem.userName.slice(0, 1).toLocaleUpperCase()
              : 'U'}
          </Avatar>
          <p>
            {commentItem.userName?.length > 0
              ? commentItem.userName
              : 'Unnamed'}
          </p>
          {Flag ? <Flag title={location} className={styles['flag']} /> : <></>}
        </div>

        <MyRating
          value={commentItem.scope}
          size={24}
          precision={0.1}
          fontSize="18px"
          readOnly
        />
      </div>
    </div>
  );
};

export default CommentItem;
