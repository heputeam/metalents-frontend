import React from 'react';
import { Box, Divider } from '@mui/material';

import Uploader from '@/components/Uploader';
import AvatarUploader from '@/components/AvatarUploader';
import BannerUploader from '@/components/BannerUploader';
import LikeService from '@/components/LikeService';
import LikeSeller from '@/components/LikeSeller';

import DialogExample from './components/Dialog';
import ToastExample from './components/Toast';
import RequestExample from './components/Request';
import FontExample from './components/Fonts';
import RatingExample from './components/Rating';
import Avatar from './components/Avatar';
import ExamPagination from './components/Pagination';
import LikesExample from './components/Likes';
import PosterCard from './components/PosterCard';
// import MediaSwiper from '@/components/MediaSwiper';
import PriceInput from './components/PriceInput';
import Loading from '@/components/Loading';
import ExamCheckbox from './components/ExamCheckbox';
import Switch from './components/Switch';
import ThumbSwiperExample from './components/ThumbSwiperExample';
import ButtonsExample from './components/Buttons';
import FinalDocsDemo from './components/FinalDocs';
export type IExampleProps = {};

const ExampleBox: React.FC<{ title: string; bgcolor?: string }> = ({
  children,
  title,
  bgcolor,
}) => {
  return (
    <Box sx={{ mx: 50, bgcolor }}>
      {children}
      <Divider textAlign="left" sx={{ py: 20 }}>
        {`<${title}/>`}
      </Divider>
    </Box>
  );
};

const Example: React.FC<IExampleProps> = ({}) => {
  // 这里不放任何状态State，请在./components/对应组件创建

  return (
    <div style={{ paddingTop: 50 }}>
      <ExampleBox title="Buttons">
        <ButtonsExample />
      </ExampleBox>
      <ExampleBox title="Dialog">
        <DialogExample />
      </ExampleBox>
      <ExampleBox title="Toast">
        <ToastExample />
      </ExampleBox>
      <ExampleBox title="Avatar">
        <Avatar />
      </ExampleBox>
      <ExampleBox title="AvatarUploader">
        <AvatarUploader
          size={50}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6VQ4ZUSem9Q1bzyx4T5D5oJ8JK4JD215BfA&usqp=CAU"
        />
      </ExampleBox>
      <ExampleBox title="Request">
        <RequestExample />
      </ExampleBox>
      <ExampleBox title="Font">
        <FontExample />
      </ExampleBox>
      <ExampleBox title="Loading">
        <Loading />
        <Loading color="red" />
      </ExampleBox>
      <ExampleBox title="Rating">
        <RatingExample />
      </ExampleBox>
      <ExampleBox title="Likes">
        <LikesExample />
        <div>
          <label>点赞Service && 点赞Seller</label>
          <br />
          <LikeService serviceID={1} />
          <LikeSeller sellerID={2} />
        </div>
      </ExampleBox>
      <ExampleBox title="Uploader" bgcolor="#ddd">
        <Uploader>
          <div style={{ border: '1px solid red' }}>
            <h1>上传区域</h1>
            <h1>上传区域</h1>
            <h1>上传区域</h1>
            <h1>上传区域</h1>
          </div>
        </Uploader>
      </ExampleBox>

      <ExampleBox title="BannerUploader">
        <BannerUploader bannerSrc="https://img2.baidu.com/it/u=2090606195,1473750087&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" />
      </ExampleBox>

      <ExampleBox title="Pagination">
        <ExamPagination />
      </ExampleBox>

      <ExampleBox title="PosterCard">
        <PosterCard />
      </ExampleBox>

      <ExampleBox title="ThumbSwiper">
        <ThumbSwiperExample />
      </ExampleBox>

      {/* <ExampleBox title="MediaSwiper">
        <MediaSwiper contentList={swiperContent} countLimit={4} />
      </ExampleBox>

      <ExampleBox title="MediaSwiper size='medium' canUpload={false} canDelete={false}">
        <MediaSwiper
          contentList={swiperContent}
          canUpload={false}
          canDelete={false}
          size="medium"
        />
      </ExampleBox> */}

      <ExampleBox title="PriceInput">
        <PriceInput />
      </ExampleBox>

      <ExampleBox title="Checkbox">
        <ExamCheckbox />
      </ExampleBox>

      <ExampleBox title="Switch">
        <Switch />
      </ExampleBox>

      <ExampleBox title="FinalDocs">
        <FinalDocsDemo />
      </ExampleBox>
    </div>
  );
};

export default Example;
