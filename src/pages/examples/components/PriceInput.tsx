import React, { useEffect, useState } from 'react';
import PriceInput from '@/pages/seller/services/components/PriceInput';

const InputWithSelectExample: React.FC = () => {
  const [inputValue, setInputValue] = useState('1698981987465');
  const [menuValue, setMenuValue] = useState<string | number>('eth');

  useEffect(() => {
    console.log(`inputValue: ${inputValue}, menuValue: ${menuValue}`);
  }, [inputValue, menuValue]);

  return (
    <PriceInput
      placeholder={'Enter...'}
      // disabled={true}
      // error={true}
      inputSx={{ marginLeft: 20 }}
      inputValue={inputValue}
      onInputChange={setInputValue}
      menuValue={menuValue}
      onMenuChange={setMenuValue}
    />
  );
};

export default InputWithSelectExample;
