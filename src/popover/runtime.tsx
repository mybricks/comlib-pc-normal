import React from 'react';
import { Popover } from 'antd';
import { Data } from './constants';

const DefaultContent = '这是一个气泡，请添加一个组件';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, content, placement, trigger, useTitleSlot, useContentSlot } = data;
  const { edit } = env;

  inputs['_title']((val) => {
    data.title = val;
  });

  inputs['content']((val) => {
    data.content = val;
  });

  return (
    <Popover
      placement={placement}
      title={useTitleSlot ? slots['title']?.render() : title}
      content={useContentSlot ? slots['content']?.render() : content || DefaultContent}
      trigger={edit ? 'click' : trigger}
      getPopupContainer={(triggerNode) => triggerNode}
      overlayInnerStyle={{
        maxWidth: window.screen.availWidth,
        maxHeight: window.screen.availHeight
      }}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Popover>
  );
}
