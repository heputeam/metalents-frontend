import React, { useEffect, useState } from 'react';

import Switch from '@/components/Switch';

const SwitchExample: React.FC = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    console.log(`Switch example: `, checked);
  }, [checked]);

  return <Switch checked={checked} onChange={setChecked} />;
};

export default SwitchExample;
