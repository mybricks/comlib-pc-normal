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

  const renderWrapText = (content: string) => {
    return (
      <div
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: content.replace('\\n', '<br/>') }}
      />
    );
  };

  return (
    <Popover
      placement={placement}
      title={useTitleSlot ? slots['title']?.render() : renderWrapText(title as string)}
      content={useContentSlot ? slots['content']?.render() : renderWrapText(content as string)}
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
