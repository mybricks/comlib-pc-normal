import React from 'react';
import { Popover } from 'antd';
import { Data } from './constants';

export default function ({ env, data, slots }: RuntimeParams<Data>) {
  const { title, content, placement, trigger, useTitleSlot, useContentSlot } = data;
  const { edit } = env;
  return (
    <Popover
      placement={placement}
      title={useTitleSlot ? slots['title']?.render() : title}
      content={useContentSlot ? slots['content']?.render() : content}
      trigger={edit ? 'click' : trigger}
      overlayInnerStyle={{
        maxWidth: window.screen.availWidth,
        maxHeight: window.screen.availHeight
      }}
    >
      <div>{slots['carrier'] && slots['carrier'].render()}</div>
    </Popover>
  );
}
