import {
  ClickAwayListener,
  InputBase,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import SearchSVG from '@/assets/imgs/header/search.svg';
import MyAvatar from '@/components/Avatar';
import { history } from 'umi';
import { useRequest } from 'ahooks';
import Loading from '@/components/Loading';
import { getSearch } from '@/service/general';
import { ISearchService, ISearchUsers } from '@/service/public/types';

export const NoData: React.FC = () => {
  return (
    <div className={styles['no-data']}>
      <Typography variant="body2" color="rgba(17, 17, 17, 0.5)">
        no data
      </Typography>
    </div>
  );
};

// interface ISearchItem {
//   avatar: string;
//   name: string;
// }
// interface ISearchData<T> {
//   services: T[];
//   shopname: T[];
// }
export interface ISearchList {
  searchVal: string;
  setSearchVal: (val: string) => void;
  onClose: () => void;
}

const SearchList: React.FC<ISearchList> = ({
  searchVal,
  setSearchVal,
  onClose,
}) => {
  const [servicesList, setServicesList] = useState<
    ISearchService[] | null | undefined
  >(null);
  const [usersList, setUsersList] = useState<ISearchUsers[] | null | undefined>(
    null,
  );
  const {
    data: searchData,
    run: runGetSearch,
    loading,
  } = useRequest<any, any>(() => getSearch(searchVal?.trim()), {
    debounceWait: 300,
    manual: true,
  });

  useEffect(() => {
    if (searchVal?.length > 2) {
      runGetSearch();
    }
  }, [searchVal]);

  useEffect(() => {
    setServicesList(searchData?.data?.services);
    setUsersList(searchData?.data?.users);
  }, [searchData]);

  const handleAll = () => {
    history.replace(`/?search=${encodeURIComponent(searchVal)}`);
    onClose();
    setSearchVal('');
  };

  const handlePush = (url: string) => {
    history.push(url);
    onClose();
    setSearchVal('');
  };

  return (
    <div className={styles['search-list']}>
      {loading ? (
        <Loading className={styles['loading']} />
      ) : (
        <div>
          <div className={styles['shopname-box']}>
            <Typography
              variant="body2"
              color="#000000"
              sx={{ fontWeight: 500 }}
            >
              Shop Name
            </Typography>
            {usersList === null || usersList === undefined ? (
              <NoData />
            ) : (
              usersList?.slice(0, 3)?.map((item, index) => {
                return (
                  <div
                    key={`shopname${index}`}
                    className={styles['item-box']}
                    onClick={() =>
                      handlePush(`/seller/profile?sidebar&userId=${item?.id}`)
                    }
                  >
                    <MyAvatar
                      src={
                        item?.avatar?.fileThumbnailUrl || item?.avatar?.fileUrl
                      }
                      sx={{ width: 44, height: 44, borderRadius: '50%' }}
                    >
                      {item?.shopname?.slice(0, 1)?.toLocaleUpperCase()}
                    </MyAvatar>
                    <div className={styles['shopname-name']}>
                      <a data-underline>{item?.shopname}</a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className={styles['service-box']}>
            <Typography
              variant="body2"
              color="#000000"
              sx={{ fontWeight: 500 }}
            >
              Services
            </Typography>
            {servicesList === null || servicesList === undefined ? (
              <NoData />
            ) : (
              servicesList?.slice(0, 3)?.map((item, index) => {
                return (
                  <div
                    key={`service${index}`}
                    className={styles['item-box']}
                    onClick={() => handlePush(`/services/${item?.id}`)}
                  >
                    {item?.posts?.[0]?.fileType?.includes('audio/mp4') ||
                    item?.posts?.[0]?.fileType?.includes('video/mp4') ? (
                      <video
                        width="48px"
                        height="48px"
                        style={{ cursor: 'pointer' }}
                      >
                        <source
                          src={
                            item?.posts?.[0]?.fileThumbnailUrl ||
                            item?.posts?.[0]?.fileUrl
                          }
                          type="video/mp4"
                        />
                      </video>
                    ) : (
                      <MyAvatar
                        variant="square"
                        src={
                          item?.posts?.[0]?.fileThumbnailUrl ||
                          item?.posts?.[0]?.fileUrl
                        }
                        sx={{ borderRadius: '4px' }}
                      />
                    )}
                    <div className={styles['service-name']}>
                      <a data-underline>{item?.title}</a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {((servicesList && servicesList?.length > 2) ||
            (usersList && usersList.length > 2)) && (
            <div onClick={handleAll} className={styles['view-all']}>
              <span>view all</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Search: React.FC = () => {
  const [searchVal, setSearchVal] = useState<string>('');
  const [inputBorder, setInputBorder] = useState<Boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleSearch = () => {
    if (searchVal) {
      history.replace(`/?search=${encodeURIComponent(searchVal)}`);
      setOpen(false);
      setSearchVal('');
    }
  };

  const handleFocus = () => {
    setInputBorder(true);
    setOpen(!!searchVal);
  };

  const handleBlur = () => {
    setInputBorder(false);
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearchVal(value);
    setOpen(!!value && value?.length > 2);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && e.target.value) {
      // 回车
      handleSearch();
      setSearchVal('');
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <div>
        <Tooltip
          title={
            searchVal && (
              <SearchList
                searchVal={searchVal}
                onClose={() => setOpen(false)}
                setSearchVal={setSearchVal}
              />
            )
          }
          placement="bottom-start"
          classes={{ tooltip: styles['tooltip-box'] }}
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <div className={styles['search']}>
            <InputBase
              classes={{
                root: `${styles['input-base']} ${
                  inputBorder && styles['active-input']
                }`,
              }}
              placeholder="Search by service, shopname"
              value={searchVal}
              onChange={(e) => handleChange(e)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e)}
              endAdornment={
                <img
                  src={SearchSVG}
                  onClick={handleSearch}
                  className={styles['search-icon']}
                />
              }
            />
          </div>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default Search;
