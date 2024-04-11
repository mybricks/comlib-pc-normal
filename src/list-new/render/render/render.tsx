import { Data, LayoutType } from '../../constants';
import css from '../../style.less';
import React from 'react';

const rowKey = '_itemKey';
//A、自动换行，列数不自定义
const AutoRender = (dataSource: any, data: Data, slots) => {
  const { grid } = data;
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return (
    <div style={{ height: '100%', overflow: 'scroll' }}>
      <div className={css.flexContainer} style={{display: data.layoutType == LayoutType.Vertical ? 'block' : 'flex'}}>
        {dataSource.map(({ [rowKey]: key, index: index, item: item }, number) => (
          <div
            key={key}
            style={{
              // width: data.layoutType == LayoutType.Vertical ? '100%' : void 0,
              // height: 'fit-content',
              margin:
                number !== dataSource.length - 1
                  ? `0 ${gutter[0]}px ${gutter[1]}px 0`
                  : `0 ${gutter[0]}px 0 0`
            }}
          >
            {slots['item'].render({
              inputValues: {
                itemData: item,
                index: index
              },
              key: key
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

//C、不换行，且不滚动
// const NoAutoRender = (dataSource: any, data: Data, slots) => {
//   const { grid } = data;
//   const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
//   return (
//     <div className={css.noflexContainer}>
//       {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
//         <div key={key} style={{ width: data.itemWidth, margin: `0 ${gutter[0]}px 0 0` }}>
//           {slots['item'].render({
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
const NoAutoScrollRender = (dataSource: any, data: Data, slots) => {
  const { grid } = data;
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return (
    <div className={css.scrollContainer}>
      {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
        <div key={key} className={css.scrollBox} style={{ margin: `0 ${gutter[0]}px 0 0` }}>
          {slots['item'].render({
            inputValues: {
              itemData: item,
              index: index
            },
            key: key
          })}
        </div>
      ))}
    </div>
  );
};

export { AutoRender, NoAutoScrollRender };
