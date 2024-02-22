import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Data, OutputIds, LocationEnum, InputIds } from './constants';
import css from './runtime.less';
import * as Icons from '@ant-design/icons';
import { Space, Image, Button } from 'antd';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  const [disabled, setDisable] = useState(false);

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
  }, []);
  const onClick = useCallback(() => {
    if (env.runtime) {
      const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
      outputs[OutputIds.Click](outputVal);
    }
  }, []);

  const onDoubleClick = useCallback(() => {
    if (env.runtime) {
      const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
      outputs[OutputIds.DbClick](outputVal);
    }
  }, []);

  const renderText = (text: string) => {
    return <span>{env.i18n(text)}</span>;
  };

  // const renderTextAndIcon = (item: Data) => {
  //   const { useIcon, icon, iconLocation, iconDistance, text, showText, contentSize } = item;
  //   const Icon = Icons && Icons[icon as string]?.render();
  //   return (
  //     <Space size={text !== '' ? iconDistance : 0}>
  //       {useIcon && Icon && iconLocation === LocationEnum.FRONT ? (
  //         <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
  //       ) : null}
  //       {!useIcon || showText ? renderText(text) : null}
  //       {useIcon && Icon && iconLocation === LocationEnum.BACK ? (
  //         <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
  //       ) : null}
  //     </Space>
  //   );
  // };
  const renderTextAndIcon = (item: Data) => {
    const { useIcon, icon, iconLocation, iconDistance, text, showText, contentSize } = item;
    const Icon = Icons && Icons[icon as string]?.render();
    return (
      <Space size={text !== '' ? iconDistance : 0}>
        {useIcon && Icon && iconLocation === LocationEnum.FRONT ? (
          <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
        ) : null}
        {!useIcon || showText ? renderText(text) : null}
        {useIcon && Icon && iconLocation === LocationEnum.BACK ? (
          <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
        ) : null}
      </Space>
    );
  };

  const renderTextAndCustom = (item: Data) => {
    const { useIcon, iconLocation, iconDistance, text, showText, src, contentSize } = item;
    return (
      <Space size={text !== '' ? iconDistance : 0} className={css.space}>
        {useIcon && src && iconLocation === LocationEnum.FRONT ? (
          <Image
            width={contentSize[1]}
            height={contentSize[0]}
            src={src}
            preview={false}
            alt={' '}
          ></Image>
        ) : null}
        {!useIcon || showText ? renderText(text) : null}
        {useIcon && src && iconLocation === LocationEnum.BACK ? (
          <Image
            width={contentSize[1]}
            height={contentSize[0]}
            src={src}
            preview={false}
            alt={' '}
          ></Image>
        ) : null}
      </Space>
    );
  };

  const renderBtnContext = (item: Data) => {
    const { isCustom, text, useIcon } = item;
    if (!useIcon) {
      return renderText(text);
    }
    if (isCustom === true) {
      return renderTextAndCustom(item);
    } else {
      return renderTextAndIcon(item);
    }
  };
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
      >
        {renderBtnContext(data)}
      </Button>
    </div>
  );
}
