import { Skeleton } from '@mui/material';

import React, { useEffect, useState } from 'react';

export type ILoadImgProps = {
  url: string;
  width?: number;
  height?: number;
  onError?: () => void;
  onSuccess?: () => void;
};

export interface ISkeletionItem {
  width?: number;
  height?: number;
}

const SkeletionItem: React.FC<ISkeletionItem> = ({ width, height }) => (
  <Skeleton
    animation="wave"
    variant="rectangular"
    width={width || '100%'}
    height={height || '100%'}
  />
);

const LoadImg: React.FC<ILoadImgProps> = ({
  url,
  width,
  height,
  onError,
  onSuccess,
}) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const _img = new Image(width, height);

    _img.src = url;
    _img.onload = () => {
      setSrc(url);
      onSuccess?.();
    };
    _img.onerror = () => {
      onError?.();
    };
  }, [url]);

  if (!src) {
    return <SkeletionItem width={width} height={height} />;
  }

  return <img src={src} alt="Loadimg" />;
};

export default LoadImg;
