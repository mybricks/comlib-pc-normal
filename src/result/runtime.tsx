/** @format */

import { Result } from 'antd';
import React from 'react';

export type Status = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

export interface Data {
  title: string;
  subTitle: string;
  status: Status;
  dataSource: 1 | 2;
}

export default function R({ env, data, inputs, slots, outputs }: RuntimeParams<Data>) {
  const statusArr = ['success', 'error', 'info', 'warning'];
  if (env.runtime && inputs) {
    inputs['title'] &&
      inputs['title']((ds, relOutputs) => {
        if (typeof ds === 'string') {
          data.title = ds;
          relOutputs['setTitleDone'](ds);
        } else {
          console.error('仅支持字符串类型');
        }
      });
    inputs['subTitle'] &&
      inputs['subTitle']((ds, relOutputs) => {
        if (typeof ds === 'string') {
          data.subTitle = ds;
          relOutputs['setSubTitleDone'](ds);
        } else {
          console.error('仅支持字符串类型');
        }
      });
    inputs['status'] &&
      inputs['status']((ds, relOutputs) => {
        if (statusArr.includes(ds)) {
          data.status = ds;
          relOutputs['setStatusDone'](ds);
        } else {
          console.error('仅支持传入success , error , info, warning');
        }
      });
  }

  return (
    <Result
      title={env.i18n(data.title)}
      subTitle={env.i18n(data.subTitle)}
      status={data.status}
      extra={slots['extra'] && slots['extra'].render()}
    />
  );
}
