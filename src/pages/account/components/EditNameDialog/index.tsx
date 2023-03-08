import Dialog from '@/components/Dialog';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import Button from '@/components/Button';
import { IResponse } from '@/service/types';
import { InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { usePostUpdatePost } from '@/hooks/useChain';
import { IPostUpdatePostParams } from '@/service/chain/types';
import { MintContext, processFileName } from '../../mint/[orderId]';

interface IEditNameDialogState extends Partial<IPostUpdatePostParams> {
  visible: boolean;
}

const DialogKey = 'EditNameDialog'; // dialog 唯一值

export type IEditNameDialogProps = {
  onSuccess?: (data: IResponse<null | undefined>) => void;
};

const EditNameDialog: React.FC<IEditNameDialogProps> = ({ onSuccess }) => {
  const MaxLength = 100;

  const dispatch = useDispatch();

  const {
    applyingOrEditing,
    setApplyingOrEditing,
    currentPostId,
    setCurrentPostId,
  } = useContext(MintContext);

  // 提取dialog 状态
  const dialogState: IEditNameDialogState = useSelector<
    any,
    IDialogState & IEditNameDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[DialogKey],
  }));

  const [inputValue, setInputValue] = useState<string>('');
  const [isError, setIsError] = useState(false);

  const canEdit =
    !isError &&
    inputValue.length > 0 &&
    !(
      applyingOrEditing === 'applying' &&
      typeof currentPostId === 'number' &&
      currentPostId === dialogState.postId
    );

  const { run: submit, loading: isSubmitting } = usePostUpdatePost({
    ready: canEdit,
    onBefore: () => {
      setApplyingOrEditing?.('editing');
    },
    onSuccess,
    onFinally: () => {
      setApplyingOrEditing?.('idle');
      setCurrentPostId?.(undefined);
    },
  });

  useEffect(() => {
    if (!dialogState.visible) {
      setIsError(false);
      setInputValue('');
    }
  }, [dialogState.visible]);

  useEffect(() => {
    if (!dialogState.nftName) {
      return;
    }

    setInputValue(processFileName(dialogState.nftName).name);
  }, [dialogState.nftName]);

  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: DialogKey,
      },
    });
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="Edit the name"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['cancel-request-content']}>
        <div className={styles['input-box']}>
          <InputLabel
            htmlFor="name-input"
            classes={{ root: styles['input-label'] }}
          >
            Name of the NFT
          </InputLabel>

          <OutlinedInput
            id="name-input"
            fullWidth
            placeholder="Enter..."
            error={isError}
            value={inputValue}
            onChange={(event) => {
              if (event.target.value.length <= MaxLength) {
                setIsError(false);
                setInputValue(event.target.value);
              }
            }}
            onBlur={(event) => {
              if (event?.target.value.length === 0) {
                setIsError(true);
              }
            }}
            aria-describedby="name-input-text"
            sx={{
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-focused': {
                '.MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px',
                },
              },
              '&.Mui-error': {
                '.MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px',
                },
              },
              '.MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
                boxShadow: '3px 3px 12px rgba(0, 0, 0, 0.1)',
              },
              '.MuiOutlinedInput-input': {
                padding: '12px 20px 13px 20px',
              },
            }}
          />

          <Typography className={styles['helper-text']}>
            {isError ? `Required fields can't be blank` : <br />}
          </Typography>
        </div>

        <Stack direction="row" spacing={10} sx={{ marginTop: '17px' }}>
          <Button
            variant="outlined"
            size="large"
            style={{ width: '220px', height: '48px' }}
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            loading={isSubmitting}
            disabled={!canEdit}
            variant="contained"
            size="large"
            style={{ width: '240px', height: '48px' }}
            onClick={() => {
              if (
                dialogState.nftName &&
                typeof dialogState.nftDescription === 'string' &&
                typeof dialogState.postId === 'number'
              ) {
                submit({
                  nftName: `${inputValue}${
                    processFileName(dialogState.nftName).extension
                  }`,
                  nftDescription: dialogState.nftDescription,
                  postId: dialogState.postId,
                });
              }
            }}
          >
            Save
          </Button>
        </Stack>
      </div>
    </Dialog>
  );
};

export { EditNameDialog, DialogKey };
