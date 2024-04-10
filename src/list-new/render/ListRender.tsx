import { AutoWarpRender } from './render/AutoWarpRender';
import { NoAutoWarpRender } from './render/NoAutoWarpRender';
import { CustomColumnRender } from './render/CustomColumnRender';
import { ResponsiveRender } from './render/ResponsiveRender';
import { Data } from '../constants';

const ListRender  = ( env, slots, data:Data, dataSource:any, loading:boolean, gutter, onSortEnd, columns ) => {
  //0、无内容
  if (slots['item'].size === 0) {
    return slots['item'].render();
  }
  //5、响应式布局
  if (data.isResponsive) {
    return ResponsiveRender(loading, data, dataSource, gutter, slots, env, columns)
  }
  //1、 自动换行
  if (data.isAuto === true && data.isCustom === false) {
    return AutoWarpRender(loading, data, dataSource, slots);
  }
  //2、 换行，列数自定义
  else if (data.isAuto === true && data.isCustom === true && data.grid.column !== undefined) {
    return CustomColumnRender(loading, data, dataSource, gutter, slots, env , onSortEnd);
  }
  //3、不自动换行，不滚动
  //4、不自动换行，滚动
  else if (data.isAuto === false) {
    return NoAutoWarpRender(loading, data, dataSource, slots);
  }
};

export { ListRender };