import { useState } from 'react';
import CommentItem from './CommentItem';
import styles from './index.less';
import Pagination from '@/components/Pagination';
import { useRequest, useSetState } from 'ahooks';
import moment from 'moment';
import { IResponse } from '@/service/types';
import { uid } from 'react-uid';
import { getServiceComments } from '@/service/services';
import { Button, Typography } from '@mui/material';
import EmpytSVG from '@/assets/imgs/seller/profile/person.svg';
import { ReactComponent as TelescopeSVG } from '@/assets/imgs/account/mint/telescope.svg';
import { useDispatch, useSelector } from 'umi';
import { getCurrentToken } from '@/utils';
import Loading from '@/components/Loading';
import { IFile } from '@/types';
import PreviewDialog from '@/pages/request/components/PreviewDialog';
import FileBlock from '../FileBlock';

interface IResComment {
  list: {
    budgetAmount: string;
    coinId: number;
    comment: string;
    createdAt: number;
    id: number;
    orderId: number;
    deliverPosts: IFile[];
    scope: number;
    userAvatar: IFile;
    userLocation: string;
    userName: string;
  }[];
  overview: any;
  total: number;
}

export interface ICommentItem {
  commentText: string;
  date: number;
  posts: IFile[];
  money: string;
  scope: number;
  userName: string;
  userAvatar: IFile;
  location: string;
}

interface ICommentProps {
  serviceId: number;
}

const PAGE_SIZE = 10;

const Comment = ({ serviceId }: ICommentProps) => {
  const { tokens } = useSelector((state: any) => state.coins);

  const dispatch = useDispatch();

  const [pagination, setPagination] = useSetState({
    page: 1,
    total: 0,
    size: PAGE_SIZE,
  });

  const handlePreview = (posts: IFile[]) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'previewDialog',
        previewIndex: 0,
        disableDownload: true,
        posts: posts.map((post) => ({
          fileUrl: post.fileThumbnailUrl || post.fileUrl,
          fileName: post.fileName,
          fileSize: post.fileSize,
          fileType: post.fileType,
        })),
      },
    });
  };

  // Request 请求
  const { loading } = useRequest<IResponse<IResComment>, any>(
    () => {
      return getServiceComments({
        pageSize: PAGE_SIZE,
        offset: (pagination.page - 1 || 0) * 10,
        serviceId: serviceId,
      });
    },
    {
      refreshDeps: [serviceId, pagination.page],
      onSuccess: (resp) => {
        if (resp?.code === 200) {
          const _commentList = resp.data.list.map((commentItem) => {
            return {
              commentText: commentItem.comment,
              date: commentItem.createdAt,
              posts: commentItem.deliverPosts,
              money: `${commentItem.budgetAmount} ${
                getCurrentToken(commentItem.coinId, tokens)?.name
              }`,
              scope: commentItem.scope,
              userName: commentItem.userName,
              userAvatar: commentItem.userAvatar,
              location: commentItem.userLocation,
            };
          });

          setCommentList(_commentList);
        }
      },
    },
  );

  // State 数据
  const [commentList, setCommentList] = useState<ICommentItem[]>([]);

  const handleChange = (event: object, page: number) => {
    setPagination({
      page: page,
    });
  };

  return (
    <div className={styles['comment-container']}>
      {!loading ? (
        !commentList?.length ? (
          <div className={styles['empty-box']}>
            <img src={EmpytSVG} alt="" />
            <Typography className={styles['str']}>
              Sorry! No comments now.
            </Typography>
          </div>
        ) : (
          <>
            <div>
              {commentList?.map((commentItem) => {
                return (
                  <div
                    key={uid(commentItem)}
                    className={styles['comment-item']}
                  >
                    <CommentItem commentItem={commentItem} />
                    <div className={styles['comment-content']}>
                      <div className={styles['left-content']}>
                        <Typography className={styles['comment-desc']}>
                          {commentItem.commentText}
                        </Typography>
                        <div className={styles['comment-date']}>
                          {moment(commentItem.date * 1000).format(
                            'MMM D, YYYY HH:MM',
                          )}
                        </div>
                      </div>
                      <div className={styles['right-content']}>
                        {commentItem.posts?.length > 0 && (
                          <Button
                            className={styles['work-img-button']}
                            onClick={() => {
                              handlePreview(commentItem.posts);
                            }}
                          >
                            <div className={styles['mask']}>
                              <TelescopeSVG />
                            </div>

                            <FileBlock
                              width={91}
                              height={91}
                              fileUrl={
                                commentItem.posts[0].fileThumbnailUrl ||
                                commentItem.posts[0].fileUrl
                              }
                              fileType={commentItem.posts[0].fileType}
                              fileName={commentItem.posts[0].fileName}
                              skeletonSx={{ borderRadius: '6px' }}
                              blockStyle={{
                                borderRadius: '6px',
                              }}
                            />
                          </Button>
                        )}
                        <span className={styles['money']}>
                          {commentItem.money}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.total !== 0 && (
              <div className={styles['pagination-box']}>
                <Pagination
                  total={pagination.total}
                  size={pagination.size}
                  current={pagination.page}
                  onChange={handleChange}
                />
              </div>
            )}
          </>
        )
      ) : (
        <div className={styles['loading-box']}>
          <Loading />
        </div>
      )}

      <PreviewDialog />
    </div>
  );
};

export default Comment;
