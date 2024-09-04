import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import classnames from 'classnames';
import { Spin, List } from 'antd';
import { SortableList, SortableItem } from './sort';

const CustomColumnRender = (
  loading: boolean,
  data: Data,
  dataSource: any,
  gutter,
  slots,
  env,
  onSortEnd
) => {
  let { grid } = data;
  const rowKey = '_itemKey';
  const ListItemRender = ({ [rowKey]: key, index: index, item: item },number) => {
    return (
      <List.Item key={key} className={env.edit ? '' :'list-new__item'} 
      style={{ 
        overflowX: env.edit ? 'visible' : 'auto',
        opacity: env.edit && index=== 0 ? 0.4 : void 0
      }}>
        {/* 当前项数据和索引 */}
        {slots['item']?.render({
          inputValues: {
            itemData: item,
            index: index
          },
          key: key,
          style:{
            opacity: env.edit && number !== 0 ? 0.4 : void 0,
            filter: env.edit  && number !== 0 ? 'blur(0.8px)': void 0
          }
          // style: {
          //   ...data?.slotLayoutStyle,
          //   minHeight: env.edit && data?.slotLayoutStyle.position === 'smart' ? '30px' : void 0
          // }
        })}
      </List.Item>
    );
  };

  if (data.canSort) {
    return env.edit ? (
      <List
        loading={loading}
        grid={{
          ...grid,
          gutter
        }}
        dataSource={dataSource}
        renderItem={ListItemRender}
        rowKey={rowKey}
        className={classnames(
          css.listWrap,
          css.height100,
          dataSource.length === 0 && env.runtime && !loading && css.hideEmpty
        )}
      />
    ) : (
      <SortableList
        list={dataSource}
        data={data}
        lockAxis="y"
        distance={2}
        helperContainer={env?.canvasElement || document.body}
        helperClass={css['sort-helper']}
        renderItem={({ key, item, index }) => (
          <SortableItem key={key} index={index}>
            <div className={env.edit ? '' :'list-new__item'} style={{ overflowX: 'auto' }}>
              {slots['item']?.render({
                inputValues: {
                  itemData: item,
                  index
                },
                key,
                //style: data?.slotLayoutStyle
              })}
            </div>
          </SortableItem>
        )}
        onSortEnd={onSortEnd}
      />
    );
  } else {
    //2.2、普通情况
    return (
      <List
        loading={loading}
        grid={{
          ...grid,
          gutter
        }}
        dataSource={dataSource}
        renderItem={ListItemRender}
        rowKey={rowKey}
        className={classnames(
          css.listWrap,
          env.edit && css.height100,
          dataSource.length === 0 && env.runtime && !loading && css.hideEmpty
        )}
      />
    );
  }
};

export { CustomColumnRender };
