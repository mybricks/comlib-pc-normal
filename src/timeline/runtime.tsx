import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Timeline, Badge } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { uuid } from '../utils';
import { Data, InputIds, Item, OutputIds, SlotIds } from './constants';
import css from './runtime.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, slots, logger, outputs } = props;
  const [collapse, setCollapse] = useState(env.edit ? false : data.defaultCollapse);
  const [timelines, setTimelines] = useState<Item[]>([]);

  useEffect(() => {
    if (env.runtime) {
      if (data.isDynamic) {
        inputs[InputIds.SetDataSource]((ds, relOutputs) => {
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
            relOutputs[OutputIds.SetDataSourceComplete]()
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (data.isDynamic) {
      if (env.edit) {
        setTimelines([data.timelines[0]]);
      }
    } else {
      setTimelines(data.timelines);
    }
  }, [data.timelines]);

  const ItemRender = (item, index) => {
    if (data.useContentSlot && slots[SlotIds.Content]) {
      return slots[SlotIds.Content].render({
        inputValues: {
          [InputIds.CurrentDs]: item,
          [InputIds.Index]: index
        },
        key: index
      });
    }
    const { title, subTitle, description } = item || {};
    return (
      <>
        <div>
          <span data-type="title" className={css.title}>
            {env.i18n(title)}
          </span>
          {subTitle && (
            <span data-type="subTitle" className={css.subTitle}>
              {' '}
              {env.i18n(subTitle)}
            </span>
          )}
        </div>
        {description && (
          <div data-type="desc" className={css.desc}>
            {env.i18n(description)}
          </div>
        )}
      </>
    );
  };

  const handleToggle = () => {
    setCollapse((pre) => !pre);
  };

  const CollapseRender = () => {
    return data.supportCollapse ? (
      <div onClick={handleToggle} className={css.center}>
        {collapse ? (
          <Badge count={data.timelines.length} size="small" showZero className={css.marginRight}>
            <span>展开</span>
          </Badge>
        ) : (
          <span className={css.marginRight}>收起</span>
        )}
        {collapse ? <DownOutlined /> : <UpOutlined />}
      </div>
    ) : null;
  };

  return (
    <div className={css.wrap} style={env.edit ? { minHeight: 56 } : {}}>
      <Timeline
        mode={data.mode}
        reverse={data.reverse}
        className={classnames(css.timeline, { [css.none]: collapse && data.supportCollapse })}
      >
        {timelines.map((item: Item, index: number) => {
          const { color, id, _id } = item || {};
          return (
            <Timeline.Item
              className={css['timeline-item']}
              data-timeline-id={id}
              key={_id || id}
              color={color}
            >
              <div
                onClick={() => {
                  outputs[OutputIds.ItemClick](item);
                }}
                className={css.click}
              >
                {ItemRender(item, index)}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
      {CollapseRender()}
    </div>
  );
}
