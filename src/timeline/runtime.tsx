import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { Timeline, Badge } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { uuid } from '../utils';
import {
  Data,
  DATA_SOURCE_TYPE,
  InputIds,
  Item,
  OutputIds,
  SlotIds
} from './constants';
import css from './runtime.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, slots, logger, outputs } = props;
  const [collapse, setCollapse] = useState(true);

  useEffect(() => {
    if (env.runtime) {
      if (inputs[InputIds.SetDataSource]) {
        inputs[InputIds.SetDataSource]((ds) => {
          if (!Array.isArray(ds)) {
            logger.error('接收数据需要为数组类型');
          } else {
            data.timelines = ds
              .map((i, index) => {
                if (typeof i === 'string') {
                  return { ...data.timelines[index], _id: uuid(), title: i };
                } else if (typeof i === 'object' && typeof i !== null) {
                  return {
                    color: data.timelines[index]?.color,
                    ...i,
                    _id: uuid()
                  };
                } else {
                  logger.error(
                    '时间节点数据类型为string或包含title, subtitle, description的对象类型'
                  );
                  return null;
                }
              })
              .filter((item) => !!item);
          }
        });
      }
    }
  }, []);

  const handleOpen = () => {
    setCollapse(false);
  };
  const handleClose = () => {
    setCollapse(true);
  };

  const lastTimeLine = useMemo(() => {
    return data.timelines[data.timelines.length - 1];
  }, [data.timelines]);

  return (
    <div style={{ width: `${data.width}px` }} className={css.timeline}>
      <div
        className={!collapse || !data.supportCollapse ? css.none : css.center}
        onClick={handleOpen}
      >
        <Badge
          color={lastTimeLine && lastTimeLine.color}
          text={lastTimeLine && env.i18n(lastTimeLine.title)}
        />
        <div className={css.openText}>
          <span className={css.marginRight}>{env.i18n('展开')}</span>
          <DownOutlined />
        </div>
      </div>
      <Timeline
        mode={data.mode}
        reverse={data.reverse}
        className={classnames(collapse && data.supportCollapse && css.none)}
      >
        {data.timelines.map((item: Item, index: number) => {
          const { title, subTitle, color, id, _id, description } = item || {};
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
                <div>
                  <span className={css.title}>{env.i18n(title)}</span>
                  {subTitle && (
                    <span className={css.subTitle}> {env.i18n(subTitle)}</span>
                  )}
                </div>
                {description && (
                  <div className={css.desc}>{env.i18n(description)}</div>
                )}
                {slots &&
                  data.dataSource === DATA_SOURCE_TYPE.DYNAMIC &&
                  slots[SlotIds.Content] &&
                  slots[SlotIds.Content].render({
                    inputs: {
                      slotProps: (fn: Function) => fn(item)
                    }
                  })}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <div
        className={classnames(
          css.closeText,
          (collapse || !data.supportCollapse) && css.none
        )}
        onClick={handleClose}
      >
        <span className={css.marginRight}>{env.i18n('收起')}</span>
        <UpOutlined />
      </div>
    </div>
  );
}
