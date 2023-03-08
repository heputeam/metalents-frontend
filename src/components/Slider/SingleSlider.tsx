import styled from '@emotion/styled';
import { Slider } from '@mui/material';

const MySlider = styled(Slider)(() => {
  return {
    '.MuiSlider-rail, .MuiSlider-track': {
      height: 3,
    },
    '.MuiSlider-thumb': {
      width: 11,
      height: 11,
    },
  };
});

interface ISingleSlider {
  min: number;
  max: number;
  name: string;
  value: number;
  setValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
}

const SingleSlider = ({ name, value, setValue, ...props }: ISingleSlider) => {
  const handleChangeSliderValue = (_e: any, value: number | number[]) => {
    setValue(name, value as number);
  };

  return (
    <MySlider
      value={value}
      aria-label="Small"
      valueLabelDisplay="auto"
      {...props}
      // onChangeCommitted={handleChangeSliderValue}
      onChange={handleChangeSliderValue}
    />
  );
};

export default SingleSlider;
