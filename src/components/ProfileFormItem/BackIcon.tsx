import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

function BackIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="11"
      height="18"
      viewBox="0 0 11 18"
      htmlColor="#ffffff"
      {...props}
    >
      <path d="M9.89474 1L2 9L9.89474 17" stroke="#111111" strokeWidth="2" />
    </SvgIcon>
  );
}

export default BackIcon;
