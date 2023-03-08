import { deepOrange, deepPurple } from '@mui/material/colors';
import MyAvatar from './index';

export const Avatar = () => {
  return (
    <>
      <div>
        <MyAvatar>Homie</MyAvatar>
        <MyAvatar>H</MyAvatar>
        <MyAvatar />
      </div>
      <br />
      <div>
        <MyAvatar src={'https://mui.com/static/images/avatar/3.jpg'} />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <MyAvatar src={'https://mui.com/static/images/avatar/3.jpg'} />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <MyAvatar src={'https://mui.com/static/images/avatar/3.jpg'} />
      </div>

      <br />
      <div>
        <h2>可上传 ↓</h2>
        <MyAvatar src={'https://mui.com/static/images/avatar/3.jpg'} />
      </div>
    </>
  );
};

export default {
  title: 'Avatar',
  component: Avatar,
};
