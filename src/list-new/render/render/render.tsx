import { Space } from 'antd';
import { Data, Layout } from '../../constants';
import css from '../../style.less';
import React from 'react';
import classnames from 'classnames';

const rowKey = '_itemKey';
//A、自动换行，列数不自定义
const AutoRender = (dataSource: any, data: Data, slots, env) => {
  const { grid } = data;
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return (
    <Space size={gutter} direction={'horizontal'} wrap>
      {dataSource.map(({ [rowKey]: key, index: index, item: item }, number) => (
        <div key={key} className="list-new__item">
          {slots['item']?.render({
            inputValues: {
              itemData: item,
              index: index
            },
            key: key,
            style: {
              minWidth: env.edit && slots['item'].size === 0 ? '80px' : void 0,
              opacity: number && env.edit !== 0 ? 0.4 : void 0,
              filter: number && env.edit !== 0 ? 'blur(0.8px)': void 0
            }
            //style: data?.slotLayoutStyle
          })}
        </div>
      ))}
    </Space>
  );
};

//B、纵向布局
const VerticalRender = (dataSource: any, data: Data, slots, env) => {
  const { grid } = data;
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return dataSource.map(({ [rowKey]: key, index: index, item: item }, number) => (
    <div
      key={key}
      className="list-new__item"
      style={{
        width: data.itemWidth,
        marginBottom: number !== dataSource.length - 1 ? `${gutter[1]}px` : 0
      }}
    >
      {slots['item']?.render({
        inputValues: {
          itemData: item,
          index: index
        },
        key: key,
        style:{
          opacity: number && env.edit !== 0 ? 0.4 : void 0,
          filter: number && env.edit !== 0 ? 'blur(0.8px)': void 0
        }
        // style: {
        //   ...data?.slotLayoutStyle,
        //   //minHeight: '30px'
        // }
      })}
    </div>
  ));
};

//C、不换行，且不滚动
// const NoAutoRender = (dataSource: any, data: Data, slots) => {
//   const { grid } = data;
//   const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
//   return (
//     <div className={css.noflexContainer}>
//       {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
//         <div key={key} style={{ width: data.itemWidth, margin: `0 ${gutter[0]}px 0 0` }}>
//           {slots['item']?.render({
//             inputValues: {
//               itemData: item,
//               index: index
//             },
//             key: key
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

//D、不换行，但是滚动
const NoAutoScrollRender = (dataSource: any, data: Data, slots, env) => {
  const { grid } = data;
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return dataSource.map(({ [rowKey]: key, index: index, item: item }, number) => (
    <div
      key={key}
      className={`${css.scrollBox} list-new__item`}
      style={{
        width: data.itemWidth,
        minWidth: env.edit && slots['item'].size === 0 && !data.itemWidth ? '80px' : void 0,
        margin: `0 ${number === dataSource?.length - 1 ? 0 : gutter[0]}px 0 0`
      }}
    >
      {slots['item']?.render({
        inputValues: {
          itemData: item,
          index: index
        },
        key: key,
        style:{
          opacity: number && env.edit !== 0 ? 0.4 : void 0,
          filter: number && env.edit !== 0 ? 'blur(0.8px)': void 0
        }
        //style: data?.slotLayoutStyle
      })}
    </div>
  ));
};

export { AutoRender, VerticalRender, NoAutoScrollRender };
