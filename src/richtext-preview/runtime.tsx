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

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  inputs.content &&
    inputs.content((val: string, outputRels: { contentDone: (val: string) => void }) => {
      data.content = val;
      if (outputRels['contentDone']) {
        outputRels['contentDone'](val);
      }
    });
  return <div className={css.html} dangerouslySetInnerHTML={{ __html: data.content || '' }}></div>;
}
