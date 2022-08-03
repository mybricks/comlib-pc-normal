import React from 'react';
import { Tooltip } from 'antd';
import { Data } from './types';

export default function ({ env, data, slots }: RuntimeParams<Data>) {
  const { title, placement, trigger } = data;
  const { edit } = env;
  return (
    <Tooltip
      placement={placement}
      title={title}
      trigger={edit ? 'click' : trigger}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Tooltip>
  );
}
