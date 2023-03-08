import React, { useRef } from 'react';
import styles from './index.less';

import PhotoSVG from './assets/photo.svg';
import { Box, SxProps } from '@mui/material';
import { IFile } from '@/types';
import classNames from 'classnames';
import { postUpload } from '@/service/public';

// 视频需要扩展：| `video/${string}`
export type IAccept = 'image/jpeg' | 'image/png' | 'video/mp4';
export interface IUploaderError {
  msg: string;
  error: 'LimitError' | 'AcceptError' | 'Error' | 'NetworkError';
}

export type FileWithFid = File & { fid: string; originFileObj?: File };
export type IFileWithFid = IFile & { fid: string; originFileObj?: File };
export type ValidatorName = 'fileSize' | 'fileType';
export interface Validator {
  disabled: boolean;
}

export type IUploaderProps = {
  sx?: SxProps;
  // 是否启用, 默认true
  enable?: boolean;
  onChange?: (filelist: any[]) => void;
  // 上传图标
  icon?: string | null;
  // 限制大小
  limitSize?: number;
  // 限制数量（TODO：有缺陷，目前只是限制单选&多选）
  maxCount?: number;
  // 限制类型
  // accept?: IAccept[];
  accept?: string[];
  // 上传之前要做的事,返回文件继续上传，返回null自行处理
  onBefore?: (filelist: FileWithFid[]) => Promise<FileWithFid[] | null>;
  // 上传成功
  onSuccess?: (res: IFileWithFid) => void;
  // 上传失败
  onError?: (error: IUploaderError[], file?: FileWithFid) => void;
  validator?: Record<Partial<ValidatorName>, Validator>;
};

const Uploader: React.FC<IUploaderProps> = ({
  sx,
  icon,
  enable,
  children,
  onChange,
  onBefore,
  onSuccess,
  onError,
  limitSize = 7,
  maxCount = 1,
  accept,
  validator = { fileType: { disabled: false }, fileSize: { disabled: false } },
}) => {
  const refFile = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (refFile.current) {
      refFile.current.value = '';
    }
  };

  const handleUploader = async (files: File[]) => {
    const formData = new FormData();
    const errors: IUploaderError[] = [];

    files.forEach((file) => {
      console.log('file uploader--->', file);
      // 类型错误
      if (
        !validator.fileType.disabled &&
        accept &&
        !accept.includes(file.type)
      ) {
        errors.push({
          msg: `上传文件类型错误：(${accept.join(',')})`,
          error: 'AcceptError',
        });
        return;
      }

      // 超过上限
      if (!validator.fileSize.disabled && file.size > limitSize * 1024 * 1024) {
        errors.push({
          msg: `上传文件大小超过限制：(${limitSize}MB)`,
          error: 'LimitError',
        });
        return;
      }

      formData.append('filename', file);
    });

    // console.log('>>> *** errors: ', errors);

    if (errors.length) {
      onError?.(errors);
      return;
    }

    const defFile: any = files[0] || {};
    defFile.fid = `${defFile.name}_${defFile.size}`;

    await postUpload(formData)
      .catch((err: any) => {
        errors.push({
          msg: `NetworkError`,
          error: 'NetworkError',
        });

        return onError?.(errors, defFile);
      })
      .then((res: any) => {
        if (res?.code !== 200) {
          // ↓ error code for test
          // if (res?.code === 200) {
          errors.push({
            msg: `NetworkError`,
            error: 'NetworkError',
          });

          return onError?.(errors, defFile);
        }

        onSuccess?.({
          fid: `${defFile.name}_${defFile.size}`,
          fileSize: `${defFile.size}`,
          fileType: defFile.type,
          fileName: defFile.name,
          fileUrl: res?.data?.path,
        });
      });

    handleReset();
  };

  const handleChange = async (e: any) => {
    const target = e.target;
    const file = target?.files?.[0] || [];
    console.log('file select --->', file);
    if (!file) return;

    // 通知变更
    onChange?.(target?.files);

    if (!onBefore) {
      return handleUploader([file]);
    }

    file.fid = `${file.name}_${file.size}`;
    const _files = await onBefore?.([file]);

    if (_files?.length) {
      handleUploader(_files);
    }
  };

  if (!enable) {
    return <>{children}</>;
  }

  return (
    <Box sx={sx} className={styles['uploader-box']}>
      {children}
      <div
        className={classNames(
          styles['uploader-file'],
          icon && styles['uploader-file-masked'],
        )}
      >
        {icon && <img src={icon} alt="Uploader" />}
        <input
          ref={refFile}
          accept={accept?.join(',')}
          type="file"
          multiple={maxCount > 1}
          onChange={handleChange}
        />
      </div>
    </Box>
  );
};

export default Uploader;

Uploader.defaultProps = {
  icon: PhotoSVG,
  enable: true,
  onSuccess: (req) => {
    console.log('上传成功:', req);
  },
};
