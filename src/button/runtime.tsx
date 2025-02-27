import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Data, OutputIds, LocationEnum, InputIds } from './constants';
import css from './runtime.less';
import * as Icons from '@ant-design/icons';
import { Space, Image, Button } from 'antd';
import { renderBtnContext } from './btnRender';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  const [disabled, setDisable] = useState(false);
  const [dynamicStyle, setDynamicStyle] = useState<React.CSSProperties>({});

  //如果data.dataType是'external'的
  useEffect(() => {
    if (env.runtime) {
      inputs?.['external'] &&
        inputs['external']((ds: any, relOutputs) => {
          data.inVal = ds;
          relOutputs['setExternalDone'](ds);
        });
      inputs['dynamicTitle']((val: any, relOutputs) => {
        if (Object.prototype.toString.call(val) === '[object Function]') {
          val = String(val);
        } else if (typeof val !== 'string') {
          //输入为数组，对象，布尔，null
          if (val === null) {
            val = 'null';
          } else if (val === undefined) {
            val = 'undefined';
          } else {
            val = JSON.stringify(val);
          }
        }
        data.text = val;
        relOutputs['setDynamicTitleDone'](val);
      });
      inputs[InputIds.Disabled]((value, relOutputs) => {
        setDisable(value);
        relOutputs['setDynamicDisabledDone'](value);
      });
    }
    inputs['setDynamicStyle'] &&
      inputs['setDynamicStyle']((style: React.CSSProperties, relOutputs) => {
        setDynamicStyle(style);
        typeof relOutputs['setDynamicStyleDone'] === 'function' &&
          relOutputs['setDynamicStyleDone']();
      });
  }, []);

  const onClick = useCallback((e) => {
    if (!env.runtime) {
      return;
    }

    if (outputs[OutputIds.Click].getConnections().length) {
      e.stopPropagation();
    }

    const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
    outputs[OutputIds.Click](outputVal);
  }, []);

  const onDoubleClick = useCallback((e) => {
    if (!env.runtime) {
      return;
    }

    if (outputs[OutputIds.DbClick].getConnections().length) {
      e.stopPropagation();
    }

    const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
    outputs[OutputIds.DbClick](outputVal);
  }, []);

  if (data.asMapArea) {
    return (
      <div
        className={`${classnames(css.wrapper, env.edit && css.asMapArea)}`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      ></div>
    );
  }
  return (
    <div className={css.wrapper}>
      <Button
        className={`${css.button} button`}
        type={data.type}
        danger={data.danger}
        size={data.size}
        shape={data.shape}
        disabled={data.disabled || disabled}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={dynamicStyle}
      >
        {renderBtnContext({ ...data, text: env.i18n(data.text) })}
      </Button>
    </div>
  );
}
