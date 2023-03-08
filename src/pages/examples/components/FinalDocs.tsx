import FinalDocs from '@/components/FinalDocs';
import { IFileWithStatus, useSwiperContent } from '@/hooks/useSwiperContent';
import { useCallback, useEffect, useState } from 'react';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Errors } from '@/service/errors';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import Toast from '@/components/Toast';

export type IFinalDocsProps = {};

const FinalDocsDemo: React.FC<IFinalDocsProps> = ({}) => {
  const {
    contentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  const initialFileList = [
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650675914669-3a577cc45b22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2OHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650653823474-233c6630c5e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMjl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650640719471-382a3d711393?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650646219726-10b6ae6786f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNTN8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650548211932-f6ebd1c73867?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNjR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650599811699-a531af8496dd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxODN8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650613232111-ede1b93323d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMTh8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650598633444-fb5826f5b2de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMzZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650618319276-f2acb4454e9e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNDZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
    // {
    //   fileUrl:
    //     'https://images.unsplash.com/photo-1650561684004-68ef368cf156?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyODZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    //   fileName: '',
    //   fileSize: '',
    //   fileType: 'image/png',
    //   fid: String(Date.now()),
    //   status: 'success',
    // },
  ] as IFileWithStatus[];

  useEffect(() => {
    setContentList(initialFileList);
  }, []);

  const LimitSize = 100;

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓  error code for test
        // if (resp.code !== 200) {
        batchAfterSuccess(params[0].fid, resp?.data.path);
        Toast.success('Successfully uploaded!');
      } else {
        batchAfterError(params[0].fid);
        Toast.error(Errors[resp.code] || Errors['*']);
      }
    },
    onError: (resp: any, params: any) => {
      batchAfterError(params[0].fid);
      Toast.error(Errors[resp.code] || Errors['*']);
    },
  });

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        limitSize: LimitSize,
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload],
  );

  const onError = useCallback(
    (_, file) => {
      if (file) {
        batchAfterError(file?.fid);
      }
    },
    [batchAfterError],
  );

  const onRetry = useCallback(
    (file) => {
      if (file?.originFileObj) {
        uploadFile(file.originFileObj);
        batchAfterRetry(file.fid);
      }
    },
    [uploadFile, batchAfterRetry],
  );

  const onSuccess = useCallback(
    (file: IFileWithFid): void => {
      batchAfterSuccess(file.fid, file.fileUrl);
    },
    [batchAfterSuccess],
  );

  return (
    <FinalDocs
      character="seller"
      limitSize={LimitSize}
      initialLength={initialFileList.length}
      fileList={contentList}
      deliverBefore={Math.floor(Date.now() / 1000)}
      beforeUpload={beforeUpload}
      onUploadSuccess={onSuccess}
      onError={onError}
      onRetry={onRetry}
      onDelete={setContentList}
      onCancel={() => {
        setContentList(initialFileList);
      }}
      onReupload={() => {
        setContentList([]);
      }}
      onSubmit={() => {
        console.log('>>> result: ', contentList);
      }}
    />
  );
};

export default FinalDocsDemo;
