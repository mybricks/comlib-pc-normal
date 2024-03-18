import React, { useEffect, useMemo, useState } from 'react';
import { List, Anchor, Col, Row } from 'antd';
import classnames from 'classnames';
import { Data, InputIds, OutputIds } from './constants';
import { uuid } from '../utils';
import css from './style.less';

const { Link } = Anchor;
const rowKey = '_itemKey';

const editAnchorData = [
  { [rowKey]: 1, item: { title: '锚点1' } },
  { [rowKey]: 2, item: { title: '锚点2' } },
  { [rowKey]: 3, item: { title: '锚点3' } }
];

export default ({ data, inputs, slots, env, outputs, logger }: RuntimeParams<Data>) => {
  let { useLoading } = data;
  const [dataSource, setDataSource] = useState<any[]>([...(data.dataSource || [])]);
  const [loading, setLoading] = useState(false);

  //设置数据源输入及loading状态设置
  useEffect(() => {
    if (env.edit) {
      setDataSource([{ index: 0, [rowKey]: uuid(), item: {} }]);
    }
    if (env.runtime && data.useDynamicData) {
      inputs[InputIds.DATA_SOURCE]((v, relOutputs) => {
        if (Array.isArray(v)) {
          const ds = v.map((item, index) => ({
            item,
            [rowKey]: uuid(),
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
          setLoading(!!v);
          relOutputs['setLoadingDone'](v);
        });
    }
  }, []);

  const ListItemRender = (itemProps) => {
    const { [rowKey]: key, index: index, item: item } = itemProps;

    return (
      <List.Item key={key} id={`mybricks-anchor-${key}`}>
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

  //0、 无内容
  if (dataSource.length === 0 && data.useDynamicData) {
    return null;
  }
  return (
    <Row>
      <Col span={20}>
        {data.useDynamicData ? (
          <List
            loading={loading}
            // grid={{
            //   ...grid,
            //   gutter
            // }}
            dataSource={dataSource}
            renderItem={ListItemRender}
            rowKey={rowKey}
            className={classnames(
              css.listWrap,
              dataSource.length === 0 && env.runtime && !loading && css.hideEmpty
            )}
          />
        ) : (
          data.staticData.map((item, index) => (
            <div key={item.id} id={`mybricks-anchor-${item.id}`}>
              {slots[item.id]?.render()}
            </div>
          ))
        )}
      </Col>
      <Col span={4}>
        <Anchor affix={data.enableFix}>
          {data.useDynamicData
            ? env.edit
              ? editAnchorData.map((i) => (
                  <Link key={i[rowKey]} href={location.href} title={i.item.title} />
                ))
              : dataSource.map((i) => (
                  <Link key={i[rowKey]} href={`#mybricks-anchor-${i[rowKey]}`} title={i.item.title} />
                ))
            : data.staticData.map((i) => (
                <Link key={i.id} href={`#mybricks-anchor-${i.id}`} title={i.title} />
              ))}
        </Anchor>
      </Col>
    </Row>
  );
};
