import { VerticalWarpRender } from './render/VerticalWarpRender';
import { NoAutoWarpRender } from './render/NoAutoWarpRender';
import { CustomColumnRender } from './render/CustomColumnRender';
import { ResponsiveRender } from './render/ResponsiveRender';
import classnames from 'classnames';
import { Data, Layout } from '../constants';
import css from '../style.less';
import React from 'react';

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
  //0、无内容
  if (slots['item'].size === 0) {
    return slots['item'].render();
  }
  //5、响应式布局
  if (data.layout === Layout.Grid && data.isResponsive) {
    return (
      <div className={classnames(css.container, 'list-new__root')}>
        {ResponsiveRender(loading, data, dataSource, gutter, slots, env, columns)}
      </div>
    );
  }
  //1、垂直布局
  if (data.layout === Layout.Vertical) {
    return VerticalWarpRender(loading, data, dataSource, slots);
  }
  //2、栅格布局
  else if (data.layout === Layout.Grid) {
    return (
      <div className={classnames(css.container, 'list-new__root')}>
        {CustomColumnRender(loading, data, dataSource, gutter, slots, env, onSortEnd)}
      </div>
    );
  }
  //3、横向布局
  else if (data.layout === Layout.Horizontal) {
    return NoAutoWarpRender(loading, data, dataSource, slots, env);
  }
};

export { ListRender };
