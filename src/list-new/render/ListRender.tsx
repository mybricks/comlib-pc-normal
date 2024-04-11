import { AutoWarpRender } from './render/AutoWarpRender';
import { NoAutoWarpRender } from './render/NoAutoWarpRender';
import { CustomColumnRender } from './render/CustomColumnRender';
import { ResponsiveRender } from './render/ResponsiveRender';
import { Data, LayoutType } from '../constants';

const ListRender  = ( env, slots, data:Data, dataSource:any, loading:boolean, gutter, onSortEnd, columns ) => {
  //0、无内容
  if (slots['item'].size === 0) {
    return slots['item'].render();
  }
  //5、响应式布局
  if (data.layoutType === LayoutType.Grid && data.isResponsive) {
    return ResponsiveRender(loading, data, dataSource, gutter, slots, env, columns)
  }
  //1、垂直布局
  if (data.layoutType === LayoutType.Vertical) {
    return AutoWarpRender(loading, data, dataSource, slots);
  }
  //2、栅格布局
  else if (data.layoutType === LayoutType.Grid) {
    return CustomColumnRender(loading, data, dataSource, gutter, slots, env , onSortEnd);
  }
  //3、横向布局
  else if (data.layoutType === LayoutType.Horizontal) {
    return NoAutoWarpRender(loading, data, dataSource, slots);
  }
};

export { ListRender };