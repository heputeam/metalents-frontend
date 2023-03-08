import React from 'react';
import CheckBoxGroup, { ICheckboxItem } from '../CheckBoxGroup';
import styles from './index.less';

export interface IFormCheckbox {
  name: string;
  label?: string | React.ReactChild;
  className?: string;
  data: ICheckboxItem[];
  value: string[];
  onChange?: (name: string, value: string[]) => void;
}

const FormCheckbox: React.FC<IFormCheckbox> = ({
  name,
  label,
  className,
  data,
  value,
  onChange,
}) => {
  return (
    <>
      {data?.length > 0 && (
        <div className={className}>
          <div className={styles['label']}>{label}</div>
          <CheckBoxGroup
            items={data}
            value={value}
            name={name}
            onChange={onChange}
          />
        </div>
      )}
    </>
  );
};

export default FormCheckbox;
