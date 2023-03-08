import {
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
} from '@mui/material';
import React from 'react';
import styles from './index.less';

export type stepValueType = {
  label: string;
  description?: string;
};

export type IStepperProps = {
  value: stepValueType[];
  activeStep: number;
  className?: string;
};

const MyStepper: React.FC<IStepperProps> = ({
  value,
  activeStep,
  className,
}) => {
  return (
    <div className={`${styles['stepper-wrap']} ${className}`}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        classes={{ root: styles['stepper-root'] }}
      >
        {value?.map((item) => (
          <Step key={item?.label} classes={{ root: styles['step-root'] }}>
            <StepLabel
              classes={{
                root: styles['steplabel-root'],
                label: styles['steplabel-label'],
              }}
            >
              <div>{item?.label}</div>
              {item?.description && (
                <div className={styles['description']}>{item?.description}</div>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default MyStepper;
