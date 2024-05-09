import { Data } from '../../constants';
import React from 'react';

const rowKey = '_itemKey';
//A、自动换行，列数不自定义
export default (dataSource: any, data: Data, slots, env) => {
  return (
    <div className="list-new__root" style={{ height: '100%' }}>
      {dataSource.map(({ [rowKey]: key, index: index, item: item }, number) => (
        <div key={key} style={{ height: '100%' }}>
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
