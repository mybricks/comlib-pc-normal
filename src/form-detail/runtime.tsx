import React, { useEffect } from 'react';
import { Descriptions, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Data, InputIds, ScopeSlotIds, TypeEnum } from './constants';
import css from './runtime.less';
import { isObject } from 'lodash';
import { checkIfMobile } from '../utils';

const { Text } = Typography;

export default function ({ env, data, inputs, slots, outputs, onError }: RuntimeParams<Data>) {
  const { size, title, showTitle, layout, bordered, colon, showExtra } = data || {};
  const isMobile = checkIfMobile(env);
  const column = isMobile ? data.mobileColumn : data.column;
  // 后置操作渲染
  const SuffixRender = (props) => {
    const { type, id, value, useSuffix, suffixBtnText = '查看更多' } = props;
    const outputId = `${id}-suffixClick`;
    if (useSuffix && type === TypeEnum.Text) {
      const record = data.items.reduce((pre, cur) => ({ ...pre, [cur.key]: cur.value }), {});
      return (
        <a
          className={css.suffixBtn}
          onClick={() => {
            env.runtime &&
              outputs[outputId] &&
              outputs[outputId]({
                value,
                record
              });
          }}
        >
          {env.i18n(suffixBtnText)}
        </a>
      );
    }
    return null;
  };

  const renderItems = () => {
    return (data.items || [])
      .filter((item) => item.visible !== false)
      .map((item) => {
        const {
          id,
          value,
          type = TypeEnum.Text,
          span,
          label,
          slotId = '',
          rows = 1,
          ellipsis,
          showLabel = true,
          labelDesc
        } = item || {};
        const SlotItem =
          type === TypeEnum.AllSlot || type === TypeEnum.PartSlot
            ? slots[slotId]?.render({
                inputValues: {
                  [InputIds.CurDs]: value,
                  [InputIds.DataSource]: data.items.reduce(
                    (pre, cur) => ({ ...pre, [cur.key]: cur.value }),
                    {}
                  )
                },
                key: slotId
              })
            : null;
        if (type === TypeEnum.AllSlot) {
          return (
            <Descriptions.Item label={null} key={id} span={span} className={`${id}-item`}>
              {SlotItem}
            </Descriptions.Item>
          );
        }

        let labelNode = env.i18n(label);

        if (showLabel) {
          if (!!labelDesc) {
            labelNode = (
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ marginRight: 5 }}>{labelNode}</span>
                <Tooltip title={env.i18n(labelDesc)}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            );
          }
          if (!label) labelNode = null;
        } else {
          labelNode = null;
        }
        return (
          <Descriptions.Item label={labelNode} key={id} span={span} className={`${id}-item`}>
            {type === TypeEnum.PartSlot ? (
              SlotItem
            ) : (
              <Text
                style={{ color: 'inherit' }}
                ellipsis={ellipsis ? { rows, tooltip: true } : false}
              >
                {env.i18n(value)}
              </Text>
            )}
            {SuffixRender(item)}
          </Descriptions.Item>
        );
      });
  };

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetDataSource] &&
        inputs[InputIds.SetDataSource]((ds: Record<string, any>, relOutputs) => {
          if (!isObject(ds)) {
            onError('参数必须是json');
            return;
          }
          for (const [key, value] of Object.entries(ds)) {
            const item = data.items.find(({ key: itemKey }) => key === itemKey);
            if (item) {
              item.value = value;
            }
          }
          relOutputs['setDataSourceComplete']();
        });
      inputs[InputIds.SetTitle] &&
        inputs[InputIds.SetTitle]((t: string, relOutputs) => {
          data.title = t;
          relOutputs['setTitleComplete']();
        });

      inputs[InputIds.SetDataDesc] &&
        inputs[InputIds.SetDataDesc]((desc, relOutputs) => {
          if (!isObject(desc)) {
            onError('参数必须是json');
            return;
          }
          for (const [key, value] of Object.entries(desc)) {
            const item = data.items.find(({ key: itemKey }) => key === itemKey);
            if (item) {
              Object.assign(item, value);
            }
          }
          relOutputs['setDataDescComplete']();
        });
    }
  }, [data]);

  const extraRender = showExtra ? (
    <div className={css.emptyWrap}> {slots[ScopeSlotIds.UpperRightArea].render()}</div>
  ) : (
    void 0
  );

  return (
    <Descriptions
      title={showTitle ? env.i18n(title) : undefined}
      size={isMobile ? 'small' : size}
      layout={layout}
      column={column}
      bordered={bordered}
      colon={colon}
      className={css.des}
      extra={extraRender}
    >
      {renderItems()}
    </Descriptions>
  );
}
