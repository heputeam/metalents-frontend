import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

function DropDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} width="26" height="26" viewBox="0 0 26 26">
      <path
        d="M6.22722 9.22722C5.92426 9.53018 5.92426 10.0214 6.22722 10.3243L12.183 16.2801C12.3387 16.4358 12.5441 16.5115 12.7481 16.5072C12.9531 16.5124 13.1598 16.4367 13.3163 16.2802L19.2721 10.3244C19.5751 10.0215 19.5751 9.53026 19.2721 9.2273C18.9692 8.92433 18.478 8.92434 18.175 9.2273L12.7497 14.6526L7.32434 9.22722C7.02138 8.92426 6.53018 8.92426 6.22722 9.22722Z"
        fill="#111111"
      />
    </SvgIcon>
  );
}

export default DropDownIcon;
