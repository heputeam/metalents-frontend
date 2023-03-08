import styled from '@emotion/styled';
import {
  ButtonProps,
  Button as MuiButton,
  CircularProgress,
} from '@mui/material';
/**
 * 使用方式和Mui/Button 一样，只是多了下面2个参数
 * 特殊按钮，可以sx/className来修改
 */
interface IButtonProps extends ButtonProps {
  rounded?: boolean;
  loading?: boolean;
}
const sizeStyles = {
  large: {
    fontSize: 18,
    height: 48,
    borderRadius: 10,
    '&[data-rounded="true"]': {
      borderRadius: 24,
    },
  },
  medium: {
    fontSize: 14,
    height: 30,
    borderRadius: 6,
    '&[data-rounded="true"]': {
      borderRadius: 15,
    },
  },
  small: {
    fontSize: 12,
    height: 20,
    '&[data-rounded="true"]': {
      borderRadius: 10,
    },
  },
};
const variantStyles = {
  text: {},
  outlined: {
    '&: hover': {
      color: 'var(--ps-text)',
      border: '0 none',
      transform: 'translateY(-3px)',
      background: 'linear-gradient(90deg, #E0C3FC 0%, #8EC5FC 100%) #E0C3FC;',
    },
    '&: disabled': {
      background: 'var(--ps-disable)',
      color: 'var(--ps-text)',
    },
  },
  contained: {
    backgroundColor: 'var(--ps-primary)',
    color: 'var(--ps-text)',
    '&: hover': {
      color: 'var(--ps-text)',
      transform: 'translateY(-3px)',
      background: 'linear-gradient(90deg, #E0C3FC 0%, #8EC5FC 100%) #E0C3FC;',
    },
    '&: disabled': {
      background: 'var(--ps-disable)',
      color: 'var(--ps-text)',
    },
  },
};
const rootStyles = {
  transition:
    'all .25s cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform .3s cubic-bezier(0.4, 0, 0.2, 1) 0ms',
};
const ButtonCore = styled(MuiButton)(({ size, variant }) => {
  variantStyles;
  const styles = {
    ...rootStyles,
    ...sizeStyles[size || 'medium'],
    ...variantStyles[variant || 'text'],
  };
  return {
    ...styles,
  };
});
const Button: React.FC<IButtonProps> = ({
  children,
  className,
  rounded,
  loading,
  ...rest
}) => {
  if (loading) {
    rest.startIcon = <CircularProgress color="inherit" size={16} />;
    rest.disabled = true;
  }

  return (
    <ButtonCore
      disableElevation
      data-rounded={rounded}
      className={className}
      {...rest}
    >
      {children}
    </ButtonCore>
  );
};

export default Button;
