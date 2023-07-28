import React from 'react';
import css from './runtime.less';

export default function ({ env, data, inputs, outputs }) {
  return (
    <div>
      <div className={css.normal}>普通文本</div>
      <div className={css.second}>二级文本</div>
      <div className={css.disable}>禁用态文本</div>
    </div>
  );
}
