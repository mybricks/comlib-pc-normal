import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List, Anchor, Col, Row } from 'antd';
import classnames from 'classnames';
import scrollTo from 'antd/es/_util/scrollTo';
import getScroll from 'antd/es/_util/getScroll';
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
    inputs[InputIds.SET_ACTIVE_ANCHOR] &&
      inputs[InputIds.SET_ACTIVE_ANCHOR]((val, relOutputs) => {
        if (val.index === undefined && val.title === undefined) {
          console.error('设置激活的锚点，参数需要有index和title 之一');
          return;
        }
        if (val.index !== undefined) {
          let maxIndex = data.useDynamicData ? data.dataSource.length : data.staticData.length;
          if (val.index > maxIndex || val.index < 0) {
            console.error('设置激活的锚点，index 超出范围');
            return;
          }
        }
        let anchorTarget;
        if (data.useDynamicData) {
          anchorTarget =
            val.index === undefined
              ? data.dataSource.findIndex((i) => i.item.title === val.title)
              : data.dataSource[val.index];
        } else {
          anchorTarget =
            val.index === undefined
              ? data.staticData.findIndex((i) => i.title === val.title)
              : data.staticData[val.index];
        }
        let anchorId = data.useDynamicData ? anchorTarget[rowKey] : anchorTarget.id;
        innerScrollToAnchor(`mybricks-anchor-${anchorId}`);

        relOutputs[`${InputIds.SET_ACTIVE_ANCHOR}Done`](val);
      });
  }, []);

  const innerScrollToAnchor = (id: string) => {
    const targetElement = document.getElementById(id);
    if (!targetElement) {
      return;
    }
    targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const ListItemRender = useCallback((itemProps) => {
    const { [rowKey]: key, index: index, item: item } = itemProps;

    return (
      <List.Item key={key} id={`mybricks-anchor-${key}`}>
        {/* 当前项数据和索引 */}
        {slots['item']?.render({
          inputValues: {
            itemData: item,
            index: index
          },
          key: key
        })}
      </List.Item>
    );
  }, []);

  const ContentBox = useCallback(
    () => (
      <Col span={data.hideAnchorList ? 24 : 20}>
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
              {slots[item.id]?.render({ key: item.id })}
            </div>
          ))
        )}
      </Col>
    ),
    [data.useDynamicData, data.staticData, dataSource, loading, data.hideAnchorList]
  );

  const AnchorBox = useCallback(
    () => (
      <Col span={4}>
        <Anchor
          affix={env.edit ? false : data.enableFix}
          getContainer={() => document.querySelector('#root > div') as HTMLElement}
        >
          {data.useDynamicData
            ? env.edit
              ? editAnchorData.map((i) => (
                  <Link key={i[rowKey]} href={location.href} title={i.item.title} />
                ))
              : dataSource.map((i) => (
                  <Link
                    key={i[rowKey]}
                    href={`#mybricks-anchor-${i[rowKey]}`}
                    title={i.item.title}
                  />
                ))
            : data.staticData.map((i) => (
                <Link key={i.id} href={`#mybricks-anchor-${i.id}`} title={i.title} />
              ))}
        </Anchor>
      </Col>
    ),
    [data.enableFix, data.useDynamicData, data.staticData, dataSource]
  );

  const LeftContainer = useCallback(
    () =>
      data.hideAnchorList ? (
        <ContentBox />
      ) : data.anchorPosition === 'left' ? (
        <AnchorBox />
      ) : (
        <ContentBox />
      ),
    [data.anchorPosition, AnchorBox, ContentBox]
  );
  // 隐藏锚点列表时，左侧展示展示ContentBox，右侧不展示
  const RightContainer = useCallback(
    () =>
      data.hideAnchorList ? <></> : data.anchorPosition === 'left' ? <ContentBox /> : <AnchorBox />,
    [data.anchorPosition, AnchorBox, ContentBox]
  );

  //0、 无内容
  if (dataSource.length === 0 && data.useDynamicData) {
    return null;
  }
  return (
    <Row>
      <LeftContainer />
      <RightContainer />
    </Row>
  );
};
