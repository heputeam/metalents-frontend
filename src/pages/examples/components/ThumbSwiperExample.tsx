import Button from '@/components/Button';
import ThumbSwiper from '@/components/ThumbSwiper';
import Toast from '@/components/Toast';
import { getUserPosts, postCreateOrUpdate } from '@/service/public';
import { IResponse } from '@/service/types';
import {
  EPostType,
  IClearPostParams,
  IUpdatePostParams,
  IUpdatePostRespData,
} from '@/service/user/types';
import { IFile } from '@/types';
import { Stack } from '@mui/material';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { IUserState, useSelector } from 'umi';

export type IThumbSwiperExampleProps = {};

const ThumbSwiperExample: React.FC<IThumbSwiperExampleProps> = ({}) => {
  const { uid } = useSelector<any, IUserState>((state) => state.user);

  const [swiperList, setSwiperList] = useState<IFile[]>([]);

  const { data: postData, run: runGetPost } = useRequest<
    IResponse<IUpdatePostRespData>,
    []
  >(
    () =>
      getUserPosts({
        offset: 0,
        pageSize: 9,
        type: 2,
        userId: uid,
      }),
    {
      onSuccess: (response) => {
        console.log('get_user_posts resp: ', response);
        setSwiperList(response?.data?.list ?? []);
      },
      ready: !!uid,
    },
  );

  const { run: runUploadedPortfolio } = useRequest<
    IResponse<IUpdatePostParams>,
    [IUpdatePostParams | IClearPostParams]
  >((params) => postCreateOrUpdate(params), {
    manual: true,
    onSuccess: (data) => {
      const { code } = data;
      if (code === 200) {
        runGetPost();
        Toast.success('Successfully uploaded!');
      } else {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const handleUploadSuccess = (res: IFile) => {
    setSwiperList([
      ...swiperList,
      {
        fileName: res?.fileName,
        fileSize: res?.fileSize,
        fileType: res?.fileType,
        fileUrl: res?.fileUrl,
        fileThumbnailUrl: res?.fileUrl,
        id: 0,
        type: EPostType.portfolio,
      },
    ]);
  };

  const handleDelete = (list: IFile[]) => {
    setSwiperList(list);
  };

  const handleUploadPortfolio = () => {
    if (swiperList.length === 0) {
      runUploadedPortfolio({
        posts: [{ id: -1, type: 2 }],
      });
    } else {
      runUploadedPortfolio({
        posts: swiperList,
      });
    }
  };

  return (
    <Stack spacing={5}>
      <ThumbSwiper
        spaceBetween={36}
        slidesPerView={swiperList.length < 9 ? swiperList.length : 9}
        contentList={swiperList}
        countLimit={7}
        onUploadSuccess={handleUploadSuccess}
        onDelete={handleDelete}
      />

      <Button
        variant="contained"
        size="small"
        onClick={handleUploadPortfolio}
        sx={{ width: 'fit-content' }}
      >
        Upload portfolio
      </Button>
    </Stack>
  );
};

export default ThumbSwiperExample;
