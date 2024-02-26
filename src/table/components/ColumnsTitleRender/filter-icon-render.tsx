import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { FilterIconEnum } from '../../types';

export interface IFilterIconRenderProps {
  defaultType?: FilterIconEnum;
  type?: FilterIconEnum;
  filtered: boolean;
}

export default function FilterIconRender({ defaultType, filtered, type }: IFilterIconRenderProps) {
  const style = { color: filtered ? '#1890ff' : undefined };

  const finalType = (() => {
    if (type && type !== FilterIconEnum.Inherit) return type;
    return defaultType || 'filter';
  })();

  if (finalType === 'search') {
    return <SearchOutlined style={style} />;
  } else if (finalType === 'filter') {
    return <FilterFilled style={style} />;
  }

  return <FilterFilled style={style} />;
}
