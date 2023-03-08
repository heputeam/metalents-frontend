import { toThousands } from '@/utils';
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

interface IDoubleSlider {
  min: number;
  max: number;
  name: string[];
  value: number[];
  setValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  scale?: (value: number) => number;
}

const DoubleSlider = ({
  name,
  value,
  setValue,
  scale,
  ...props
}: IDoubleSlider) => {
  const handleChangeSliderValue = (_e: any, value: number | number[]) => {
    (value as number[]).forEach((item, index) => {
      setValue(name[index], (scale && scale(item)) || item);
    });
  };

  return (
    <MySlider
      value={value}
      valueLabelDisplay="auto"
      valueLabelFormat={(value: number) => toThousands(value)}
      {...props}
      // onChangeCommitted={handleChangeSliderValue}
      onChange={handleChangeSliderValue}
      scale={scale}
    />
  );
};

export default DoubleSlider;
