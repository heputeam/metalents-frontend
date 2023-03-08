import Stars from './components/Stars';
import Comment from './components/Comment';
import styles from './index.less';

interface ICommentsProps {
  serviceId: number;
}

const Comments = ({ serviceId }: ICommentsProps) => {
  return (
    <div className={styles['comments-container']}>
      <Stars serviceId={serviceId} />
      <Comment serviceId={serviceId} />
    </div>
  );
};

export default Comments;
