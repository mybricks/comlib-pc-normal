import React from 'react';
import { Tooltip } from 'antd';
import { Data } from './types';

const DefaultContent = '这是一段文字提示，请添加一个组件';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, placement, trigger } = data;
  const { edit } = env;
  inputs['content']((val) => {
    data.title = val;
  });
  return (
    <Tooltip
      placement={placement}
      title={title || DefaultContent}
      trigger={edit ? 'click' : trigger}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Tooltip>
  );
}
