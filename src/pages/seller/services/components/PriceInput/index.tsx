import InputWithSelect, {
  IInputWithSelectProps,
} from '@/components/InputWithSelect';
import { DisabledToken } from '@/define';
import CurrencyOption from '@/pages/seller/services/components/CurrencyOption';
import { ITokensItem } from '@/service/services/types';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'umi';

const PriceInput: React.FC<Omit<IInputWithSelectProps, 'options'>> = ({
  disabled,
  inputSx,
  placeholder,
  error,
  inputValue,
  onInputChange,
  menuValue,
  onMenuChange,
  onBlurFun,
}) => {
  const { tokens } = useSelector((state: any) => state.coins);
  const [options, setOptions] = useState<
    { label: ReactNode; value: string | number; id: number }[]
  >([
    {
      label: <></>,
      value: '',
      id: 0,
    },
  ]);

  useEffect(() => {
    let tempList: { label: ReactNode; value: string | number; id: number }[] =
      [];
    if (tokens) {
      Object?.keys(tokens)
        ?.filter((key) => tokens[key]?.status === 1)
        ?.filter((item) => !DisabledToken.includes(tokens[item]?.name))
        ?.map((item) => {
          const tokenItem: ITokensItem = tokens[item];
          let tempItem = {
            label: (
              <CurrencyOption
                iconPath={tokenItem?.avatar}
                currencyName={tokenItem?.name}
              />
            ),
            value: tokenItem?.symbol,
            id: tokenItem?.id,
          };
          tempList?.push(tempItem);
        });
      setOptions(tempList);
    }
  }, [tokens]);

  return (
    <InputWithSelect
      inputSx={inputSx}
      options={options}
      placeholder={placeholder || 'Enter...'}
      disabled={disabled}
      error={error}
      inputValue={inputValue}
      onInputChange={onInputChange}
      menuValue={menuValue}
      onMenuChange={onMenuChange}
      onBlurFun={onBlurFun}
    />
  );
};

export default PriceInput;
