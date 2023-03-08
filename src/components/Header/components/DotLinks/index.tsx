import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { BOUNCE_FINANCE_PATH, FANGIBLE_PATH, METAVERSE_PATH } from '@/define';

import styles from './index.less';
import { ColoredDots, Dots } from '@/components/Header/components/Icons/Dots';
import { Plus } from '@/components/Header/components/Icons/Plus';
import { ShortLogo } from '@/components/Header/components/Icons/ShortLogo';
import { MetaverseIcon } from '../Icons/Metaverse';

export const DotLinks: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={`${className} ${styles['dot-wrap']}`}>
      <button className={styles['toggle']}>
        <ColoredDots className={styles['colored']} />
        <Dots />
      </button>
      <div className={styles.dropdown}>
        <List className={styles['list']}>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              className={styles['link']}
              target="_blank"
              href={FANGIBLE_PATH}
            >
              <ListItemIcon className={styles['item-icon']}>
                <Plus />
              </ListItemIcon>
              <ListItemText primary="Fangible" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              className={styles['link']}
              target="_blank"
              href={METAVERSE_PATH}
            >
              <ListItemIcon className={styles['item-icon']}>
                <MetaverseIcon />
              </ListItemIcon>
              <ListItemText primary="Metaverse" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              className={styles['link']}
              target="_blank"
              href={BOUNCE_FINANCE_PATH}
            >
              <ListItemIcon className={styles['item-icon']}>
                <ShortLogo />
              </ListItemIcon>
              <ListItemText primary="Bounce Finance" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </div>
  );
};
