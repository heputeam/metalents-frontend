import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import styles from './index.less';

export interface ICheckboxItem {
  name: string;
  value: string;
}
export interface ICheckBoxGroup {
  name: string;
  items: ICheckboxItem[];
  value: string[];
  onChange?: (name: string, value: string[]) => void;
}

const CheckBoxGroup: React.FC<ICheckBoxGroup> = ({
  name,
  items,
  value = [],
  onChange,
}) => {
  const handleChange = (event: any) => {
    const _value = event.target.value;
    const _checked = event.target.checked;
    let temp = [...value];
    if (_checked) {
      temp.push(_value);
    } else {
      temp = temp.filter((v) => v !== _value);
    }
    onChange?.(name, temp);
  };

  return (
    <div className={styles['box-group']}>
      {items?.map((item: ICheckboxItem, index: number) => {
        return (
          <FormControlLabel
            key={item.value}
            label={item?.name}
            name={name}
            classes={{
              root: styles['label-root'],
              label: styles['checkbox-label'],
            }}
            control={
              <Checkbox
                value={item?.value}
                checked={value?.includes(item.value)}
                onChange={handleChange}
                classes={{ root: styles['checkbox-root'] }}
              />
            }
          />
        );
      })}
    </div>
  );
};

export default CheckBoxGroup;
