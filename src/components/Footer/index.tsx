import React from 'react';
import styles from './index.less';
import InstagramSVG from '@/assets/imgs/footer/instagram.svg';
import MediumSVG from '@/assets/imgs/footer/medium.svg';
import TwitterSVG from '@/assets/imgs/footer/twitter.svg';
import DiscordSVG from '@/assets/imgs/footer/discord.svg';
import NoteSVG from '@/assets/imgs/footer/note.svg';
import { IconButton, Tooltip } from '@mui/material';
import NavLink from '../NavLink';

export type IFooterProps = {};

/* 
底部导航：
Doc: https://docs.metalents.com/introduction/what-is-metalents

Instagram: https://www.instagram.com/metalents_hq/
Medium: https://medium.com/@metalents
Twitter: https://twitter.com/metalentshq
Discord: https://discord.gg/CjzRjhgUNd
邮箱：support@metalents.com
 */

const Footer: React.FC<IFooterProps> = ({}) => {
  return (
    <footer className={styles['footer']}>
      <Tooltip
        title="Instagram"
        arrow
        placement="top"
        classes={{
          tooltip: styles['tooltip'],
          arrow: styles['tooltip-arrow'],
        }}
      >
        <IconButton>
          <NavLink path="https://www.instagram.com/metalents_hq/">
            <img src={InstagramSVG} />
          </NavLink>
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Medium"
        arrow
        placement="top"
        classes={{
          tooltip: styles['tooltip'],
          arrow: styles['tooltip-arrow'],
        }}
      >
        <IconButton>
          <NavLink path="https://medium.com/@metalents">
            <img src={MediumSVG} />
          </NavLink>
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Twitter"
        arrow
        placement="top"
        classes={{
          tooltip: styles['tooltip'],
          arrow: styles['tooltip-arrow'],
        }}
      >
        <IconButton>
          <NavLink path="https://twitter.com/metalentshq">
            <img src={TwitterSVG} />
          </NavLink>
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Discord"
        arrow
        placement="top"
        classes={{
          tooltip: styles['tooltip'],
          arrow: styles['tooltip-arrow'],
        }}
      >
        <IconButton>
          <NavLink path="https://discord.gg/CjzRjhgUNd">
            <img src={DiscordSVG} />
          </NavLink>
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Email"
        arrow
        placement="top"
        classes={{
          tooltip: styles['tooltip'],
          arrow: styles['tooltip-arrow'],
        }}
      >
        <IconButton>
          <a href="mailto:support@metalents.com">
            <img src={NoteSVG} />
          </a>
        </IconButton>
      </Tooltip>

      <div className={styles['doc']}>
        <a
          href="https://docs.metalents.com/introduction/what-is-metalents"
          target="_blank"
          data-underline
        >
          Metalents Docs
        </a>
      </div>
    </footer>
  );
};

export default Footer;
