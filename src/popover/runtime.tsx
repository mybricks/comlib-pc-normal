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
    typeof relOutputs['_titleComplete'] === 'function' && relOutputs['_titleComplete']();
  });

  inputs['content']((val, relOutputs) => {
    if (isString(val)) {
      data.content = val;
    } else {
      data.content = JSON.stringify(val);
    }
    typeof relOutputs['contentComplete'] === 'function' && relOutputs['contentComplete']();
  });

  /** display self */
  useEffect(() => {
    if (edit) return;
    if (style.display === 'none') {
      popoverRef.current.onClick();
    }
  }, [style.display]);

  const visibleProps = useMemo(() => {
    if (env.edit && data.hidePopupPanel) {
      return { visible: false };
    }
    return env.edit && (useTitleSlot || useContentSlot) ? { visible: true } : {};
  }, [useTitleSlot, useContentSlot, env.edit, data.hidePopupPanel]);

  console.log('visibleProps', visibleProps);

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
      visible={env.edit && useTitleSlot ? true : undefined}
      {...visibleProps}
      trigger={trigger}
      overlayClassName={id}
      overlayInnerStyle={{
        maxWidth: window.screen.availWidth,
        maxHeight: window.screen.availHeight
      }}
      getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
      // destroyTooltipOnHide
    >
      {/* overflowY: 'hidden' 是为了在容器fit-content时防止外边距塌陷 */}
      <div className={styles.wrap}>
        {slots.carrier?.render({
          style: {
            cursor: 'pointer',
            overflowY: 'hidden',
            ...data.slotStyle,
            minHeight: env.runtime ? void 0 : 30,
            minWidth: env.runtime ? void 0 : 30
          }
        })}
      </div>
    </Popover>
  );
}
