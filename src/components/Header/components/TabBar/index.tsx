import { Container, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import DotsMenuSVG from '@/assets/imgs/header/dots-menu.svg';
import styles from './index.less';
// import NavLink from '@/components/NavLink';
import {
  history,
  IUserState,
  useDispatch,
  useLocation,
  useSelector,
} from 'umi';
import { IMenuState } from '@/models/menu';
import { IMenuInfo } from '@/service/public/types';

interface IMoreMenuTab {
  tab: string[];
  moreMenus: { [key: string]: string[] };
  onClose: () => void;
}
const MoreMenuTab: React.FC<IMoreMenuTab> = ({ tab, moreMenus, onClose }) => {
  const [longMenu, setLongMenu] = useState<boolean>(true);
  const [boxWidth, setBoxWidth] = useState<number>(280); // 菜单较多时，flex-direction: column 横向宽度自适应没有撑开，手动计算宽度
  const [activeTab, setActiveTab] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('');
  const [allMenu, setAllMenu] = useState<string[]>([]);

  useEffect(() => {
    let tempArr = [];
    for (let key in moreMenus) {
      tempArr.push(key);
      tempArr.push(...moreMenus[key]);
    }
    setAllMenu(tempArr);
  }, [tab, moreMenus]);

  const { query }: any = useLocation();
  useEffect(() => {
    if (query?.tab) {
      setActiveTab(decodeURIComponent(query.tab));
      setActiveType('');
    }
    if (query?.type) {
      setActiveTab('');
      setActiveType(decodeURIComponent(query.type));
    }
  }, [query]);

  useEffect(() => {
    if (allMenu?.length > 8) {
      setLongMenu(true);
      const num = allMenu.length / 8;
      setBoxWidth(Math.ceil(num) * 280);
    } else {
      setLongMenu(true);
    }
  }, [allMenu]);

  const handleClick = (isTitle: boolean, item: string, index: number) => {
    let tabMenu = '';
    for (let i = index; i >= 0; i--) {
      let lastTitle = tab.includes(allMenu[i]);
      if (lastTitle) {
        tabMenu = allMenu[i];
        break;
      }
    }
    if (isTitle) {
      history.replace(`/?tab=${encodeURIComponent(tabMenu)}`);
    } else {
      history.replace(
        `/?tab=${encodeURIComponent(tabMenu)}&type=${encodeURIComponent(item)}`,
      );
    }
    onClose();
  };

  return (
    <div
      className={`${styles['menu-box']} ${styles['long-menu']} ${styles['more-tooltip']}`}
      style={{ width: longMenu ? boxWidth : 'auto' }}
    >
      {allMenu?.map((item, index) => {
        let isTitle = tab.includes(item);
        return (
          <div
            key={index}
            className={
              isTitle
                ? `${styles['menu-title']} ${
                    activeTab === item && styles['active-tab']
                  }`
                : `${styles['menu-item']} ${
                    activeType === item && styles['active-tab']
                  }`
            }
            onClick={() => handleClick(isTitle, item, index)}
          >
            {/* <NavLink path={`/?tab=${item}`}>{item}</NavLink> */}
            {item}
          </div>
        );
      })}
    </div>
  );
};

export interface ITabMenu {
  data: string[];
  tab: string;
  onClose: () => void;
}

const TabMenu: React.FC<ITabMenu> = ({ data, tab, onClose }) => {
  const [longMenu, setLongMenu] = useState<boolean>(false);
  const [boxWidth, setBoxWidth] = useState<number>(560); // 菜单较多时，flex-direction: column 横向宽度自适应没有撑开，手动计算宽度
  const [activeTab, setActiveTab] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('');
  const { query }: any = useLocation();
  useEffect(() => {
    if (query?.tab) {
      setActiveTab(decodeURIComponent(query.tab));
    }
    if (query?.type) {
      setActiveType(decodeURIComponent(query.type));
    }
  }, [query]);
  const menu = data;

  useEffect(() => {
    if (menu?.length > 16) {
      setLongMenu(true);
      const num = menu.length / 8;
      const left = menu.length % 8;
      setBoxWidth(Math.ceil(num) * 210);
    } else {
      setLongMenu(false);
    }
  }, [menu]);

  const handleClick = (item: string) => {
    history.replace(
      `/?tab=${encodeURIComponent(tab)}&type=${encodeURIComponent(item)}`,
    );
    onClose();
  };

  return (
    <div
      className={`${styles['menu-box']} ${
        styles[longMenu ? 'long-menu' : 'small-menu']
      }`}
      style={{ width: longMenu ? boxWidth : 'auto' }}
    >
      {menu?.map((item, index) => {
        return (
          <div
            key={index}
            className={`${styles['menu-item']} ${
              activeTab === tab && activeType === item && styles['active-tab']
            }`}
            onClick={() => handleClick(item)}
          >
            {/* <NavLink path={`/?tab=${item}`}>{item}</NavLink> */}
            {item}
          </div>
        );
      })}
    </div>
  );
};

interface ITooltipTab {
  data: string[];
  tab: string;
  isActive: boolean;
}
const TooltipTab: React.FC<ITooltipTab> = ({ data, tab, isActive }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { query } = useLocation() as any;

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    if (
      decodeURIComponent(query.tab) === tab &&
      decodeURIComponent(query?.type) === undefined
    ) {
      return;
    }
    history.replace(`/?tab=${encodeURIComponent(tab)}`);
  };

  return (
    <Tooltip
      title={open && <TabMenu data={data} tab={tab} onClose={handleClose} />}
      placement="bottom-start"
      classes={{ tooltip: styles['tooltip-box'] }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={handleClose}
    >
      <div
        className={`${styles['tab']} ${isActive && styles['active']} ${
          open && styles['hover-tab']
        }`}
        onClick={handleClick}
      >
        <span>{tab}</span>
        {open && <div className={styles['bold-tab']}>{tab}</div>}
      </div>
    </Tooltip>
  );
};

export type ITabBarProps = {};

const TabBar: React.FC<ITabBarProps> = ({}) => {
  const [tabList, setTabList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [menus, setMenus] = useState<{ [key: string]: string[] }>({});
  const { query }: any = useLocation();
  useEffect(() => {
    setActiveTab(decodeURIComponent(query.tab));
  }, [query]);

  const [rowTabList, setRowTabList] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [leftMenu, setLeftMenu] = useState<string[]>([]);
  const [moreMenus, setMoreMenus] = useState<{ [key: string]: string[] }>({});
  const uid = useSelector<any, IUserState>((state) => state.user.uid);
  const dispatch = useDispatch();

  const [openMoreMenu, setOpenMoreMenu] = useState<boolean>(false);

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

  useEffect(() => {
    let menusList: { [key: string]: string[] } = {};
    menuData?.map((item: IMenuInfo, index: number) => {
      menusList[item.serviceName] = item.childServices.map(
        (ele) => ele.serviceName,
      );
    });
    setMenus(menusList);
    const tempTab = Object.keys(menusList);
    setTabList(tempTab);
    setRowTabList(tempTab);
  }, [menuData]);

  useEffect(() => {
    if (ref && rowTabList.length > 0) {
      var a =
        document?.getElementById('box')?.getElementsByTagName('div') || [];
      const initTop = a[0].getBoundingClientRect().top;
      let sliceIndex = a.length;
      for (let i = 1; i < a.length; i++) {
        if (a[i].getBoundingClientRect().top !== initTop) {
          sliceIndex = i;
          break;
        }
      }
      if (a[sliceIndex]) {
        // 有换行
        const leftArr = tabList.slice(sliceIndex);
        setRowTabList(tabList.slice(0, sliceIndex));
        setLeftMenu(leftArr);
        let tempObj: { [key: string]: string[] } = {};
        leftArr.map((item, index) => {
          tempObj = {
            ...tempObj,
            [item]: menus[item],
          };
        });
        setMoreMenus(tempObj);
      }
    }
  }, [ref, menus]);

  return (
    <section className={styles['tab-bar']}>
      <Container maxWidth="lg" disableGutters>
        <div className={styles['flex-box']} id="box" ref={ref}>
          {rowTabList?.map((item, index) => {
            return (
              <TooltipTab
                key={index}
                tab={item}
                data={menus[item]}
                isActive={activeTab === item}
              />
            );
          })}
          {leftMenu?.length > 0 && (
            <Tooltip
              title={
                <MoreMenuTab
                  tab={leftMenu}
                  moreMenus={moreMenus}
                  onClose={() => setOpenMoreMenu(false)}
                />
              }
              classes={{ tooltip: styles['tooltip-box'] }}
              className={styles['dots-menu']}
              placement="bottom-end"
              open={openMoreMenu}
              onOpen={() => setOpenMoreMenu(true)}
              onClose={() => setOpenMoreMenu(false)}
            >
              <IconButton classes={{ root: styles['icon-btn'] }}>
                <img src={DotsMenuSVG} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Container>
    </section>
  );
};

export default TabBar;
