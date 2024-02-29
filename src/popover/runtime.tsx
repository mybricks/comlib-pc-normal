import React, { useEffect, useMemo, useRef } from 'react';
import { Popover } from 'antd';
import { Data } from './constants';
import { isString } from '../utils';
import styles from './index.less';

export default function ({ env, data, slots, inputs, id, style }: RuntimeParams<Data>) {
  const { title, content, placement, trigger, useTitleSlot, useContentSlot } = data;
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const popoverRef = useRef(null);
  inputs['_title']((val, relOutputs) => {
    if (isString(val)) {
      data.title = val;
    } else {
      data.title = JSON.stringify(val);
    }
    typeof relOutputs['_titleComplete'] === 'function' && relOutputs['_titleComplete']()
  });

  inputs['content']((val, relOutputs) => {
    if (isString(val)) {
      data.content = val;
    } else {
      data.content = JSON.stringify(val);
    }
    typeof relOutputs['contentComplete'] === 'function' && relOutputs['contentComplete']()
  });

  /** display self */
  useEffect(() => {
    if (edit) return;
    if (style.display === 'none') {
      popoverRef.current.onClick();
    }
  }, [style.display]);

  const visible = useMemo(() => {
    return env.edit && (useTitleSlot || useContentSlot) ? true : undefined;
  }, [useTitleSlot, useContentSlot]);

  const renderWrapText = (content: string) => {
    return content !== '' ? (
      <div
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: env.i18n(content).replace('\\n', '<br/>') }}
      />
    ) : null;
  };

  return (
    <Popover
      ref={popoverRef}
      defaultVisible={!!edit && (useTitleSlot || useContentSlot)}
      placement={placement}
      title={useTitleSlot ? slots['title']?.render() : renderWrapText(title as string)}
      content={useContentSlot ? slots['content']?.render() : renderWrapText(content as string)}
      // visible={visible}
      trigger={trigger}
      overlayClassName={id}
      overlayInnerStyle={{
        maxWidth: window.screen.availWidth,
        maxHeight: window.screen.availHeight
      }}
      getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
      // destroyTooltipOnHide
    >
      <div className={styles.wrap}>{slots.carrier?.render({ style: { cursor: 'pointer' } })}</div>
    </Popover>
  );
}
