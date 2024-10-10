import React from 'react';
import { Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { LocationEnum } from './constants';
import css from './runtime.less';

export const renderBtnContext = (item) => {
  const { useIcon, icon, iconLocation, iconDistance, text, showText, src, contentSize, isCustom, title } =
    item;
  const Icon = Icons && Icons[icon as string]?.render();
  Icon = typeof Icon === 'undefined' ?
    <div style={{ display: 'flex', alignItems: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} /> :
    Icons && Icons[icon as string]?.render();
  //自定义图标
  const CustomIcon = <span style={{ fontSize: contentSize[0] }}>{Icon}</span>;
  //自定义图片
  const CustomImage = (
    <Image width={contentSize[1]} height={contentSize[0]} src={src} preview={false} alt={' '} />
  );

  const IconContent = () => {
    return (
      <Space size={iconDistance} className={css.space}>
        {useIcon && iconLocation === LocationEnum.FRONT
          ? isCustom
            ? src
              ? CustomImage
              : null
            : CustomIcon
          : null}
        {(!useIcon || showText) && text !== '' ? <span>{text}</span> : null}
        {useIcon && iconLocation === LocationEnum.BACK
          ? isCustom
            ? src
              ? CustomImage
              : null
            : CustomIcon
          : null}
      </Space>
    );
  };
  return IconContent();
};
