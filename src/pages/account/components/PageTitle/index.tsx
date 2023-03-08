import React from 'react';

export type IPageTitleProps = {
  title: string;
  backPath?: string; // 默认直接history.back();
};

/**
 * 默认Title组件
 */
const DefaultTitle: React.FC<IPageTitleProps> = ({ title }) => {
  return (
    <div>
      <h1>title</h1>
    </div>
  );
};

/**
 * 带Back返回的头部，title小一号
 */
const BackTitle: React.FC<IPageTitleProps> = ({ title }) => {
  return (
    <div>
      <h2>title2</h2>
    </div>
  );
};

export { DefaultTitle, BackTitle };

export default DefaultTitle;
