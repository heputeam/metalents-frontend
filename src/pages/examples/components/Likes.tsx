import React, { useState } from 'react';
import Likes from '@/components/Likes';

export type IExamLikesProps = {};

const ExamLikes: React.FC<IExamLikesProps> = ({}) => {
  const [like, setLike] = useState<boolean>(false);
  return (
    <>
      <Likes value={like} onChange={setLike} size={100} />
      <Likes value={like} onChange={setLike} size={50} />
      <Likes value={like} onChange={setLike} />
      <Likes value={like} onChange={setLike} size={20} />
    </>
  );
};

export default ExamLikes;
