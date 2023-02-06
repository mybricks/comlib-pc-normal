import React, { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import classnames from 'classnames';
import { Data, InputIds } from './constants';
import { uuid } from '../utils';
import css from './style.less';
import { SortableList, SortableItem } from './sort';

const arrayMove = <T,>(array: Array<T>, form: number, to: number): Array<T> => {
  const _array = array.slice();
  const moveItem = _array.splice(form, 1)[0];
  _array.splice(to, 0, moveItem);
  return _array;
};

const rowKey = '_itemKey';
export default ({ data, inputs, slots, env, outputs }: RuntimeParams<Data>) => {
  const { grid, useLoading, useGetDataSource } = data;
  const [dataSource, setDataSource] = useState<any[]>([...(data.dataSource || [])]);
  const [loading, setLoading] = useState(false);
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];

  //设置数据源输入及loading状态设置
  useEffect(() => {
    if (env.edit) {
      setDataSource([{ id: 1 }]);
    }
    if (env.runtime) {
      inputs[InputIds.DATA_SOURCE]((v) => {
        if (Array.isArray(v)) {
          const ds = v.map((item, index) => ({ item, [rowKey]: uuid(), index: index }));
          data.dataSource = ds;
          setDataSource(ds);
        }
        setLoading(false);
      });
      useLoading &&
        inputs[InputIds.LOADING] &&
        inputs[InputIds.LOADING]((v) => {
          setLoading(v !== false);
        });
    }
  }, []);
  //获取数据源
  useEffect(() => {
    if (env.runtime && useGetDataSource && inputs[InputIds.GetDataSource]) {
      inputs[InputIds.GetDataSource]((val, relOutputs) => {
        const outputFn = relOutputs?.[InputIds.GetDataSource] || outputs[InputIds.GetDataSource];
        outputFn(dataSource.map(({ item }) => item));
      });
    }
  }, [dataSource]);

  //1. 自动换行，列数不自定义的情况
  const AutoRender = () => {
    return (
      <div
        className={css.flexContainer}
        style={{ margin: `calc(0px - ${gutter[1]}px) 0 0 calc(0px - ${gutter[0]}px)` }}
      >
        {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
          <div key={key} style={{ margin: `${gutter[1]}px 0 0 ${gutter[0]}px` }}>
            {slots['item'].render({
              inputValues: {
                itemData: item,
                index: index
              },
              key: (() => {
                console.log(key, 'list-new-key');
                return key;
              })()
            })}
          </div>
        ))}
      </div>
    );
  };

  //2. 换行，列数自定义
  const ListItemRender = ({ [rowKey]: key, index: index, item: item }) => {
    return (
      <List.Item key={key}>
        {/* 当前项数据和索引 */}
        {slots['item'].render({
          inputValues: {
            itemData: item,
            index: index
          },
          key: key
        })}
      </List.Item>
    );
  };

  //3. 不换行，且不滚动
  const NoAutoRender = () => {
    return (
      <div
        className={css.noflexContainer}
        style={{ margin: `calc(0px - ${gutter[1]}px) 0 0 calc(0px - ${gutter[0]}px)` }}
      >
        {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
          <div key={key} style={{ margin: `${gutter[1]}px 0 0 ${gutter[0]}px` }}>
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

  //4. 不换行，但是滚动
  const NoAutoScrollRender = () => {
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

  //0) 无内容
  if (slots['item'].size === 0) {
    return slots['item'].render();
  }

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
        renderItem={({ key, item, index }) => (
          <SortableItem key={key} index={index}>
            {slots['item'].render({
              inputValues: {
                itemData: item,
                index
              },
              key
            })}
          </SortableItem>
        )}
        onSortEnd={({ oldIndex, newIndex }) => {
          setDataSource(arrayMove(dataSource, oldIndex, newIndex));
        }}
      />
    );
  }

  //1) 自动换行
  if (data.isAuto === true && data.isCustom === false) {
    return loading ? (
      <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
        <AutoRender />
      </Spin>
    ) : (
      <AutoRender />
    );
  }
  //2) 换行，列数自定义
  else if (data.isAuto === true && data.isCustom === true && data.grid.column !== undefined) {
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
  //3）不自动换行，不滚动
  else if (data.isAuto === false && data.isScroll === false) {
    return loading ? (
      <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
        <NoAutoRender />
      </Spin>
    ) : (
      <NoAutoRender />
    );
  }
  //4）不换行，滚动
  else if (data.isAuto === false && data.isScroll === true) {
    return loading ? (
      <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
        <NoAutoScrollRender />
      </Spin>
    ) : (
      <NoAutoScrollRender />
    );
  }
};
