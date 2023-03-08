import {
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import HeartSVG from '@/assets/imgs/header/heart.svg';
import MyAvatar from '@/components/Avatar';
import MyRating from '@/components/Rating';
import Loading from '@/components/Loading';
import Level from '@/components/Level';
import LikeService from '@/components/LikeService';
import LikeSeller from '@/components/LikeSeller';
import { history, useDispatch, useSelector } from 'umi';
import { IUserState } from '@/models/user';
import { IFavouriteSeller, IFovouriteService } from '@/service/user/types';
import { ITokenStateType } from '@/models/token';
import { lowPriceToken, numberDecimal } from '@/utils';

interface ISellerItem {
  data: IFavouriteSeller;
  onClose: () => void;
}

const SellerItem: React.FC<ISellerItem> = ({ data, onClose }) => {
  const handlePush = (url: string) => {
    history.push(url);
    onClose();
  };

  return (
    <div
      className={styles['seller-item']}
      onClick={() =>
        handlePush(`/seller/profile?sidebar&userId=${data?.sellerID}`)
      }
    >
      <div className={styles['avatar-box']}>
        <MyAvatar
          src={data?.avatar?.fileThumbnailUrl || data?.avatar?.fileUrl}
          sx={{ width: '36px', height: '36px' }}
        >
          {data?.shopname?.slice(0, 1)?.toLocaleUpperCase()}
        </MyAvatar>
        <Level level={data?.levels} className={styles['seller-level']} />
      </div>
      <div className={styles['center-box']}>
        <div className={styles['seller-name']}>{data?.shopname}</div>
        <MyRating
          value={Number(data?.scope ?? 0)}
          readOnly
          size={16}
          precision={0.1}
          className={styles['my-rating']}
        />
      </div>
      <LikeSeller
        sellerID={data?.sellerID}
        size={24}
        className={styles['heart']}
      />
    </div>
  );
};

export interface IServicesItem {
  data: IFovouriteService;
  onClose: () => void;
}

const ServicesItem: React.FC<IServicesItem> = ({ data, onClose }) => {
  const handlePush = (url: string) => {
    history.push(url);
    onClose();
  };

  const { tokens } = useSelector<any, ITokenStateType>(
    (state: any) => state?.coins,
  );

  const lowPrice = lowPriceToken(data?.subServices, tokens);

  return (
    <div
      className={styles['service-item']}
      onClick={() => handlePush(`/services/${data?.service_id}`)}
    >
      <div className={styles['item-top']}>
        {data?.posts?.[0]?.fileType?.includes('audio/mp4') ||
        data?.posts?.[0]?.fileType?.includes('video/mp4') ? (
          <video width="48px" height="48px">
            <source
              src={
                data?.posts?.[0]?.fileThumbnailUrl || data?.posts?.[0]?.fileUrl
              }
              type="video/mp4"
            />
          </video>
        ) : (
          <MyAvatar
            src={
              data?.posts?.[0]?.fileThumbnailUrl || data?.posts?.[0]?.fileUrl
            }
            variant="square"
            sx={{ borderRadius: '4px' }}
          />
        )}
        <Stack
          direction="row"
          flexDirection="column"
          ml={14}
          className={styles['overflow']}
        >
          {data?.subServices?.length > 0 ? (
            <div className={styles['volume']}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: 1.2,
                  marginRight: '2px',
                  fontFamily: 'HelveticaCondensed',
                }}
              >
                <strong>{lowPrice?.budgetAmount}</strong>
              </div>
              <div
                className={`${styles['price']} ${styles['overflow']}`}
              >{` ${lowPrice?.budgetToken?.toUpperCase()}/$${numberDecimal(
                lowPrice?.totalPrice,
                2,
              )}`}</div>
            </div>
          ) : (
            <div className={styles['no-price']}>Not in service</div>
          )}

          <MyRating
            value={Number(data?.scope ?? 0)}
            size={16}
            precision={0.1}
            readOnly
          />
        </Stack>
      </div>
      <div className={styles['item-bottom']}>
        <div className={styles['service-title']}>{data?.title}</div>
        <LikeService
          // like={currentLike}
          serviceID={data?.service_id}
          // sellerID={uid}
          size={24}
          className={styles['heart']}
          // onChange={() => setCurrentLike(!currentLike)}
        />
      </div>
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <div>{children}</div>}
    </div>
  );
};

export interface IFavouriteInfoTooltip {
  onClose: () => void;
}

const FavouriteInfoTooltip: React.FC<IFavouriteInfoTooltip> = ({ onClose }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState<number>(0);

  const [isFavServicesloading, setIsFavServicesLoading] = useState(true);
  const [isFavSellersloading, setIsFavSellersLoading] = useState(true);
  const [sellerList, setSellerList] = useState<IFavouriteSeller[] | null>([]);
  const [serviceList, setServiceList] = useState<IFovouriteService[] | null>(
    [],
  );

  const { favServices, favSellers } = useSelector<any, IUserState>(
    (state) => state.user,
  );

  useEffect(() => {
    if (favSellers) {
      setSellerList(favSellers);
    }
    if (favServices) {
      setServiceList(favServices);
    }
  }, [value, isFavServicesloading, isFavSellersloading]);

  useEffect(() => {
    if (!favServices) {
      setIsFavServicesLoading(true);
      dispatch({
        type: 'user/queryFavouriteServices',
      });
    } else {
      setIsFavServicesLoading(false);
    }
  }, [favServices]);

  useEffect(() => {
    if (!favSellers) {
      setIsFavSellersLoading(true);
      dispatch({
        type: 'user/queryFavouriteSellers',
      });
    } else {
      setIsFavSellersLoading(false);
    }
  }, [favSellers]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles['favourite-list']}>
      <Typography
        variant="h2"
        color="#111111"
        sx={{ fontWeight: 500, textAlign: 'center' }}
      >
        My Favourites
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: styles['tabs-root'],
            indicator: styles['tabs-indicator'],
          }}
        >
          <Tab
            label={`Services(${serviceList?.length || 0})`}
            classes={{ root: styles['tab-root'] }}
          />
          <Tab
            label={`Sellers(${sellerList?.length || 0})`}
            classes={{ root: styles['tab-root'] }}
            sx={{ ml: '40px' }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className={styles['content-box']}>
          {isFavServicesloading ? (
            <Loading className={styles['loading']} />
          ) : serviceList?.length === 0 ? (
            <div className={styles['no-data']}>no data</div>
          ) : (
            serviceList?.map((item: IFovouriteService, index: number) => {
              return <ServicesItem key={index} data={item} onClose={onClose} />;
            })
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={styles['content-box']}>
          {isFavSellersloading ? (
            <Loading className={styles['loading']} />
          ) : sellerList?.length === 0 ? (
            <div className={styles['no-data']}>no data</div>
          ) : (
            sellerList?.map((item: IFavouriteSeller, index: number) => {
              return <SellerItem key={index} data={item} onClose={onClose} />;
            })
          )}
        </div>
      </TabPanel>
    </div>
  );
};

const FavouriteInfo: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Tooltip
      open={open}
      disableFocusListener
      // disableHoverListener
      disableTouchListener
      title={<FavouriteInfoTooltip onClose={() => setOpen(false)} />}
      placement="bottom"
      onClose={() => setOpen(false)}
      classes={{ tooltip: styles['tooltip-box'] }}
    >
      <IconButton
        classes={{ root: styles['icon-btn'] }}
        onMouseEnter={() => setOpen(true)}
      >
        <img src={HeartSVG} />
      </IconButton>
    </Tooltip>
  );
};

export default FavouriteInfo;
