import React from 'react';
import { Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { BtnItem, LocationEnum } from './types';
import css from './style.less';

export const renderBtnContext = (item: BtnItem) => {
  const { useIcon, icon, iconLocation, iconDistance, text, showText, src, contentSize, isCustom } =
    item;
  let Icon = Icons && Icons[icon as string]?.render();
  Icon = typeof Icon === 'undefined' ? 
        <div style={{display: 'flex', alignItems: 'center'}} dangerouslySetInnerHTML={{ __html: icon }} /> : 
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
        {!useIcon || showText ? <span>{text}</span> : null}
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
