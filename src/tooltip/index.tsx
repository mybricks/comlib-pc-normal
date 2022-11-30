import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { Data } from './types';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, placement, trigger, style } = data;
  inputs['content']((val) => {
    let res = val;
    if (res && typeof res !== 'string') {
      res = JSON.stringify(val);
    }
    data.title = res;
  });
  return (
    <Tooltip
      placement={placement}
      title={() => (
        <div
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: title.replace('\\n', '<br/>') }}
        />
      )}
      trigger={trigger}
      color={style?.background as string}
      overlayInnerStyle={style}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Tooltip>
  );
}
