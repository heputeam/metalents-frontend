import { postUpload } from '@/service/public';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';

export const useUploadFile = (options?: Options<any, any>) => {
  const result = useRequest((file: File) => {
    const formData = new FormData();
    formData.append('filename', file);

    return postUpload(formData);
  }, options);

  return result;
};
