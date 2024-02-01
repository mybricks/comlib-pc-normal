import React from 'react';
import { Tooltip } from 'antd';
import { isString } from '../utils';
import { Data } from './types';

export default function ({ env, data, slots, inputs, id }: RuntimeParams<Data>) {
  const { title, placement, trigger } = data;
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  inputs['content']((val, relOutputs) => {
    if (isString(val)) {
      data.title = val;
    } else {
      data.title = JSON.stringify(val);
    }
    relOutputs['contentComplete']()
  });
  return (
    <Tooltip
      placement={placement}
      overlayClassName={id}
      title={() => (
        <div
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: env.i18n(title).replace('\\n', '<br/>') }}
        />
      )}
      trigger={trigger}
      getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
      destroyTooltipOnHide
    >
      <div>{slots.carrier?.render()}</div>
    </Tooltip>
  );
}
