import React from 'react';
import { uid } from 'react-uid';
import styles from './index.less';

interface IDescriptionProps {
  content: string;
  menuOptions: IMenuOptionItem[];
}

export interface IMenuOptionItem {
  key: string;
  value: string;
}

const index = ({ content, menuOptions }: IDescriptionProps) => {
  return (
    <div className={styles['description-container']}>
      <div className={styles['desc-title']}>About This Service</div>
      <div className={styles['desc-body']}>{content}</div>
      <div className={styles['desc-footer']}>
        {menuOptions[0] && (
          <>
            <h5>{menuOptions[0].key}</h5>
            <p>{menuOptions[0].value}</p>
          </>
        )}

        {menuOptions[1] && (
          <>
            <h5>{menuOptions[1].key}</h5>
            <p>{menuOptions[1].value}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default index;
