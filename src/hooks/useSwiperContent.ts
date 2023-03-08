import {
  FileWithFid,
  IFileWithFid,
  IUploaderError,
} from '@/components/Uploader';
import { useGetState } from 'ahooks';
import { useCallback, useEffect } from 'react';

export type FileStatus = 'error' | 'success' | 'uploading';

export type IFileWithStatus = IFileWithFid & {
  status: FileStatus;
};

export const useSwiperContent = () => {
  const [contentList, setContentList, getContentList] = useGetState<
    IFileWithStatus[]
  >([]);

  useEffect(() => {
    console.log('>>> contentList: ', contentList);
  }, [contentList]);

  const checkFile = useCallback(
    ({
      file,
      accept,
      limitSize,
    }: {
      file: File;
      accept?: string[];
      limitSize?: number;
    }): IUploaderError[] => {
      const errors: IUploaderError[] = [];

      // 类型错误
      if (accept && !accept.some((v) => v === file.type)) {
        errors.push({
          msg: `上传文件类型错误：(${accept.join(',')})`,
          error: 'AcceptError',
        });
      }

      // 超过上限
      if (limitSize && file.size > limitSize * 1024 * 1024) {
        errors.push({
          msg: `上传文件大小超过限制：(${limitSize}MB)`,
          error: 'LimitError',
        });
      }

      return errors;
    },
    [],
  );

  const batchBeforeUpload = useCallback(
    (file: FileWithFid) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          const newList = [
            {
              id: 0,
              fileUrl: reader.result,
              fileThumbnailUrl: reader.result,
              fileName: file.name,
              fileSize: String(file.size),
              fileType: file.type,
              status: 'uploading' as FileStatus,
              fid: file.fid,
              originFileObj: file,
            },
            ...contentList,
          ];

          setContentList(newList);
        }
      });

      reader.readAsDataURL(file);
    },
    [contentList, setContentList],
  );

  const batchAfterSuccess = useCallback(
    (fid: string, fileUrl: string) => {
      const newList = getContentList().map((item) => {
        if (item.fid === fid) {
          return {
            ...item,
            fileUrl: fileUrl,
            status: 'success' as FileStatus,
          };
        }

        return item;
      });

      setContentList(newList);
    },
    [getContentList, setContentList],
  );

  const batchAfterError = useCallback(
    (fid: string) => {
      const newList = getContentList().map((item) => {
        if (item.fid === fid) {
          return {
            ...item,
            status: 'error' as FileStatus,
          };
        }

        return item;
      });

      setContentList(newList);
    },
    [getContentList, setContentList],
  );

  const batchAfterRetry = useCallback(
    (fid: string) => {
      const newList = getContentList().map((item) => {
        if (item.fid === fid) {
          return {
            ...item,
            status: 'uploading' as FileStatus,
          };
        }

        return item;
      });

      setContentList(newList);
    },
    [getContentList, setContentList],
  );

  return {
    contentList,
    getContentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  };
};
