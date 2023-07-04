import React from 'react';
import { Tooltip } from 'antd';
import { isString } from '../utils';
import { Data } from './types';

export default function ({ env, data, slots, inputs }: RuntimeParams<Data>) {
  const { title, placement, trigger } = data;
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  inputs['content']((val) => {
    if (isString(val)) {
      data.title = val;
    } else {
      data.title = JSON.stringify(val);
    }
  });
  return (
    <Tooltip
      defaultVisible={!!edit}
      placement={placement}
      title={() => (
        <div
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: title.replace('\\n', '<br/>') }}
        />
      )}
      trigger={trigger}
      getPopupContainer={(triggerNode: HTMLElement) =>
        edit || debug ? triggerNode : document.body
      }
    >
      <div>{slots.carrier?.render()}</div>
    </Tooltip>
  );
}
