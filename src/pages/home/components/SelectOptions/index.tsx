import styles from './index.less';
import SelectItem from './SetectItem';
import CheckBox from '@/components/CheckBox';
import { Form, Formik } from 'formik';
import Button from '@/components/Button';
import OptionItem from '../OptionItem';
import { Box } from '@mui/material';
import { useFilterCookie } from './hook/useFilterCookie';
import {
  ESortBy,
  FilterStarConfig,
  ICheckBoxConfig,
  SoryByConfig,
} from './config';
import { useEffect, useState } from 'react';

import codeSvg from './assets/code.svg';
import peopleSvg from './assets/people.svg';
import timeSvg from './assets/time.svg';
import priceSvg from './assets/price.svg';

import SingleSlider from '@/components/Slider/SingleSlider';
import DoubleSlider from '@/components/Slider/DoubleSlider';
import { uid } from 'react-uid';
import { IMenuState, useLocation, useSelector } from 'umi';
import { getOptionSelect } from '@/utils/menuOptions';
import { ITokensItem } from '@/service/services/types';
import { toThousands } from '@/utils';

export interface ISearchFilterValue {
  optionIds: number[];
  coinId: number[];
  services_3star: boolean;
  budget_min: number;
  budget_max: number;
  deliver_dayValue: number;
  sortBy: string;
}

export interface ISelectOptionProps {
  value: ISearchFilterValue;
  onChange: (value: ISearchFilterValue) => void;
}

const getCheckBoxInitialValues = (mapArr: ICheckBoxConfig[]) => {
  const obj: { [key in string]: boolean } = {};

  mapArr.forEach((item) => {
    obj[item.name] = item.checked;
  });

  return obj;
};

export const budgetMax = 9000000;
export const budgetMin = 10;

