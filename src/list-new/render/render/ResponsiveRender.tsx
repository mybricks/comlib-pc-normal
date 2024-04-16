import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import classnames from 'classnames';
import { Spin, List } from 'antd';
import { SortableList, SortableItem } from './sort';

const ResponsiveRender  = (loading:boolean, data:Data, dataSource:any, gutter, slots, env, columns) => {
  let { grid } = data;
  const rowKey = '_itemKey';
  const ListItemRender = ({ [rowKey]: key, index: index, item: item }) => {
    return (
      <List.Item key={key} className='list-new__item' style={{ overflowX: 'scroll' }}>
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

  const IsCustomPointsRender = () => {
    return (
      <List
        loading={loading}
        grid={{
          gutter,
          column: columns
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

  return env.edit ? (
    <List
      loading={loading}
      grid={{
        gutter: data.grid.gutter
      }}
      dataSource={dataSource}
      renderItem={ListItemRender}
      rowKey={rowKey}
      className={classnames(css.listWrap)}
    />
  ) : data.isCustomPoints ? (
    IsCustomPointsRender()
  ) : (
    <List
      loading={loading}
      grid={{
        gutter: data.grid.gutter,
        xs: data.bootstrap[0],
        sm: data.bootstrap[1],
        md: data.bootstrap[2],
        lg: data.bootstrap[3],
        xl: data.bootstrap[4],
        xxl: data.bootstrap[5]
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
};

export { ResponsiveRender };