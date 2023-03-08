import React from 'react';
import Button from '../Button';
import { ButtonProps } from '@mui/material';
import { history, useDispatch, useSelector } from 'umi';
import Toast from '@/components/Toast';
import { IUserState } from '@/models/user';
export interface ISendMessageProps extends ButtonProps {
  targetId: string;
  svg: string;
  text: string;
}

const SendMessage: React.FC<ISendMessageProps> = ({
  targetId,
  svg,
  text,
  ...rest
}) => {
  const { uid } = useSelector<any, IUserState>((state) => state.user);
  const dispatch = useDispatch();
  const sendMessageClick = () => {
    if (!uid) {
      dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
      return;
    }
    if (Number(targetId) === uid) {
      return Toast.error(`You can't send message to yourself.`);
    }
    history.push({
      pathname: '/im',
      query: {
        targetId,
      },
    });
  };

  return (
    <Button
      {...rest}
      variant="contained"
      rounded
      startIcon={<img src={svg}></img>}
      onClick={sendMessageClick}
    >
      {text}
    </Button>
  );
};

export default SendMessage;