const SelectOptions: React.FC<ISelectOptionProps> = ({ value, onChange }) => {
  const { setFilterCookie, getFilterCookie, resetFilterCookie } =
    useFilterCookie();
  const [clickAmount, setClickAmount] = useState<number>(0);

  const [optionsConfig, setOptionsConfig] = useState<ICheckBoxConfig[]>([]);
  const { tokens } = useSelector((state: any) => state.coins);

  useEffect(() => {
    let tempList: ICheckBoxConfig[] = [];
    if (tokens) {
      Object.keys(tokens)
        ?.filter((key) => tokens[key]?.status === 1)
        ?.map((item, index) => {
          const tokenItem: ITokensItem = tokens[item];

          let tempItem = {
            name: tokenItem?.name,
            value: tokenItem?.name,
            id: tokenItem?.id,
            checked: false,
          };
          tempList?.push(tempItem);
        });
    }
    setOptionsConfig(tempList);
  }, [tokens, query]);

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

  const { query }: any = useLocation();

  const tempOptionsObj: Record<
    string,
    { optionId: number; optionName: string; valueName: string }[]
  > = getOptionSelect(
    menuData,
    query.tab || menuData?.[0]?.serviceName,
    query.type,
  );

  const dynamicOptions = Object.values(tempOptionsObj)
    .flat()
    .map((option) => ({
      name: String(option.optionId),
      value: option.valueName,
      checked: false,
    }));

  const tokenCoinId = optionsConfig.map((item) => ({
    name: String(`token_${item?.id}`),
    value: item?.value,
    checked: false,
  }));

  const optionInitialValues = {
    ...getCheckBoxInitialValues([
      ...optionsConfig,
      ...dynamicOptions,
      ...tokenCoinId,
    ]),
    ...getFilterCookie('Options'),
  };

  const [optionShowStr, setOptionShowStr] = useState('Options');

  const filterStarInitialValues = {
    ...getCheckBoxInitialValues(FilterStarConfig),
    ...getFilterCookie('FilterStar'),
  };

  const [filterStarShowStr, setFilterStarShowStr] = useState('Seller Details');

  const budgetInitialValues = {
    budget_min: 10,
    budget_max: budgetMax,
    ...getFilterCookie('Budget'),
  };

  const [budgetStarShowStr, setBudgetShowStr] = useState('Budget');

  const deliverInitialValues = {
    deliver_dayValue: 30,
    ...getFilterCookie('Deliver'),
  };
  const [deliverStarShowStr, setDeliverShowStr] = useState('Deliver Time');

  const [sortBy, setSortBy] = useState(
    (getFilterCookie('SortBy') as any)?.sortBy || ESortBy.sellerRecommendFirst,
  );

  useEffect(() => {
    resetFilterCookie();
    setSortBy(ESortBy.sellerRecommendFirst);
    setOptionShowStr('Options');
    setFilterStarShowStr('Seller Details');
    setBudgetShowStr('Budget');
    setDeliverShowStr('Deliver Time');
    onChange({
      budget_max: budgetMax,
      budget_min: budgetMin,
      deliver_dayValue: 30,
      coinId: [],
      optionIds: [],
      services_3star: false,
      sortBy: ESortBy.sellerRecommendFirst,
    });
  }, [query]);

  const updateOptionShowStr = (
    values: { [key in string]: boolean },
    dynamicOptions: ICheckBoxConfig[],
  ) => {
    const strArr = [];
    dynamicOptions.forEach((item) => {
      if (values[`token_${item?.id}`]) {
        strArr.push(item.value);
      }
      if (values[item.name]) {
        strArr.push(item.value);
      }
    });
    if (!strArr.length || strArr.length === optionsConfig.length)
      strArr.push('Options');

    setOptionShowStr(strArr.join(','));
  };

  const updateFilterStarShowStr = (values: { [key in string]: boolean }) => {
    const strArr = [];

    FilterStarConfig.forEach((item) => {
      if (values[item.name]) {
        strArr.push(item.value);
      }
    });
    if (!strArr.length) strArr.push('Seller Details');

    setFilterStarShowStr(strArr.join(','));
  };

  const updateDeliverShowStr = (values: { [key in string]: number }) => {
    if (values.deliver_dayValue === 30) {
      return setDeliverShowStr(`Deliver Time`);
    }
    setDeliverShowStr(
      `Up to ${values.deliver_dayValue} ${
        values.deliver_dayValue > 1 ? 'days' : 'day'
      }`,
    );
  };

  const updateBudgetShowStr = (values: { [key in string]: number }) => {
    if (values.budget_min === budgetMin && values.budget_max === budgetMax) {
      return setBudgetShowStr(`Budget`);
    }
    setBudgetShowStr(
      `From $${toThousands(values.budget_min)} to $${toThousands(
        values.budget_max,
      )}`,
    );
  };

  return (
    <div className={styles['selectOption-container']}>
      <div className={styles['select-left']}>
        {/* Payment */}
        <SelectItem
          title="Options"
          showItemStr={optionShowStr}
          prefix={<img src={codeSvg} alt="" />}
          clickAmount={clickAmount}
        >
          <Formik
            initialValues={optionInitialValues}
            onSubmit={(optionValue) => {
              setFilterCookie('Options', optionValue);
              updateOptionShowStr(optionValue, [
                ...optionsConfig,
                ...dynamicOptions,
              ]);

              const coinId = Object.keys(optionValue)
                .filter((key) => key.includes('token') && optionValue[key])
                .map((rawKey) => Number(rawKey.slice(6)));

              const patten = /^\d+$|^\d+[.]?\d+$/;
              const optionIds = Object.keys(optionValue)
                .filter(
                  (key) =>
                    !key.includes('token') &&
                    patten.test(key) &&
                    optionValue[key],
                )
                .map((strKey) => Number(strKey));

              setClickAmount(clickAmount + 1);
              onChange({ ...value, optionIds, coinId });
            }}
          >
            {(props) => {
              console.log('props: ', props);

              return (
                <Form>
                  <OptionItem label="Payment" className={styles['coin']}>
                    {optionsConfig?.map((item, index) => {
                      return (
                        <CheckBox
                          key={item?.value}
                          name={`token_${item?.id}`}
                          mr={18}
                        >
                          {item?.name}
                        </CheckBox>
                      );
                    })}
                  </OptionItem>

                  {Object.values(tempOptionsObj).map((optionGroup, index) => (
                    <OptionItem label={optionGroup[0].optionName} key={index}>
                      {optionGroup.map((option) => (
                        <CheckBox
                          name={String(option.optionId)}
                          mr={18}
                          key={option.optionId}
                        >
                          {option.valueName}
                        </CheckBox>
                      ))}
                    </OptionItem>
                  ))}

                  <Box className={styles['buttonGroup']}>
                    <span
                      onClick={() => {
                        for (const key in optionInitialValues) {
                          props.setFieldValue(key, false);
                        }
                      }}
                    >
                      Clear all
                    </span>
                    <Button
                      variant="contained"
                      rounded
                      type="submit"
                      sx={{
                        width: 100,
                        height: 28,
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </SelectItem>

        {/* Seller Details */}
        <SelectItem
          title="Seller Details"
          showItemStr={filterStarShowStr}
          prefix={<img src={peopleSvg} alt="" />}
          clickAmount={clickAmount}
        >
          <Formik
            initialValues={filterStarInitialValues}
            onSubmit={(filterStarValue) => {
              setFilterCookie('FilterStar', filterStarValue);
              updateFilterStarShowStr(filterStarValue);
              setClickAmount(clickAmount + 1);
              onChange({ ...value, ...filterStarValue });
            }}
          >
            {(props) => (
              <Form>
                <OptionItem label="Seller services">
                  <CheckBox name="services_3star">{`Only services > 3 stars`}</CheckBox>
                </OptionItem>

                <Box className={styles['buttonGroup']}>
                  <span
                    onClick={() => {
                      for (const key in filterStarInitialValues) {
                        if (
                          Object.prototype.hasOwnProperty.call(
                            filterStarInitialValues,
                            key,
                          )
                        ) {
                          props.setFieldValue(key, false);
                        }
                      }
                    }}
                  >
                    Clear all
                  </span>
                  <Button
                    variant="contained"
                    rounded
                    type="submit"
                    sx={{
                      width: 100,
                      height: 28,
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </SelectItem>

        {/* Budget */}
        <SelectItem
          title="Budget"
          showItemStr={budgetStarShowStr}
          prefix={<img src={priceSvg} alt="" />}
          clickAmount={clickAmount}
        >
          <Formik
            initialValues={budgetInitialValues}
            onSubmit={(budgetValue) => {
              setFilterCookie('Budget', budgetValue);
              updateBudgetShowStr(budgetValue);
              setClickAmount(clickAmount + 1);
              onChange({ ...value, ...budgetValue });
            }}
          >
            {(props) => (
              <Form>
                <div className={styles['slider-container']}>
                  <p className={styles['top-p']}>
                    From <span>${toThousands(props.values.budget_min)}</span> to{' '}
                    <span>${toThousands(props.values.budget_max)}</span>
                  </p>
                  <div>
                    <DoubleSlider
                      min={budgetMin}
                      max={budgetMax}
                      name={['budget_min', 'budget_max']}
                      value={[props.values.budget_min, props.values.budget_max]}
                      setValue={props.setFieldValue}
                      scale={(value) => {
                        if (value < 100) {
                          return value;
                        } else if (value < 1000) {
                          return value - (value % 10);
                        } else {
                          return value - (value % 100);
                        }
                      }}
                    />
                  </div>
                  <p>$10~${toThousands(budgetMax)}</p>
                </div>

                <Box className={styles['buttonGroup']}>
                  <span
                    onClick={() => {
                      // props.resetForm();
                      props.setFieldValue('budget_min', budgetMin);
                      props.setFieldValue('budget_max', budgetMax);
                    }}
                  >
                    Clear all
                  </span>
                  <Button
                    variant="contained"
                    rounded
                    type="submit"
                    sx={{
                      width: 100,
                      height: 28,
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </SelectItem>

        {/* Deliver Time */}
        <SelectItem
          title="Deliver Time"
          showItemStr={deliverStarShowStr}
          prefix={<img src={timeSvg} alt="" />}
          clickAmount={clickAmount}
        >
          <Formik
            initialValues={deliverInitialValues}
            onSubmit={(deliverValue) => {
              setFilterCookie('Deliver', deliverValue);
              updateDeliverShowStr(deliverValue);
              setClickAmount(clickAmount + 1);
              onChange({ ...value, ...deliverValue });
            }}
          >
            {(props) => (
              <Form>
                <div className={styles['slider-container']}>
                  <p className={styles['top-p']}>
                    <span>{`Up to ${props.values.deliver_dayValue} ${
                      props.values.deliver_dayValue > 1 ? 'days' : 'day'
                    }`}</span>
                  </p>
                  <div>
                    <SingleSlider
                      min={1}
                      max={30}
                      name="deliver_dayValue"
                      value={props.values.deliver_dayValue}
                      setValue={props.setFieldValue}
                    />
                  </div>
                  <p>1~30 days</p>
                </div>

                <Box className={styles['buttonGroup']}>
                  <span
                    onClick={() => {
                      props.setFieldValue('deliver_dayValue', 30);
                      // props.resetForm();
                    }}
                  >
                    Clear all
                  </span>
                  <Button
                    variant="contained"
                    rounded
                    type="submit"
                    sx={{
                      width: 100,
                      height: 28,
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </SelectItem>
      </div>

      <div className={styles['select-right']}>
        {/* Sort By */}
        <SelectItem
          title="Sort By"
          type="Select"
          clickAmount={clickAmount}
          showItemStr={(() => {
            let showContext = SoryByConfig[0].context;
            SoryByConfig.forEach((item) => {
              if (sortBy === item.value) {
                showContext = item.context;
              }
            });
            return showContext;
          })()}
          prefix={'Sort By'}
        >
          <ul className={styles['select-container']}>
            {SoryByConfig.map((item) => {
              return (
                <li
                  className={item.value === sortBy ? styles['active'] : ''}
                  key={uid(item)}
                  onClick={() => {
                    setSortBy(item.value);
                    setFilterCookie('SortBy', {
                      sortBy: item.value,
                    });
                    setClickAmount(clickAmount + 1);
                    onChange({ ...value, sortBy: item.value });
                  }}
                >
                  {item.context}
                </li>
              );
            })}
          </ul>
        </SelectItem>
      </div>
    </div>
  );
};

export default SelectOptions;
