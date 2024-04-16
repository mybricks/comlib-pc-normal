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
  const ListItemRender = ({ [rowKey]: key, index: index, item: item }) => {
    return (
      <List.Item key={key} className="list-new__item" style={{ overflowX: env.edit ? 'visible' : 'scroll' }}>
        {/* 当前项数据和索引 */}
        {slots['item'].render({
          inputValues: {
            itemData: item,
            index: index
          },
          style: env.edit ? {
            minHeight: '30px',
          } : {
            width: 'fit-content',
            height: '100%',
          },
          key: key
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
            <div className="list-new__item" style={{ overflowX: 'scroll' }}>
              {slots['item'].render({
                inputValues: {
                  itemData: item,
                  index
                },
                style: env.edit ? {
                  minHeight: '30px',
                } : {
                  width: 'fit-content',
                  height: '100%',
                },
                key
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
          dataSource.length === 0 && env.runtime && !loading && css.hideEmpty
        )}
      />
    );
  }
};

export { CustomColumnRender };
