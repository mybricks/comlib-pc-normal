import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { List, Spin } from 'antd';
import classnames from 'classnames';
import { Data, InputIds, OutputIds } from './constants';
import { checkIfMobile, uuid } from '../utils';
import css from './style.less';
import { SortableList, SortableItem } from './sort';
import { AutoRender, NoAutoRender, NoAutoScrollRender } from './render';
import { debounce } from 'lodash';
import { addItem, removeItem, changeItem, upMove, downMove } from './utils';

const arrayMove = <T,>(array: Array<T>, form: number, to: number): Array<T> => {
  const _array = array.slice();
  const moveItem = _array.splice(form, 1)[0];
  _array.splice(to, 0, moveItem);
  return _array;
};

const rowKey = '_itemKey';
export default ({ data, inputs, slots, env, outputs, logger }: RuntimeParams<Data>) => {
  let { grid, useLoading, useGetDataSource } = data;
  const [dataSource, setDataSource] = useState<any[]>([...(data.dataSource || [])]);
  const [loading, setLoading] = useState(false);
  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  const isMobile = checkIfMobile(env);

  const [columns, setColumns] = useState(1);

  grid = isMobile ? { ...grid, column: grid.mobileColumn } : { ...grid };

  function sortUsePoint(a, b) {
    return b.point - a.point;
  }

  function columnHandel(opt, width) {
    let newColumns;
    for (let i = 0; i < opt.length; i++) {
      if (width >= opt[i].point && opt[i].relation === '≥') {
        newColumns = opt[i].columns;
        break;
      } else if (width < opt[i].point && opt[i].relation === '<') {
        newColumns = opt[i].columns;
        break;
      }
    }
    return newColumns;
  }

  useLayoutEffect(() => {
    if (env.runtime.debug?.prototype) {
      // 原型设计态
      const mockArr = new Array<any>(3).fill({});

      // Todo 这里的数据类型需要优化
      data.dataSource = mockArr.map((item, index) => {
        return {
          [rowKey]: index,
          item: {
            name: `第${index + 1}项`
          },
          index
        };
      });
      setDataSource(data.dataSource);
    }
  }, []);

  //设置数据源输入及loading状态设置
  useEffect(() => {
    if (env.edit) {
      setDataSource([{ id: 1, [rowKey]: uuid() }]);
    }

    if (env.runtime) {
      inputs[InputIds.DATA_SOURCE]((v, relOutputs) => {
        if (Array.isArray(v)) {
          const ds = v.map((item, index) => ({
            item,
            [rowKey]: data.rowKey === '' ? uuid() : item[data.rowKey] || uuid(),
            index: index
          }));
          data.dataSource = ds;
          setDataSource(ds);
          relOutputs['setDataSourceDone'](ds);
        }
        setLoading(false);
      });
      useLoading &&
        inputs[InputIds.LOADING] &&
        inputs[InputIds.LOADING]((v, relOutputs) => {
          setLoading(v !== false);
          relOutputs['setLoadingDone'](v);
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
  //添加一项
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.AddItem]((v, relOutputs) => {
        let newDataSource = [...data.dataSource];
        let len = newDataSource.length;
        //判断在指定位置还是末尾
        let judge = v.value !== undefined && v.index >= 0 && v.index < len;
        newDataSource = addItem(newDataSource, len, v, data.rowKey, judge);

        data.dataSource = newDataSource;
        setDataSource(newDataSource);
        relOutputs['addItemDone'](v);
      });
    }
  }, []);

  //删除一项
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.RemoveItem]((v, relOutputs) => {
        let newDataSource = [...data.dataSource];
        let len = newDataSource.length;
        let judge = typeof v === 'number' && v >= 0 && v < len;
        newDataSource = removeItem(newDataSource, v, judge, logger);

        data.dataSource = newDataSource;
        setDataSource(newDataSource);
        relOutputs['removeItemDone'](v);
      });
    }
  }, []);

  //改动一项
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.ChangeItem]((v, relOutputs) => {
        let newDataSource = [...data.dataSource];
        let len = newDataSource.length;
        let judge = typeof v.index === 'number' && v.index >= 0 && v.index < len;
        //有index, 且index在合理范围内
        if (judge) {
          if (v.value !== undefined) {
            newDataSource = changeItem(newDataSource, v, data.rowKey);
            data.dataSource = newDataSource;
            setDataSource(newDataSource);
            relOutputs['changeItemDone'](v);
          } else {
            logger.error('未指定value（改动值）');
          }
        } else {
          logger.error('未指定index（位置）或index不在合理范围内');
        }
      });
    }
  }, []);

  //指定对应项上移
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.MoveUp]((v, relOutputs) => {
        let newDataSource = [...data.dataSource];
        let len = newDataSource.length;
        if (typeof v === 'number' && v > 0 && v < len) {
          newDataSource = upMove(newDataSource, v);
          data.dataSource = newDataSource;
          setDataSource(newDataSource);
          relOutputs['moveUpDone'](v);
        } else {
          logger.error('指定index不在合理范围内');
        }
      });
    }
  }, []);

  //指定对应项下移
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.MoveDown]((v, relOutputs) => {
        let newDataSource = [...data.dataSource];
        let len = newDataSource.length;
        if (typeof v === 'number' && v >= 0 && v < len - 1) {
          newDataSource = downMove(newDataSource, v);
          data.dataSource = newDataSource;
          setDataSource(newDataSource);
          relOutputs['moveDownDone'](v);
        } else {
          logger.error('指定index不在合理范围内');
        }
      });
    }
  }, []);

  //换行，列数自定义
  const ListItemRender = ({ [rowKey]: key, index: index, item: item }) => {
    console.log(item);
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

  useEffect(() => {
    let orderedOptions = (data.customOptions || []).sort(sortUsePoint);
    const debounceFn = debounce(() => {
      let newColumns = columns;
      const width = window.innerWidth;
      newColumns = columnHandel(orderedOptions, width);
      //如果没有对应列数默认处理成1
      setColumns(newColumns || 1);
    }, 50);
    window.addEventListener('resize', debounceFn);
    return () => window.removeEventListener('resize', debounceFn);
  }, [data.customOptions]);

  useEffect(() => {
    let orderedOptions = (data.customOptions || []).sort(sortUsePoint);
    const width = window.innerWidth;
    let newColumns = columnHandel(orderedOptions, width);
    //如果没有对应列数默认处理成1
    setColumns(newColumns || 1);
  }, []);

  const IsCustomPointsRender = useMemo(() => {
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
  }, [columns]);

  //0、 无内容
  if (slots['item'].size === 0) {
    return slots['item'].render();
  }
  //5、响应式布局
  if (data.isResponsive) {
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
      IsCustomPointsRender
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
  }
  //1、 自动换行
  if (data.isAuto === true && data.isCustom === false) {
    return loading ? (
      <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
        {AutoRender(dataSource, data, slots)}
      </Spin>
    ) : (
      AutoRender(dataSource, data, slots)
    );
  }
  //2、 换行，列数自定义
  else if (data.isAuto === true && data.isCustom === true && data.grid.column !== undefined) {
    //2.1、可拖拽（换行、列数自定义、列数为1时，可拖拽排序）
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
            if (data.canSort) {
              outputs[OutputIds.SortComplete](arrayMove(dataSource, oldIndex, newIndex));
            }
          }}
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
  }
  //3、不自动换行，不滚动
  //4、不自动换行，滚动
  else if (data.isAuto === false) {
    return loading ? (
      <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
        {data.isScroll} ? {NoAutoScrollRender(dataSource, data, slots)} :{' '}
        {NoAutoRender(dataSource, data, slots)}
      </Spin>
    ) : data.isScroll ? (
      NoAutoScrollRender(dataSource, data, slots)
    ) : (
      NoAutoRender(dataSource, data, slots)
    );
  }
};
