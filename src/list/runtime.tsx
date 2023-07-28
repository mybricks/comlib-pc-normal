import React, { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import classnames from 'classnames';
import { Data, FlexDirectionEnum, InputIds, LayoutTypeEnum } from './constants';
import { uuid } from '../utils';
import css from './style.less';

const rowKey = '_itemKey';
export default ({ data, inputs, slots, env, outputs }: RuntimeParams<Data>) => {
  const { layout, grid, useLoading, useGetDataSource, layoutType, flexStyle, flexAlign } = data;
  const [dataSource, setDataSource] = useState<any[]>([...(data.dataSource || [])]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (env.runtime && useGetDataSource && inputs[InputIds.GetDataSource]) {
      inputs[InputIds.GetDataSource]((val, relOutputs) => {
        const outputFn = relOutputs?.[InputIds.GetDataSource] || outputs[InputIds.GetDataSource];
        outputFn(dataSource.map(({ [rowKey]: key, ...res }) => ({ ...res })));
      });
    }
  }, [dataSource]);

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

  const getFlexStyle = () => {
    if (flexStyle?.flexDirection === FlexDirectionEnum.Column) {
      return {
        ...flexStyle,
        alignItems: flexAlign
      };
    }
    return {
      ...flexStyle,
      justifyContent: flexAlign
    };
  };
  const FlexLayoutRender = () => {
    return (
      <div
        style={{
          display: 'flex',
          ...getFlexStyle()
        }}
      >
        {dataSource.map(({ [rowKey]: key, index: index, item: item }) => (
          <div key={key}>
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

  if (slots['item'].size === 0) {
    return slots['item'].render();
  }

  if (layoutType === LayoutTypeEnum.Flex) {
    return loading ? (
      <Spin spinning={loading} wrapperClassName={css.loading}>
        <FlexLayoutRender />
      </Spin>
    ) : (
      <FlexLayoutRender />
    );
  }

  const gutter: any = Array.isArray(grid.gutter) ? grid.gutter : [grid.gutter, 16];
  return (
    <List
      loading={loading}
      itemLayout={layout}
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
};
