import React, { CSSProperties } from 'react';
import css from './runtime.less';

/**
 * 数据源
 * @param content 富文本编辑器提供的内容
 */
export interface Data {
  content?: string;
  style: CSSProperties;
}

export default function ({ env, data, outputs }: RuntimeParams<Data>) {
  return (
    <div
      className={css.html}
      dangerouslySetInnerHTML={{ __html: data.content || '' }}
    ></div>
  );
}
