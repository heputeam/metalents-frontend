import Button from '@/components/Button';
import { IMenuInfo } from '@/service/public/types';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IMenuState, useSelector } from 'umi';
import { IFilters } from '../../market';
import styles from './index.less';

const status = ['All status', 'Waiting', 'Completed', 'Closed'];
interface IFilterCardProps {
  onChange: (values: IFilters) => void;
}
const FilterCard: React.FC<IFilterCardProps> = ({ onChange }) => {
  const { menus: menuList } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  const [cateGorys, setCateGorys] = useState<IMenuInfo[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);
  // const [statusActive, setStatusActive] = useState(0);

  useEffect(() => {
    if (menuList.length > 0) {
      const tempList = [...menuList];
      tempList.unshift({
        childServices: [],
        id: -1,
        parentId: 0,
        serviceColor: '',
        serviceName: 'All categories',
        sortIndex: 0,
      });
      setCateGorys(tempList);
    }
  }, [menuList]);
  return (
    <div className={styles['filter-card-wrap']}>
      <div className={styles['item-box']}>
        <div className={styles['label']}>Category:</div>
        <Grid wrap="wrap" columnSpacing={20} rowSpacing={30} container>
          {cateGorys?.map((item, index) => {
            return (
              <Grid
                item
                className={styles['label-content']}
                key={item.id}
                onClick={() => {
                  setActiveCategory(index);
                  onChange?.({
                    category: index === 0 ? '' : cateGorys[index]?.serviceName,
                    // status: statusActive,
                  });
                }}
              >
                <Button
                  color="primary"
                  variant={activeCategory === index ? 'contained' : 'outlined'}
                  disableElevation
                  className={`${
                    activeCategory === index ? styles['active'] : ''
                  }`}
                >
                  {item.serviceName}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </div>
      {/* <div className={styles['item-box']}>
        <div className={styles['label']}>Status:</div>
        <Grid wrap="wrap" spacing="26" container>
          {status?.map((item, index) => {
            return (
              <Grid
                item
                className={styles['label-content']}
                key={item}
                onClick={() => {
                  setStatusActive(index);
                  onChange?.({
                    category:
                      activeCategory === 0
                        ? ''
                        : cateGorys[activeCategory]?.serviceName,
                    status: index,
                  });
                }}
              >
                <Button
                  color="primary"
                  variant={statusActive === index ? 'contained' : 'text'}
                  className={`${
                    statusActive === index ? styles['active'] : ''
                  }`}
                  disableElevation
                >
                  {item}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </div> */}
    </div>
  );
};

export default FilterCard;
