import { Box, IconButton, Slider } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import styles from './index.less';

import Dialog from '../Dialog';
import { IDialogState, useDispatch, useSelector } from 'umi';
import Cropper, { CropperProps } from 'react-easy-crop';
import Button from '../Button';

import { useLockFn, useSetState } from 'ahooks';
import { dataURLtoFile } from './dataURLtoFile';
import getCroppedImg, { getObjectURL } from '@/components/CropDialog/cropImage';

import MinusSVG from './assets/minus.svg';
import AddSVG from './assets/add.svg';
import RefreshSVG from './assets/refresh.svg';
import Refresh2SVG from './assets/refresh2.svg';

interface ICropDialog {
  fileOrigin: File | null;
  onChange?: (file: File) => Promise<boolean>;
  cropContainerWidth?: number;
  dialogWidth?: number;
  corpSetting?: Partial<CropperProps>;
  dialog_key?: string;
  maxSize?: number;
  onClose?: () => void;
}

const CropDialog: React.FC<ICropDialog> = ({
  fileOrigin,
  onChange,
  cropContainerWidth,
  dialogWidth,
  corpSetting,
  onClose,
  dialog_key: coustom_dialog_key,
}) => {
  const dialog_key = coustom_dialog_key || 'cropDialog'; // dialog 唯一值
  const dispatch = useDispatch();
  const fileBlob = useMemo(() => getObjectURL(fileOrigin), [fileOrigin]);
  // 提取dialog 状态
  const dialogState = useSelector(({ dialog }: { dialog: IDialogState }) => {
    const _state = dialog[dialog_key];
    return {
      visible: _state?.visible,
      callback: _state?.callback,
    };
  });

  const [crop, setCrop] = useSetState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, [dialogState.visible]);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 关闭 dialog
  const handleClose = () => {
    onClose?.();
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveImage = useLockFn(async () => {
    if (!fileBlob || !croppedAreaPixels) return;

    setLoading(true);

    const croppedImage = await getCroppedImg(
      fileBlob,
      croppedAreaPixels,
      rotation,
    );

    const fileNameSlices = fileOrigin?.name.split('.').slice(0, -1);
    fileNameSlices?.push('webp');
    const newFileName = fileNameSlices?.join('.');

    if (croppedImage) {
      const file = new window.File(
        [croppedImage],
        newFileName || 'unnamed-file.webp',
        { type: 'image/webp' },
      );

      dialogState?.callback(file);

      onChange?.(file);
    }

    setLoading(false);
  });

  return (
    <Dialog
      visible={dialogState.visible}
      title="Edit image"
      onClose={handleClose}
      backBtn={<div />}
    >
      <Box sx={{ height: 'auto', width: dialogWidth || 600 }}>
        <div className={styles['updata-dialog']}>
          <Box
            className={styles['crop-container']}
            sx={{ width: cropContainerWidth || '100%' }}
          >
            <Cropper
              image={fileBlob}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              // restrictPosition={false}
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              {...corpSetting}
            />
          </Box>
          <div className={styles['controls']}>
            <div className={styles['slider-box']}>
              <IconButton
                onClick={() => {
                  if (zoom === 1) {
                    return;
                  }
                  setZoom(zoom - 0.1);
                }}
              >
                <img src={MinusSVG} alt="minus" />
              </IconButton>

              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                style={{ height: 8, width: 280 }}
                onChange={(_, value) => {
                  setZoom(value as number);
                }}
              />

              <IconButton
                onClick={() => {
                  if (zoom === 3) {
                    return;
                  }
                  setZoom(zoom + 0.1);
                }}
              >
                <img src={AddSVG} alt="add" />
              </IconButton>
            </div>

            <div className={styles['slider-box']}>
              <IconButton
                onClick={() => {
                  if (rotation - 10 < 0) {
                    return;
                  }
                  setRotation(rotation - 10);
                }}
              >
                <img src={RefreshSVG} alt="minus" />
              </IconButton>

              <Slider
                aria-label="custom thumb label"
                defaultValue={0}
                style={{ height: 8, width: 280 }}
                min={0}
                max={360}
                step={10}
                value={rotation}
                onChange={(_, value) => {
                  setRotation(value as number);
                }}
              />

              <IconButton
                onClick={() => {
                  if (rotation + 10 > 360) {
                    return;
                  }
                  setRotation(rotation + 10);
                }}
              >
                <img src={Refresh2SVG} alt="minus" />
              </IconButton>
            </div>

            <Button
              variant="contained"
              size="large"
              style={{
                width: 240,
                height: 48,
                marginTop: 55,
              }}
              loading={loading}
              onClick={handleSaveImage}
            >
              Upload
            </Button>
          </div>
        </div>
      </Box>
    </Dialog>
  );
};

export default CropDialog;
