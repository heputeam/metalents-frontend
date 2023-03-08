import HomePage from './home';
import styles from './index.less';

export default function IndexPage() {
  return (
    <div className={styles['page-container']}>
      <HomePage />
    </div>
  );
}
