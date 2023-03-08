import MyRating from '@/components/Rating';
import { getServiceComments } from '@/service/services';
import { toThousands } from '@/utils';
import { useRequest, useSetState, useUpdateEffect } from 'ahooks';
import BigNumber from 'bignumber.js';
import styles from './index.less';
import StarItem from './StarItem';

interface IResponse {
  code: number;
  data: {
    list: any[];
    overview: {
      avg: number;
      level1: number;
      level2: number;
      level3: number;
      level4: number;
      level5: number;
    };
    total: number;
  };
}

interface IStarsProps {
  serviceId: number;
}

const Stars = ({ serviceId }: IStarsProps) => {
  const { data } = useRequest<IResponse, any>(
    () => {
      return getServiceComments({
        pageSize: 0,
        offset: 0,
        serviceId: serviceId,
      });
    },
    {
      refreshDeps: [serviceId],
    },
  );

  const [starData, setStarData] = useSetState<{
    totalCount: number;
    rating: number | undefined | null;
    items: { precent: number; value: number }[];
  }>({
    totalCount: 0,
    rating: undefined,
    items: [...new Array(5)].fill({
      precent: 0,
      value: 0,
    }),
  });

  useUpdateEffect(() => {
    if (data?.code === 200) {
      setStarData({
        totalCount: data.data.total,
        rating: data.data.overview.avg ? Number(data.data.overview.avg) : null,
        items: [
          data.data.overview.level1,
          data.data.overview.level2,
          data.data.overview.level3,
          data.data.overview.level4,
          data.data.overview.level5,
        ].map((item) => {
          if (!data.data.total)
            return {
              precent: 0,
              value: 0,
            };
          return {
            value: item,
            precent: new BigNumber(
              item /
                Math.max(
                  data.data.overview.level1,
                  data.data.overview.level2,
                  data.data.overview.level3,
                  data.data.overview.level4,
                  data.data.overview.level5,
                ),
            )
              .dp(2)
              .times(100)
              .toNumber(),
          };
        }),
      });
    }
  }, [data]);

  return (
    <div className={styles['stars-container']}>
      <div className={styles['stars-header']}>
        <h5>
          {toThousands(starData.totalCount)}{' '}
          {Number(starData.totalCount) > 1 ? 'Comments' : 'Comment'}
        </h5>
        <MyRating
          value={starData.rating || 0}
          size={22}
          precision={0.1}
          showLabel
          readOnly
          ratingDirection="row"
          className={styles['comment-star']}
        />
      </div>

      <div className={styles['stars-group']}>
        {starData.items.map((item, index) => {
          return (
            <StarItem key={index} label={`${index + 1} stars`} {...item} />
          );
        })}
      </div>
    </div>
  );
};

export default Stars;
