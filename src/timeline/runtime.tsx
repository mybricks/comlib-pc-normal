import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { Timeline, Badge } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { uuid } from '../utils';
import { Data, DataSourceEnum, InputIds, Item, OutputIds, SlotIds } from './constants';
import css from './runtime.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, slots, logger, outputs } = props;
  const [collapse, setCollapse] = useState(env.edit ? false : data.defaultCollapse);
  const [timelines, setTimelines] = useState<Item[]>([]);

  const lastTimeLine = useMemo(() => {
    return timelines[timelines.length - 1];
  }, [timelines]);

  useEffect(() => {
    if (env.runtime) {
      if (data.dataSource === DataSourceEnum.DYNAMIC) {
        inputs[InputIds.SetDataSource]((ds) => {
          if (!Array.isArray(ds)) {
            logger.error('接收数据需要为数组类型');
          } else {
            const newList = ds
              .map((i) => {
                if (i && typeof i === 'object' && !Array.isArray(i)) {
                  return {
                    ...i,
                    _id: uuid()
                  };
                } else {
                  logger.error('时间节点数据类型为包含title, subtitle, description的对象类型');
                  return null;
                }
              })
              .filter((item) => !!item);
            setTimelines(newList);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (data.dataSource === DataSourceEnum.DYNAMIC) {
      if (env.edit) {
        setTimelines([data.timelines[0]]);
      }
    } else {
      setTimelines(data.timelines);
    }
  }, [data.timelines]);

  const handleOpen = () => {
    setCollapse(false);
  };
  const handleClose = () => {
    if (env.runtime) {
      setCollapse(true);
    }
  };

  const ItemRender = (item, index) => {
    if (data.useContentSlot && slots[SlotIds.Content]) {
      return (
        <div className={classnames(env.edit && slots[SlotIds.Content].size === 0 && css.emptyWrap)}>
          {slots[SlotIds.Content].render({
            inputValues: {
              [InputIds.CurrentDs]: item,
              [InputIds.Index]: index
            },
            key: index
          })}
        </div>
      );
    }
    const { title, subTitle, description } = item || {};
    return (
      <>
        <div>
          <span className={css.title}>{title}</span>
          {subTitle && <span className={css.subTitle}> {subTitle}</span>}
        </div>
        {description && <div className={css.desc}>{description}</div>}
      </>
    );
  };

  return (
    <div className={css.timeline}>
      <div
        className={!collapse || !data.supportCollapse ? css.none : css.center}
        onClick={handleOpen}
      >
        <Badge
          color={lastTimeLine && lastTimeLine.color}
          text={lastTimeLine && lastTimeLine.title}
        />
        <div className={css.openText}>
          <span className={css.marginRight}>展开</span>
          <DownOutlined />
        </div>
      </div>
      <Timeline
        mode={data.mode}
        reverse={data.reverse}
        className={classnames(collapse && data.supportCollapse && css.none)}
      >
        {timelines.map((item: Item, index: number) => {
          const { color, id, _id } = item || {};
          return (
            <Timeline.Item color={color} data-timeline-id={id} key={_id || id}>
              <div
                onClick={() => {
                  if (data.useItemClick && outputs[OutputIds.ItemClick]) {
                    outputs[OutputIds.ItemClick](item);
                  }
                }}
                className={classnames(data.useItemClick && css.click)}
              >
                {ItemRender(item, index)}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <div
        className={classnames(css.closeText, (collapse || !data.supportCollapse) && css.none)}
        onClick={handleClose}
      >
        <span className={css.marginRight}>收起</span>
        <UpOutlined />
      </div>
    </div>
  );
}
