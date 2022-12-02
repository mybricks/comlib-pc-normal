import React from 'react';
import { Tooltip } from 'antd';
import { isString } from '../utils';
import { Data } from './types';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, placement, trigger, style } = data;
  inputs['content']((val) => {
    if (isString(val)) {
      data.title = val;
    } else {
      data.title = JSON.stringify(val);
    }
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
