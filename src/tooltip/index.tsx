import React from 'react';
import { Tooltip } from 'antd';
import { Data } from './types';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, placement, trigger, style } = data;
  inputs['content']((val) => {
    data.title = val;
  });
  return (
    <Tooltip
      placement={placement}
      title={title}
      trigger={trigger}
      color={style?.background as string}
      overlayInnerStyle={style}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Tooltip>
  );
}
