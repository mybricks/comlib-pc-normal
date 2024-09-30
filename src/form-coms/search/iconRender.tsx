import React from 'react';
import { Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';

export const iconRenderCtx = (item) => {
    const { useIcon, icon, iconDistance, src, contentSize, isCustom } =
        item;
    let Icon = Icons && Icons[icon as string]?.render();
    Icon = typeof Icon === 'undefined' ?
        <div style={{ display: 'flex', alignItems: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} /> :
        Icons && Icons[icon as string]?.render();
    //自定义图标
    const CustomIcon = <span style={{ fontSize: contentSize?.[0] || 14 }}>{Icon}</span>;
    //自定义图片
    const CustomImage = (
        <Image width={contentSize?.[1] || 14} height={contentSize?.[0] || 14} src={src} preview={false} alt={' '} />
    );

    const IconContent = () => {
        return (
            <div className={css.space}>
                {useIcon
                    ? isCustom
                        ? src
                            ? CustomImage
                            : null
                        : CustomIcon
                    : null}
            </div>
        );
    };
    return IconContent();
};
