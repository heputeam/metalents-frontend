import React from 'react';
import { Link } from 'umi';

export interface INavLinkProps {
  path: string;
  children: any;
  className?: string;
  disabled?: boolean;
}

const NavLink: React.FC<INavLinkProps> = ({
  path,
  children,
  className,
  disabled,
}) => {
  // 可以对应扩展，外联外部打开
  const hasProtocol = /^http.*/.test(path);
  let _path = disabled ? '' : path;

  if (hasProtocol) {
    return (
      <a href={_path} className={className} target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link to={_path} className={className}>
      {children}
    </Link>
  );
};

export default NavLink;
