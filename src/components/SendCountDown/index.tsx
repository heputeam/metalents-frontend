// import styles from './index.less';
import React, { useState } from 'react';
import { useCountDown, useRequest } from 'ahooks';
import { Toast } from '../Toast';
import { Errors } from '@/service/errors';
import { postVerifyCode } from '@/service/public';
import Button from '../Button';
export type ISendCountDownProps = {
  email: string;
  disable?: boolean;
};

const SendCountDown: React.FC<ISendCountDownProps> = ({ email, disable }) => {
  const [targetDate, setTargetDate] = useState<number>(0);
  const [countdown] = useCountDown({
    targetDate,
  });
  const { run } = useRequest((email) => postVerifyCode(email), {
    manual: true,
    onSuccess: (data: any) => {
      const { code } = data;
      if (code !== 200) {
        Toast.error(Errors[code]);
      }
    },
  });
  const handleSend = () => {
    if (email) {
      setTargetDate(Date.now() + 60000);
      run(email);
    } else {
      Toast.error('Invalid email address');
    }
  };

  if (countdown !== 0) {
    return (
      <section>
        <Button variant="contained" size="large" disabled>
          （{Math.round(countdown / 1000)}s）
        </Button>
      </section>
    );
  }
  return (
    <section>
      <Button
        disabled={disable}
        sx={{ height: 48 }}
        size="large"
        variant="contained"
        onClick={handleSend}
      >
        Send
      </Button>
    </section>
  );
};

export default SendCountDown;
