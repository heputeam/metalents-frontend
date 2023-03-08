import React, { useEffect, useState } from 'react';
import styles from './index.less';
import bgSvg from './assets/bg.svg';
import { uid } from 'react-uid';
import { IService, ISubServices, ServiceIdType } from '../../type';
import BigNumber from 'bignumber.js';
import { useSelector } from 'umi';
import { ISubServiceInfo } from '@/service/services/types';
import { getCurrentToken, toThousands } from '@/utils';

interface IComparePackageProps {
  subservices: ISubServiceInfo[];
}

export const ComparePackage = ({ subservices }: IComparePackageProps) => {
  const [mockTable, setMockTable] = useState<IService[]>([]);
  const { tokens } = useSelector((state: any) => state.coins);

  useEffect(() => {
    if (subservices) {
      const mockData = subservices
        ?.filter((key) => key?.status === 1)
        ?.map((item) => {
          let tempToken = getCurrentToken(item?.coinId, tokens);
          return {
            type: item.level,
            price: `${item.budgetAmount} ${tempToken?.name?.toUpperCase()}`,
            subPrice: `$ ${
              (tokens &&
                new BigNumber(tempToken?.price || 0)
                  .times(item.budgetAmount)
                  .dp(2)
                  .toString()) ||
              '0'
            }`,
            delive: `${item.deliverTime} Days`,
            fina: `${
              item.revisions === -1 ? 'Unlimited' : item.revisions
            } Revisions`,
            document: item.finalDocs,
          };
        });

      setMockTable(mockData);
    }
  }, [subservices, tokens]);

  return (
    <div
      className={styles['compare-container']}
      style={{
        backgroundImage: `url(${bgSvg})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <p className={styles['title']}>Compare Packages</p>

      <div className={styles['table']}>
        <div className={styles['table-colum-1']}>
          <div></div>
          <div>Price</div>
          <div>Delivery time</div>
          <div>Final Documents</div>
        </div>
        {mockTable.map((item) => {
          return (
            <div key={uid(item)}>
              <div className={styles['table-header']}>
                {ServiceIdType[item.type]}
              </div>
              <div className={styles['table-price']}>
                <p>{toThousands(item.price)}</p>
                <span>= {toThousands(item.subPrice)}</span>
              </div>
              <div>{item.delive}</div>
              <div className={styles['table-final']}>
                {item.fina}
                <p>{item.document}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
