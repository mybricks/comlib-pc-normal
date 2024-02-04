import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './style.less';

const { Panel } = Collapse;
const defaultKey = '1';
export default function ({ env, data, inputs, slots, outputs }: RuntimeParams<Data>) {
  const [activeKey, setActiveKey] = useState(data.expanded || env.edit ? [defaultKey] : []);

  useEffect(() => {
    if (env.runtime) {
      if (data.useDynamicTitle && inputs[InputIds.Title]) {
        inputs[InputIds.Title]((val, relOutputs) => {
          if (typeof val === 'string') {
            data.title = val;
            relOutputs['setTitleDone'](val);
          }
        });
      }
      if (data.useDynamicExpand && inputs[InputIds.Expanded] && inputs[InputIds.Folded]) {
        inputs[InputIds.Expanded]((_, relOutputs) => {
          setActiveKey([defaultKey]);
          relOutputs['seExpandedDone']();
        });
        inputs[InputIds.Folded]((_, relOutputs) => {
          setActiveKey([]);
          relOutputs['setFoldedDone']();
        });
      }
    }
  }, []);

  return (
    <Collapse
      className={css.collapseWrap}
      activeKey={activeKey}
      collapsible={data.useExtra ? 'header' : void 0}
      onChange={(val: string | string[]) => {
        setActiveKey(typeof val === 'string' ? [val] : val);
        if (data.useDynamicExpand && outputs[OutputIds.ExpandedChange]) {
          outputs[OutputIds.ExpandedChange](val.includes(defaultKey));
        }
      }}
    >
      <Panel
        header={data.isCustomTitle ? slots[SlotIds.Title].render() : env.i18n(data.title)}
        key={defaultKey}
        forceRender
        extra={data.useExtra && slots[SlotIds.Extra] ? slots[SlotIds.Extra].render() : null}
      >
        {slots[SlotIds.Content].render()}
      </Panel>
    </Collapse>
  );
}
