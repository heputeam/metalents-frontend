import PosterCard, { ICardItem } from '@/components/PosterCard';
import { Stack } from '@mui/material';
import React from 'react';

export type IPosterCardProps = {};

const ExamPosterCard: React.FC<IPosterCardProps> = ({}) => {
  const items: ICardItem[] = [
    {
      seller: {
        avatar: {
          fileName: '',
          fileSize: 1000,
          fileType: 'image/png',
          fileUrl: '/imgs/test/2.png?t=1',
          fileThumbnailUrl: '/imgs/test/2.png?t=1',
        },
        nick: 'Jack.马',
        level: 3,
      },
      service: {
        serviceId: 0,
        level: 5,
        brochures: [
          {
            fileName: '',
            fileSize: 1000,
            fileType: 'image/png',
            fileUrl: '/imgs/test/2.png?t=1',
            fileThumbnailUrl: '/imgs/test/2.png?t=1',
          },
          {
            fileName: '',
            fileSize: 1000,
            fileType: 'image/png',
            fileUrl: '/imgs/test/2.png?t=1',
            fileThumbnailUrl: '/imgs/test/2.png?t=1',
          },
        ],
        packages: [
          {
            price: 8.524,
            usdPrice: 555,
            detail: `It's the title of the shop It's the title title of the It's,the title title of the It's th title title of the It's th title title of the It's th title title of the It's th`,
            coin: 'ETH',
          },
        ],
      },
    },
    {
      seller: {
        avatar: {
          fileName: '',
          fileSize: 1000,
          fileType: 'image/png',
          fileUrl: '/imgs/test/2.png?t=1',
          fileThumbnailUrl: '/imgs/test/2.png?t=1',
        },
        nick: 'Jack.马',
        level: 3,
      },
      service: {
        serviceId: 1,
        level: 5,
        brochures: [
          {
            fileName: '',
            fileSize: 1000,
            fileType: 'image/png',
            fileUrl: '/imgs/test/2.png?t=1',
            fileThumbnailUrl: '/imgs/test/2.png?t=1',
          },
          {
            fileName: '',
            fileSize: 1000,
            fileType: 'image/png',
            fileUrl: '/imgs/test/2.png?t=1',
            fileThumbnailUrl: '/imgs/test/2.png?t=1',
          },
        ],
        packages: [
          {
            price: 18.524,
            usdPrice: 555,
            detail: `It's the title of the shop It's the title title of the It's,the title title of the It's th`,
            coin: 'BNB',
          },
        ],
      },
    },
    {
      seller: {
        avatar: {
          fileName: '',
          fileSize: 1000,
          fileType: 'image/png',
          fileUrl: '/imgs/test/2.png?t=1',
          fileThumbnailUrl: '/imgs/test/2.png?t=1',
        },
        nick: 'Jack.马',
        level: 3,
      },
      service: {
        serviceId: 2,
        level: 5,
        brochures: [
          {
            fileName: '',
            fileSize: 1000,
            fileType: 'image/png',
            fileUrl: '/imgs/test/2.png?t=1',
            fileThumbnailUrl: '/imgs/test/2.png?t=1',
          },
        ],
        packages: [
          {
            price: 18.524,
            usdPrice: 555,
            detail: `It's the title of the shop It's the title title of the It's,the title title of the It's th`,
            coin: 'BNB',
          },
        ],
      },
    },
  ];
  return (
    <Stack spacing={22} justifyContent="center" direction="row">
      <PosterCard item={items[0]} />
      <PosterCard item={items[1]} />
      {/* 图片加载异常 */}
      <PosterCard item={items[2]} />
    </Stack>
  );
};

export default ExamPosterCard;
