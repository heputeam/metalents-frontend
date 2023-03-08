import { ICheckboxItem } from '@/components/CheckBoxGroup';
import FormCheckbox from '@/components/FormCheckbox';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const ExamCheckbox: React.FC = () => {
  const data = ['cartoon', 'futurism', 'other'];
  const [itemList, setItemList] = useState<ICheckboxItem[]>([]);
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    let dataList: ICheckboxItem[] = [];
    data?.map((item, index) => {
      let temp = {
        name: item,
        value: item,
      };
      dataList.push(temp);
    });
    setItemList(dataList);
  }, []);

  const handleChange = (name: string, value: string[]) => {
    setValue(value);
  };

  return (
    <div>
      <FormCheckbox
        name="style"
        data={itemList}
        value={value}
        label={<div style={{ marginRight: 132 }}>Style</div>}
        onChange={(name: string, value: string[]) =>
          handleChange('style', value)
        }
        className={styles['style-checkbox']}
      />
      <div>{value?.join(',')}</div>
    </div>
  );
};

export default ExamCheckbox;
