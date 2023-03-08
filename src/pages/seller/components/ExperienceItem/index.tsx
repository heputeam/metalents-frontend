import { IconButton, InputBase, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import styles from './index.less';
import LineSVG from '@/assets/imgs/seller/apply/line.svg';
import ShortLineSVG from '@/assets/imgs/seller/apply/shortLine.svg';
import AddSVG from '@/assets/imgs/seller/apply/add.svg';
import CareerSVG from '@/assets/imgs/seller/apply/career.svg';
import CompanySVG from '@/assets/imgs/seller/apply/company.svg';
import UniversitySVG from '@/assets/imgs/seller/apply/university.svg';
import DescriptionSVG from '@/assets/imgs/seller/apply/description.svg';
import CloseSVG from '@/assets/imgs/seller/apply/close.svg';
import { IListItemType } from '../../apply';

export type IExperienceProps = {
  value: IListItemType;
  index: number;
  len: number;
  edit: boolean;
  type: number;
  onAdd: () => void;
  onDelete: (id: number, index: number) => void;
  onChange: (index: number, type: string, value: string) => void;
};

const ExperienceItem: React.FC<IExperienceProps> = ({
  value,
  index,
  len,
  edit,
  type,
  onAdd,
  onDelete,
  onChange,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const handleFocus = () => {
    setIsFocus(true);
  };
  const handleBlur = () => {
    setIsFocus(false);
  };

  return (
    <div className={styles['experience-item-wrap']}>
      {edit ? (
        <div className={styles['experience-item']}>
          <div className={styles['year-box']}>
            <div className={styles['year-content']}>
              <InputBase
                classes={{ root: styles['inputBase-root'] }}
                autoComplete="off"
                placeholder="Year"
                value={value?.start_time}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={(e) => {
                  onChange(
                    index,
                    'start_time',
                    e.target.value.trim().replace(/^\D$/g, '').slice(0, 4),
                  );
                }}
              />
              <span className={styles['interval']}>-</span>
              <InputBase
                classes={{ root: styles['inputBase-root'] }}
                autoComplete="off"
                placeholder="Year"
                value={value?.end_time}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={(e) => {
                  onChange(
                    index,
                    'end_time',
                    e.target.value.trim().replace(/^\D$/g, '').slice(0, 4),
                  );
                }}
              />
            </div>
            <div className={styles['line']}>
              <img
                src={index === len - 1 && index !== 3 ? ShortLineSVG : LineSVG}
                alt=""
                height={index === len - 1 && index !== 3 ? 123 : 180}
              />
            </div>
            {len - 1 === index && index !== 3 && (
              <div className={styles['add']} onClick={onAdd}>
                <IconButton>
                  <img src={AddSVG} alt="" />
                </IconButton>
              </div>
            )}
          </div>
          <div
            className={`${styles['experience-box']} ${
              isFocus && styles['active']
            }`}
          >
            <div
              className={styles['close']}
              onMouseDown={() => onDelete(value.id, index)}
            >
              {isFocus && index !== 0 && <img src={CloseSVG} alt="" />}
            </div>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={CareerSVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <InputBase
                classes={{ root: styles['input-root'] }}
                placeholder={value?.industryPlaceHolder}
                autoComplete="off"
                value={value?.industry}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={(e) =>
                  onChange(index, 'industry', e.target.value.slice(0, 50))
                }
              />
            </div>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={type === 2 ? UniversitySVG : CompanySVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <InputBase
                classes={{ root: styles['input-root'] }}
                placeholder={value?.locationPlaceHolder}
                autoComplete="off"
                value={value?.location}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={(e) => {
                  onChange(index, 'location', e.target.value.slice(0, 50));
                }}
              />
            </div>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={DescriptionSVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <div className={styles['textare-box']}>
                <OutlinedInput
                  classes={{
                    root: styles['textarea-root'],
                    notchedOutline: styles['textarea-notchedOutline'],
                    input: styles['textarea-input'],
                  }}
                  placeholder={value?.descriptionPlaceHolder}
                  className={styles['textArea']}
                  multiline
                  inputProps={{ sx: { minHeight: '68px' } }}
                  value={value?.description}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 350);
                    setDescription(value);
                    onChange(index, 'description', value);
                  }}
                />
                <span className={styles['character-len']}>
                  ({description.length}/350)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`${styles['experience-item']} ${styles['not-edit-item']}`}
        >
          <div className={styles['year-box']}>
            <div className={styles['year-content']}>
              <span className={styles['year']}>{value?.start_time}</span>
              <span className={styles['interval']}>-</span>
              <span className={styles['year']}>
                {index === 0 ? 'Now' : value?.end_time}
              </span>
            </div>
            <div className={styles['line']}>
              <img src={LineSVG} alt="" height={180} />
            </div>
          </div>
          <div className={`${styles['experience-box']}`}>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={CareerSVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <div className={styles['item-text']}>{value?.industry}</div>
            </div>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={CompanySVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <div className={styles['item-text']}>{value?.location}</div>
            </div>
            <div className={styles['form-item']}>
              <div className={styles['item-icon']}>
                <img src={DescriptionSVG} alt="" />
                <span className={styles['point']}>·</span>
              </div>
              <div className={styles['item-textare']}>{value?.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceItem;
