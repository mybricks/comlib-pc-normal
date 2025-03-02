import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Data, OutputIds, LocationEnum, InputIds } from './constants';
import css from './runtime.less';
import * as Icons from '@ant-design/icons';
import { Space, Image, Button } from 'antd';
import { renderBtnContext } from './btnRender';
import { values } from 'lodash';

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

      inputs['setStateRunning']((val, relOutputs) => {
        //setDisable(true)
        const running = {
          //保存原始数据
          text: data.text,
          icon: data.icon,
          useIcon: data.useIcon
        };

        data.running = running;

        data.useIcon = true;
        data.icon = 'LoadingOutlined';

        if (val) {
          data.text = env.i18n(val);
        }
      });

      inputs['setStateRunning']((val, relOutputs) => {
        //setDisable(true)
        const running = {
          //保存原始数据
          text: data.text,
          icon: data.icon,
          useIcon: data.useIcon
        };

        data.running = running;

        data.useIcon = true;
        data.icon = 'LoadingOutlined';

        data.text = val || env.i18n('loading');
      });

      inputs['setStateNormal']((val, relOutputs) => {
        if (data.running) {
          data.text = data.running.text;
          data.icon = data.running.icon;
          data.useIcon = data.running.useIcon;

          delete data.running;
        }
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

    const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;

    if (data.running) {
      outputs[OutputIds.ClickOnRunning](outputVal);
      return;
    }

    if (outputs[OutputIds.Click].getConnections().length) {
      e.stopPropagation();
    }

    outputs[OutputIds.Click](outputVal);
  }, []);

  const onDoubleClick = useCallback((e) => {
    if (!env.runtime) {
      return;
    }

    if (data.running) {
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
        disabled={disabled}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={dynamicStyle}
      >
        {renderBtnContext({ ...data, text: env.i18n(data.text) })}
      </Button>
    </div>
  );
}
