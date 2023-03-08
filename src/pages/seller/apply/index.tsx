import React, { useEffect, useState } from 'react';
import MyStepper, { stepValueType } from '../components/Stepper';
import styles from './index.less';
import BackSVG from '@/components/Dialog/assets/back.svg';
import Step1 from '../components/ApplyStep1';
import Step2 from '../components/ApplyStep2';
import Step3 from '../components/ApplyStep3';
import { useLocation } from 'umi';
export interface IListItemType {
  industry: string;
  industryPlaceHolder: string;
  location: string;
  locationPlaceHolder: string;
  description: string;
  descriptionPlaceHolder: string;
  start_time: string;
  end_time: string;
  type: number;
  id: number;
}
export type ISellerApplyProps = {};
const steps: stepValueType[] = [
  {
    label: 'Basic Information',
  },
  {
    label: 'Further Information',
  },
  {
    label: 'Success',
  },
];

const SellerApply: React.FC<ISellerApplyProps> = ({}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const { query } = useLocation() as any;
  useEffect(() => {
    if (Number(query?.tab) === 2) {
      setActiveStep(2);
    }
  }, [query]);

  const handleBack = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);
  const experienceItem: IListItemType = {
    id: Date.now(),
    industry: '',
    industryPlaceHolder: 'Enter your title... ps.UI Designer',
    location: '',
    locationPlaceHolder: 'Enter company',
    description: '',
    descriptionPlaceHolder: 'Enter description',
    start_time: '',
    end_time: '',
    type: 2,
  };
  const eeducationItem: IListItemType = {
    id: Date.now(),
    industry: '',
    industryPlaceHolder: 'Enter major or degree',
    location: '',
    locationPlaceHolder: 'Enter university',
    description: '',
    descriptionPlaceHolder: 'Enter description',
    start_time: '',
    end_time: '',
    type: 1,
  };
  const [experienceList, setExperienceList] = useState<IListItemType[]>([
    { ...experienceItem },
  ]);
  const [eeducationList, setEeducationList] = useState<IListItemType[]>([
    { ...eeducationItem },
  ]);
  return (
    <div className={`${styles['apply-box']}`}>
      <MyStepper value={steps} activeStep={activeStep} />
      <div className={styles['apply-wrap']}>
        {activeStep !== 2 && (
          <div className={styles['header']}>
            <h5>Become a Seller</h5>
            {activeStep === 1 && (
              <div className={styles['back-box']} onClick={handleBack}>
                <img src={BackSVG} alt="" />
                <span>Back</span>
              </div>
            )}
          </div>
        )}
        <div className={styles['apply-content']}>
          {activeStep === 0 && <Step1 setActiveStep={setActiveStep} />}
          {activeStep === 1 && (
            <Step2
              setActiveStep={setActiveStep}
              experienceItem={experienceItem}
              eeducationItem={eeducationItem}
              experienceList={experienceList}
              eeducationList={eeducationList}
              setExperienceList={setExperienceList}
              setEeducationList={setEeducationList}
            />
          )}
          {activeStep === 2 && <Step3 />}
        </div>
      </div>
    </div>
  );
};

export default SellerApply;
