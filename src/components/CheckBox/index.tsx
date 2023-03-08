import styled from '@emotion/styled';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useField } from 'formik';
import styles from './index.less';
import checkedSvg from './assets/checked.svg';
import nocheckSvg from './assets/nocheck.svg';

const MyFormControlLabel = styled(FormControlLabel)(() => {
  return {
    '.MuiFormControlLabel-label': {
      fontWeight: 400,
      fontSize: 14,
    },
  };
});

interface ICheckBox {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number;
  mr?: number;
  name: string;
}

const CheckBox = ({ children = '', mr, ...props }: ICheckBox) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <MyFormControlLabel
      control={
        <div className={styles['checkbox-container']}>
          <input
            type="checkbox"
            {...field}
            {...props}
            className={styles['input']}
          />
          <img src={meta && meta.value ? checkedSvg : nocheckSvg} alt="" />
        </div>
      }
      label={children}
      sx={{ marginRight: mr }}
    />
  );
};

export default CheckBox;
