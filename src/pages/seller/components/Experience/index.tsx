import React from 'react';
import styles from './index.less';
import ExperienceItem from '../ExperienceItem';
import { IListItemType } from '../../apply';

export type IExperienceProps = {
  label?: string;
  list: IListItemType[];
  edit?: boolean;
  type?: number;
  setList: (value: IListItemType[]) => void;
  onAdd: () => void;
};

const Experience: React.FC<IExperienceProps> = ({
  label,
  list,
  edit = true,
  type = 1,
  setList,
  onAdd,
}) => {
  const handleAdd = () => {
    if (list?.length > 3) return;
    onAdd();
  };
  const handleDelete = (id: number, index: number) => {
    if (index === 0) return;
    setList(list.filter((v) => v.id !== id));
  };
  const handleChange = (index: number, type: string, value: string) => {
    setList(
      list.map((_item, _index) => {
        if (_index === index) {
          return { ..._item, [type]: value };
        }
        return _item;
      }),
    );
  };
  return (
    <div className={styles['experience-wrap']}>
      {label && (
        <div className={styles['label-box']}>
          <label>{label}</label>
        </div>
      )}

      {list?.map((item, index) => {
        return (
          <ExperienceItem
            key={item.id}
            value={item}
            index={index}
            len={list.length}
            edit={edit}
            type={type}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onChange={handleChange}
          />
        );
      })}
    </div>
  );
};

export default Experience;
