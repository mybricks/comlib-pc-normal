import React, { useMemo } from 'react';
import { Popover } from 'antd';
import { Data } from './constants';
import { isString } from '../utils';
import styles from './index.less';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, content, placement, trigger, useTitleSlot, useContentSlot, style } = data;
  inputs['_title']((val) => {
    if (isString(val)) {
      data.title = val;
    } else {
      data.title = JSON.stringify(val);
    }
  });

  inputs['content']((val) => {
    if (isString(val)) {
      data.content = val;
    } else {
      data.content = JSON.stringify(val);
    }
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
