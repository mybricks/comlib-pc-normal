import React, { useEffect, useRef, ReactNode, useState } from 'react';
import * as Icons from '@ant-design/icons';
import { route } from '../utils/history';
import { Data, InputIds } from './constants';
import css from './runtime.less';

export default function ({ data, inputs, outputs, env }: RuntimeParams<Data>) {
  const { style, useHoverStyle, hoverStyle, routeType } = data;
  const ref = useRef(null);

  useEffect(() => {
    inputs[InputIds.SetContent]((value: string, relOutputs) => {
      if (value != undefined && typeof value !== 'string') value = JSON.stringify(value);
      data.content = value;
      relOutputs['setContentDone'](value);
    });
    inputs[InputIds.SetUrl]((value: string, relOutputs) => {
      if (value != undefined && typeof value !== 'string') value = JSON.stringify(value);
      data.url = value;
      relOutputs['setUrlDone'](value);
    });
  }, []);

  const onClick = () => {
    if (routeType === 'customEvent') {
      outputs['click'] && outputs['click'](data.url);
      return;
    }
    if (data.url === '') {
      console.warn('目标地址为空!');
    } else if (typeof data.url === 'string') {
      route[routeType](data.url.trim(), env);
    } else {
      console.warn('目标地址不合法:', data.url);
    }
  };

  //选择图标样式
  const chooseIcon = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  return (
    <div
      ref={ref}
      className={`${css.linkWrapper} linkWrapper`}
      onClick={env.runtime ? onClick : void 0}
    >
      <span className={css.iconLocation1}>
        {data.isChoose && data.location === 'front' ? chooseIcon({ icon: data.icon }) : void 0}
      </span>
      <span className={css.iconLocation2}>{env.i18n(data.content || data.url || '')}</span>
      <span className={css.iconLocation3}>
        {data.isChoose && data.location === 'back' ? chooseIcon({ icon: data.icon }) : void 0}
      </span>
    </div>
  );
}
