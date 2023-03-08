import React, { useState } from 'react';
import MyRating from '@/components/Rating';

export type IExamRatingProps = {};

const ExamRating: React.FC<IExamRatingProps> = ({}) => {
  const [value, setValue] = useState<number | null>(1.5);
  const handleChange = (e: object, val: number | null) => {
    setValue(val);
  };

  return (
    <>
      <MyRating value={value} size={18} precision={0.1} readOnly />
      <MyRating
        value={value}
        size={24}
        precision={0.5}
        showLabel
        onChange={handleChange}
      />
      <MyRating
        value={value}
        size={32}
        precision={1}
        showLabel
        onChange={handleChange}
        ratingDirection="column"
        hideScope
      />
    </>
  );
};

export default ExamRating;
