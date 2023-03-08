import React, { useState } from 'react';
import { Tooltip, ClickAwayListener } from '@mui/material';
import styles from './index.less';
import emojSvg from '../../assets/emoj.svg';
import EmojiTooltip from '../EmojiTooltip';

export type IEmojiProps = {
  onSelect: ({}) => void;
  // onOpenEmojiTooltip: () => void;
};

const Emoji: React.FC<IEmojiProps> = ({ onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Tooltip
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={
            <EmojiTooltip
              onClose={() => setOpen(false)}
              onSelect={(res) => {
                onSelect(res);
              }}
            />
          }
          placement="top"
          arrow
          classes={{
            tooltip: styles['emoji-tooltip'],
            arrow: styles['emoji-tooltip-arrow'],
          }}
          onClose={() => setOpen(false)}
        >
          <img
            className={styles['emoji-svg']}
            src={emojSvg}
            alt="emoji"
            onClick={() => {
              setOpen(true);
              // onOpenEmojiTooltip();
            }}
          />
        </Tooltip>
      </ClickAwayListener>
    </>
  );
};

export default Emoji;
