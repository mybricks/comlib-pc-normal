import React, { useMemo } from 'react';
import { Popover } from 'antd';
import { Data } from './constants';
import styles from './index.less';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, content, placement, trigger, useTitleSlot, useContentSlot, style } = data;
  inputs['_title']((val) => {
    data.title = val;
  });

  inputs['content']((val) => {
    data.content = val;
  });

  const visible = useMemo(() => {
    return env.edit && (useTitleSlot || useContentSlot) ? true : undefined;
  }, [useTitleSlot, useContentSlot]);

  return (
    <Popover
      placement={placement}
      title={useTitleSlot ? slots['title']?.render() : title}
      content={useContentSlot ? slots['content']?.render() : content}
      visible={visible}
      trigger={trigger}
      color={style?.background as string}
      getPopupContainer={env.edit ? (triggerNode) => triggerNode : undefined}
      overlayInnerStyle={{
        maxWidth: window.screen.availWidth,
        maxHeight: window.screen.availHeight,
        ...style
      }}
    >
      <div className={styles.wrap}>{slots['carrier'] && slots['carrier'].render()}</div>
    </Popover>
  );
}
