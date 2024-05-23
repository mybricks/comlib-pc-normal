import { VerticalWarpRender } from './render/VerticalWarpRender';
import { NoAutoWarpRender } from './render/NoAutoWarpRender';
import { CustomColumnRender } from './render/CustomColumnRender';
import { ResponsiveRender } from './render/ResponsiveRender';
import classnames from 'classnames';
import { Data, Layout } from '../constants';
import css from '../style.less';
import React from 'react';
import EditRender from './render/EditRender';

const ListRender = (
  env,
  slots,
  data: Data,
  dataSource: any,
  loading: boolean,
  gutter,
  onSortEnd,
  columns
) => {
  // 无内容
  if (slots['item'].size === 0) {
    return slots['item']?.render();
  }
  // 非栅格布局编辑态
  if (env.edit && !(data.layout === Layout.Grid && !data.isResponsive)) {
    return EditRender(dataSource, data, slots, env);
  }
  // 响应式布局
  if (data.layout === Layout.Grid && data.isResponsive) {
    return ResponsiveRender(loading, data, dataSource, gutter, slots, env, columns);
  }
  // 垂直布局
  if (data.layout === Layout.Vertical) {
    return VerticalWarpRender(loading, data, dataSource, slots, env);
  }
  // 栅格布局
  if (data.layout === Layout.Grid) {
    return CustomColumnRender(loading, data, dataSource, gutter, slots, env, onSortEnd);
  }
  // 横向布局
  if (data.layout === Layout.Horizontal) {
    return NoAutoWarpRender(loading, data, dataSource, slots, env);
  }
};

export { ListRender };
