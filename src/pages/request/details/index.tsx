import MyStepper, { stepValueType } from '@/pages/seller/components/Stepper';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import MakeEditOfferDialog from '../components/MakeEditOfferDialog';
import CancelRequestDialog from '../components/CancelRequestDialog';
import DetailsContent from '../components/DetailsContent';
import OtherOfferCard from '../components/OtherOfferCard';
import OwnerOfferCard from '../components/OwnerOfferCard';
import PreviewDialog from '../components/PreviewDialog';
import { IUserState, useLocation, useSelector } from 'umi';
import { PAGE_SIZE, Status } from '../_define';
import Pagination from '@/components/Pagination';
import CancelOfferDialog from '../components/CancelOfferDialog';
import NoOffer from '../components/NoOffer';
import { useRequestDetails } from '@/hooks/useRequest';
import { useOtherOffers, useOwnerOffers } from '@/hooks/useUser';
import AcceptOfferDialog from '../components/AcceptOfferDialog';
import RejectOfferDialog from '../components/RejectOfferDialog';
import Loading from '@/components/Loading';
import { userCanCreateData } from '@/hooks/useOffers';
import RequestDisable from '../components/RequestDisable';
import { IDENTITY_TYPE } from '@/define';

export type IDetailsProps = {};

const Details: React.FC<IDetailsProps> = ({}) => {
  const { uid } = useSelector<any, IUserState>((state) => state?.user);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [current, setCurrent] = useState<number>(1);
  const [type, setType] = useState<number>(IDENTITY_TYPE.Other);
  const { query } = useLocation() as any;
  const { details, detailsLoading, detailsCode, getRequestDetails } =
    useRequestDetails(query?.requestId || 0, query?.offerId || 0);
  const { canCreateData, getCanCreate } = userCanCreateData(details?.id || 0);
  const {
    myOfferData,
    params: ownerParams,
    getOwnerOffer,
  } = useOwnerOffers({
    offset: 0,
    pageSize: PAGE_SIZE,
    requestId: details?.id || 0,
    status: 0,
  });
  const { otherOffers, loading, getOtherOffers } = useOtherOffers({
    offset: (current - 1) * PAGE_SIZE,
    pageSize: PAGE_SIZE,
    requestId: details?.id || 0,
    status: 0,
  });
  const handleChange = (event: object, current: number) => {
    setCurrent(current);
  };
  const { config } = useSelector((state: any) => state.config);

  const steps: stepValueType[] = [
    {
      label: 'Submit new request',
    },
    {
      label: 'Seller makes an offer',
    },
    {
      label: 'Communicate and select offer',
    },
    {
      label: `Confirm the order within ${config?.['REQ_NOOFFER_15_DAYS']?.cfgVal} days`,
    },
  ];

  useEffect(() => {
    if (
      details?.status === Status.Waiting &&
      (otherOffers.total || myOfferData.total)
    ) {
      setActiveStep(2);
    } else if (
      details?.status === Status.Completed ||
      details?.status === Status.Closed
    ) {
      setActiveStep(3);
    } else {
      setActiveStep(1);
    }
  }, [details, otherOffers, myOfferData]);
  useEffect(() => {
    if (!details || !uid) return;
    details?.userId === uid && setType(IDENTITY_TYPE.Owner);
  }, [details, uid]);
  return (
    <>
      {detailsLoading ? (
        <div className={styles['loading-box']}>
          <Loading className={styles['loading']} />
        </div>
      ) : (
        <>
          {detailsCode === 20317 ? (
            <RequestDisable />
          ) : (
            <div className={styles['details-page']}>
              <MyStepper
                value={steps}
                activeStep={activeStep}
                className={styles['step-style']}
              />
              <DetailsContent
                type={type}
                requestId={details?.id || 0}
                requestDetails={details}
                myOfferData={myOfferData}
                canCreateData={canCreateData}
                refreshDetails={() =>
                  getRequestDetails(query?.requestId, query?.offerId)
                }
                refreshMyOffer={() => getOwnerOffer(ownerParams[0])}
                refreshOtherOffer={() =>
                  getOtherOffers({
                    offset: (current - 1) * PAGE_SIZE,
                    pageSize: PAGE_SIZE,
                    requestId: details?.id,
                    status: 0,
                  })
                }
              />
              {loading ? (
                <div className={styles['loading-box']}>
                  <Loading className={styles['loading']} />
                </div>
              ) : (
                <div className={styles['offer-list-wrap']}>
                  <div className={styles['offer-title']}>
                    Offer List ({myOfferData?.total + otherOffers.total})
                  </div>
                  {myOfferData.total + otherOffers.total > 0 ? (
                    <div className={styles['list-wrap']}>
                      {type === IDENTITY_TYPE.Other &&
                        myOfferData?.list?.map((item) => {
                          return (
                            <OwnerOfferCard
                              offerData={item}
                              key={item.id}
                              refreshMyOffer={() =>
                                getOwnerOffer(ownerParams[0])
                              }
                              refreshCanCreate={() => getCanCreate()}
                            />
                          );
                        })}
                      {otherOffers?.list?.map((item) => {
                        return (
                          <OtherOfferCard
                            type={type}
                            offerData={item}
                            key={item?.userId}
                            requestDetails={details}
                            refreshDetails={() =>
                              getRequestDetails(
                                query?.requestId,
                                query?.offerId,
                              )
                            }
                            refreshOtherOffer={() =>
                              getOtherOffers({
                                offset: (current - 1) * PAGE_SIZE,
                                pageSize: PAGE_SIZE,
                                requestId: details?.id,
                                status: 0,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <NoOffer />
                  )}
                </div>
              )}
              {otherOffers?.total > 10 && (
                <div className={styles['pagination-box']}>
                  <Pagination
                    total={otherOffers?.total}
                    size={PAGE_SIZE}
                    current={current}
                    onChange={handleChange}
                  />
                </div>
              )}

              <MakeEditOfferDialog />
              <CancelRequestDialog />
              <CancelOfferDialog />
              <AcceptOfferDialog />
              <RejectOfferDialog />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Details;
