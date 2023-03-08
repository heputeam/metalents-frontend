import React from 'react';
import emojis from '../../assets/emoji/emoji.json';
import styles from './index.less';

export type IEmojiTooltipProps = {
  onClose: () => void;
  onSelect: ({}) => void;
};

const EmojiTooltip: React.FC<IEmojiTooltipProps> = ({ onClose, onSelect }) => {
  const { Emotions } = emojis;
  return (
    <>
      <ul className={styles['emoji-list']}>
        {Emotions?.length &&
          Emotions.map((v: { unicode: string; emoji: string }) => {
            // const imgUrl = require(`../../assets/emoji/icon/${v.unicode}.png`);
            const { unicode, emoji } = v;
            return (
              <li
                key={unicode}
                className={styles['emoji-item']}
                onClick={() => {
                  onSelect(v);
                  onClose();
                }}
              >
                {/* <img src={imgUrl} /> */}
                <span>{emoji}</span>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default EmojiTooltip;
