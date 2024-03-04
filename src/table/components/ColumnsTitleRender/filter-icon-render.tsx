import * as Icons from '@ant-design/icons';
import React from 'react';
import { FilterIconEnum } from '../../types';

export interface IFilterIconRenderProps {
  defaultType?: FilterIconEnum;
  type?: FilterIconEnum;
  filtered: boolean;
  inherit?: boolean;
}

export default function FilterIconRender({
  defaultType,
  filtered,
  type,
  inherit = false
}: IFilterIconRenderProps) {
  const style = { color: filtered ? '#1890ff' : undefined };

  // 兼容老数据
  {
    if (defaultType === 'filter') defaultType = 'FilterFilled';
    else if (defaultType === 'search') defaultType = 'SearchOutlined';
    if (type === 'filter') type = 'FilterFilled';
    else if (type === 'search') type = 'SearchOutlined';
  }

  const FinalIcon =
    (() => {
      if (inherit) return defaultType && Icons[defaultType];
      return type && Icons[type];
    })() || Icons['FilterFilled'];

  return <FinalIcon style={style} />;
}
