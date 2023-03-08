import InputFormItem from '@/components/ProfileFormItem/InputFormItem';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import Switch from '@/components/Switch';
import {
  Box,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Field, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

import PriceInput from '../PriceInput';
import styles from './index.less';

export const VERSION_LIST = [
  {
    label: '1 Revision',
    value: '1',
  },
  {
    label: '2 Revisions',
    value: '2',
  },
  {
    label: '4 Revisions',
    value: '4',
  },
  {
    label: '10 Revisions',
    value: '10',
  },
  {
    label: 'Unlimited Revisions',
    value: '-1',
  },
];

export interface IServicePackage {
  index: number;
  title: string;
  name: string;
  queueOrder: number; // 进行中的订单数量
  showSwitch?: boolean;
  disabled?: boolean;
  formik: FormikProps<any>;
}

const ServicePackage: React.FC<IServicePackage> = ({
  index,
  title,
  name,
  queueOrder,
  showSwitch,
  disabled,
  formik,
}) => {
  const values = formik.values[name][index];
  const _nameKey = `${name}[${index}]`;
  const errorKey = formik.errors?.[name]?.[index];
  const touchedKey = formik.touched?.[name]?.[index];

  return (
    <div className={styles['service-package']}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 500 }}>
          {title}
        </Typography>
        {showSwitch && (
          <Switch
            disabled={disabled}
            className={styles['switch-box']}
            value={values.status === 1}
            onChange={(value) => {
              formik.setFieldValue(`${_nameKey}.status`, value ? 1 : 2);
            }}
          />
        )}
      </Stack>
      {values?.status === 1 && (
        <>
          <Box mt={10}>
            {queueOrder > 0 ? (
              <Typography variant="body1" color="#E03A3A">
                {queueOrder} {queueOrder > 1 ? 'orders' : 'order'} in queue
                &nbsp;&nbsp; | &nbsp;&nbsp; No modification allowed
              </Typography>
            ) : (
              <Typography variant="body1" color="#3AE090">
                0 order in queue &nbsp;&nbsp;|&nbsp;&nbsp; Modifications will
                take effect on subsequent orders
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={80} sx={{ width: '100%', mt: 35 }}>
            <Stack direction="column" sx={{ width: '100%' }}>
              <Box mb={4} sx={{ fontWeight: 500 }}>
                Delivery time
                {values?.status === 1 && (
                  <span style={{ color: '#E03A3A' }}> * </span>
                )}
              </Box>
              <FormControl
                error={!!touchedKey?.deliverTime && !!errorKey?.deliverTime}
                className={styles['input-form-control']}
              >
                <OutlinedInput
                  classes={{
                    root: styles['input-box'],
                    focused: styles['input-focused'],
                    notchedOutline: styles['notchedOutline'],
                    disabled: styles['disable-input'],
                  }}
                  placeholder="Enter..."
                  disabled={disabled}
                  fullWidth
                  value={values.deliverTime}
                  required={values?.status === 1}
                  onBlur={() => {
                    formik.setFieldTouched(`${_nameKey}.deliverTime`, true);
                    formik.handleBlur;
                  }}
                  onChange={(ev) =>
                    formik.setFieldValue(
                      `${_nameKey}.deliverTime`,
                      ev.target.value?.trim(),
                    )
                  }
                  endAdornment={<span>Day(s)</span>}
                />
                <FormHelperText
                  id={`${name}-helper-text`}
                  className={styles['helper-text']}
                >
                  {touchedKey?.deliverTime && errorKey?.deliverTime}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack direction="column" sx={{ width: '100%' }}>
              <Box mb={4} sx={{ fontWeight: 500 }}>
                Price
                {values?.status === 1 && (
                  <span style={{ color: '#E03A3A' }}> * </span>
                )}
              </Box>
              <FormControl
                error={!!touchedKey?.budgetAmount && !!errorKey?.budgetAmount}
                className={styles['input-form-control']}
              >
                <PriceInput
                  menuValue={values.coinId}
                  inputValue={values.budgetAmount}
                  onInputChange={(value) => {
                    formik.setFieldValue(
                      `${_nameKey}.budgetAmount`,
                      value?.trim(),
                    );
                  }}
                  onMenuChange={(value) => {
                    formik?.setFieldTouched(`${_nameKey}.budgetAmount`, true);
                    formik.setFieldValue(`${_nameKey}.coinId`, value);
                  }}
                  placeholder="Price must be greater than $10"
                  disabled={disabled}
                  onBlurFun={(e) => {
                    formik?.setFieldTouched(`${_nameKey}.budgetAmount`, true);
                    formik?.handleBlur(e);
                  }}
                />
                <FormHelperText
                  id={`${name}-helper-text`}
                  className={styles['helper-text']}
                >
                  {touchedKey?.budgetAmount && errorKey?.budgetAmount}
                </FormHelperText>
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction="row" sx={{ mt: 58 }} spacing={43}>
            <InputFormItem
              label="Final documents"
              required={values?.status === 1}
              formik={formik}
              name={`${_nameKey}.finalDocs`}
              width={628}
              placeholder="What documents you will deliver..."
              disabled={disabled}
              formValue={values.finalDocs}
              maxLength={50}
              errorKey={errorKey?.finalDocs}
              touchKey={touchedKey?.finalDocs}
              onBlurFun={(e) => {
                formik.setFieldTouched(`${_nameKey}.finalDocs`, true);
                formik.setFieldValue(
                  `${_nameKey}.finalDocs`,
                  e.target.value?.trim(),
                );
              }}
            />
            <div>
              <div style={{ height: 18.75, width: 243 }}></div>
              <SelectFormItem
                label=""
                formik={formik}
                name={`${_nameKey}.revisions`}
                placeholder="Select revisions..."
                onChange={(ev) => {
                  formik.setFieldValue(
                    `${_nameKey}.revisions`,
                    Number(ev.target.value),
                  );
                }}
                width={243}
                options={VERSION_LIST}
                disabled={disabled}
                formValue={values.revisions?.toString()}
              />
            </div>
          </Stack>
        </>
      )}
    </div>
  );
};

export default ServicePackage;
