import Button from '@/components/Button';
import Toast from '@/components/Toast';
import React, { useCallback, useEffect, useMemo } from 'react';
import Experience from '../Experience';
import styles from './index.less';
import { IListItemType } from '../../apply';
import MediaSwiper from '@/components/MediaSwiper';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { IUserState, useDispatch, useSelector, history } from 'umi';
import { getUserPosts, postCreateOrUpdate } from '@/service/public';
import { postUserUpdateExperience } from '@/service/user';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { EPostType } from '@/service/user/types';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { Errors } from '@/service/errors';
import { useUploadFile } from '@/hooks/useUploadFile';
import { acceptFileType, getFileMaxSize } from '@/utils';

export type IStep2Props = {
  setActiveStep: (index: number) => void;
  experienceItem: IListItemType;
  setExperienceList: (value: IListItemType[]) => void;
  experienceList: IListItemType[];
  eeducationItem: IListItemType;
  setEeducationList: (value: IListItemType[]) => void;
  eeducationList: IListItemType[];
};

const Step2: React.FC<IStep2Props> = ({
  setActiveStep,
  experienceItem,
  setExperienceList,
  experienceList,
  eeducationItem,
  setEeducationList,
  eeducationList,
}) => {
  const {
    contentList,
    getContentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  const dispatch = useDispatch();
  const { uid } = useSelector<any, IUserState>((state) => state.user);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);
  const { run: runGetPortfolio, data } = useRequest(
    (params) => getUserPosts(params),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code !== 200) {
          Toast.error('Unknown system failure: Please try');
        } else {
          setContentList(
            data?.data?.list?.map((item: any) => ({
              ...item,
              fid: item.id,
              status: 'success',
            })) ?? [],
          );
        }
      },
    },
  );

  const { run: runUploadedPortfolio } = useRequest(
    (params) => postCreateOrUpdate(params),
    {
      manual: true,
      onSuccess: (data: any, params: any) => {
        const { code } = data;
        if (code === 200) {
          if (
            JSON.stringify(params) ===
            JSON.stringify([{ posts: [{ id: -1, type: EPostType.portfolio }] }])
          ) {
            Toast.warn('Nothing to upload');
          } else {
            runGetPortfolio({
              offset: 0,
              pageSize: 100,
              type: 2,
              userId: uid,
            });
            Toast.success('Successfully uploaded!');
          }
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );
  const { run: runUpdateExperience, loading } = useRequest(
    (params) => postUserUpdateExperience(params),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code === 200) {
          setActiveStep(2);
          history.replace('/seller/apply?tab=2');
          dispatch({
            type: 'user/queryUser',
          });
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );
  const handleExperienceAdd = () => {
    setExperienceList([...experienceList, experienceItem]);
  };
  const handleEeducationAdd = () => {
    setEeducationList([...eeducationList, eeducationItem]);
  };
  const checkValidRequire = () => {
    const flag1 = experienceList.every(
      (v) => v.industry && v.location && v.description,
    );
    const flag2 = eeducationList.every(
      (v) => v.industry && v.location && v.description,
    );
    return flag1 && flag2;
  };
  const handleParams = (list: any, type: number) => {
    return list.map((item: any) => {
      return {
        description: item.description,
        endTime: moment(item.end_time).unix(),
        id: 0,
        industry: item.industry,
        location: item.location,
        startTime: moment(item.start_time).unix(),
        type: type,
      };
    });
  };
  const checkValidYearLegal = () => {
    const fg1 = experienceList.every((v) => {
      return moment(v.start_time).unix() <= moment(v.end_time).unix();
    });
    const fg2 = eeducationList.every((v) => {
      return moment(v.start_time).unix() <= moment(v.end_time).unix();
    });
    return fg1 && fg2;
  };
  const checkValidYearFormat = () => {
    const fg1 = experienceList.every((v) => {
      return (
        /^[12]\d{3}$/g.test(v.start_time) && /^[12]\d{3}$/g.test(v.end_time)
      );
    });
    const fg2 = eeducationList.every((v) => {
      return (
        /^[12]\d{3}$/g.test(v.start_time) && /^[12]\d{3}$/g.test(v.end_time)
      );
    });
    return fg1 && fg2;
  };
  const checkValidYearRequire = () => {
    const f1 = experienceList.every((v) => v.start_time && v.end_time);
    const f2 = eeducationList.every((v) => v.start_time && v.end_time);
    return f1 && f2;
  };
  const handleSubmit = () => {
    if (!data?.data?.list?.length) {
      return Toast.error(`Please upload your portfolio.`);
    }
    if (!checkValidRequire()) {
      return Toast.error(`Required fields can't be blank`);
    }
    if (!checkValidYearRequire()) {
      return Toast.error(`The starting and ending time can't be blank.`);
    }
    if (!checkValidYearFormat()) {
      return Toast.error(
        `The starting and ending time must be the year number.`,
      );
    }
    if (!checkValidYearLegal()) {
      return Toast.error(
        'Incorrect date. Start time should be earlier than the end time.',
      );
    }
    const experList = handleParams(experienceList, 2);
    const eeduList = handleParams(eeducationList, 1);

    const params = {
      experience: [...experList, ...eeduList],
    };
    runUpdateExperience(params);
  };

  const handleUploadPortfolio = () => {
    if (contentList.length === 0) {
      runUploadedPortfolio({
        posts: [{ id: -1, type: EPostType.portfolio }],
      });
    } else {
      let posts = getContentList()
        .filter((item) => item.status === 'success')
        .map((item) => ({
          ...item,
          fileThumbnailUrl: item.fileUrl,
          id: 0,
          type: EPostType.portfolio,
          userId: uid,
        }));

      runUploadedPortfolio({
        posts,
      });
    }
  };

  const acceptedFileType = useMemo(() => {
    return fileConfig?.user_posts?.fileExt
      ? acceptFileType(fileConfig?.user_posts?.fileExt)
      : undefined;
  }, [fileConfig]);

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓ error code for test
        // if (resp.code !== 200) {
        batchAfterSuccess(params[0].fid, resp?.data.path);
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
        accept: acceptedFileType,
        limitSize: getFileMaxSize(fileConfig?.user_posts?.fileMaxSize),
      });

      console.log('>>> errors xxx: ', errors);

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload, acceptedFileType],
  );

  const onSuccess = useCallback(
    (file: IFileWithFid): void => {
      batchAfterSuccess(file.fid, file.fileUrl);
    },
    [batchAfterSuccess],
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

  useEffect(() => {
    if (!uid) return;
    runGetPortfolio({
      offset: 0,
      pageSize: 100,
      type: 2,
      userId: uid,
    });
  }, [uid]);

  return (
    <div className={styles['step2-wrap']}>
      <div className={styles['portfolio-box']}>
        <div className={styles['label-box']}>
          <label>Portfolio</label>
        </div>
        <MediaSwiper
          contentList={contentList}
          countLimit={fileConfig?.user_posts?.fileCount}
          limitSize={getFileMaxSize(fileConfig?.user_posts?.fileMaxSize)}
          beforeUpload={beforeUpload}
          onUploadSuccess={onSuccess}
          onError={onError}
          onRetry={onRetry}
          onDelete={setContentList}
          accept={
            fileConfig?.user_posts?.fileExt
              ? acceptFileType(fileConfig?.user_posts?.fileExt)
              : undefined
          }
          labelText={`Only ${fileConfig?.user_posts?.fileExt?.toUpperCase()} format, <${getFileMaxSize(
            fileConfig?.user_posts?.fileMaxSize,
          )}MB`}
        />
        <div className={styles['upload-button-box']}>
          <Button
            rounded
            variant="contained"
            sx={{ width: '190px', height: '28px' }}
            onClick={handleUploadPortfolio}
          >
            Upload your portfolio
          </Button>
        </div>
      </div>
      <div className={styles['experience-box']}>
        <Experience
          label="Experience"
          list={experienceList}
          setList={setExperienceList}
          onAdd={handleExperienceAdd}
        />
      </div>
      <div className={styles['eeducation-box']}>
        <Experience
          label="Education"
          type={2}
          list={eeducationList}
          setList={setEeducationList}
          onAdd={handleEeducationAdd}
        />
      </div>
      <div className={styles['submit-button-box']}>
        <Button
          loading={loading}
          variant="contained"
          size="large"
          sx={{ width: '240px', height: '48px' }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Step2;
