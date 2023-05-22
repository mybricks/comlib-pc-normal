import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Descriptions, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { uuid } from '../utils';
import { Data, InputIds, Item, TypeEnum } from './constants';
import css from './runtime.less';

export default function ({ env, data, inputs, slots, outputs }: RuntimeParams<Data>) {
  const {
    size,
    title,
    showTitle,
    layout,
    column,
    bordered,
    colon,
    globalLabelStyle = {},
    autoWidth
  } = data || {};
  const [rawData, setData] = useState({});
  const rawDataRef = useRef({});
  rawDataRef.current = rawData;

  const contentMap = {
    text: (value, lineLimit, widthLimit, limit) => {
      const multiLine = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: widthLimit,
        display: '-webkit-box',
        WebkitLineClamp: lineLimit,
        WebkitBoxOrient: 'vertical',
        wordWrap: 'break-word',
        wordBreak: 'normal'
      };
      const singleLine = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: widthLimit,
        border: 'none'
      };
      const customStyle = lineLimit === 1 ? singleLine : multiLine;
      return limit ? (
        <MassiveValue value={env.i18n(value)} customStyle={customStyle} limit={limit} />
      ) : (
        <div className={css.pre} style={widthLimit ? { width: widthLimit } : {}}>
          {env.i18n(value)}
        </div>
      );
    }
  };
  const getDataSource = useCallback(() => {
    const res: Item[] = [];
    let ds = rawDataRef.current || {};
    (data.items || []).forEach((item) => {
      const labelStyle = {
        ...item.labelStyle,
        marginLeft: item.stylePadding ? item.stylePadding[0] : 0
      };
      const contentStyle = {
        ...item.contentStyle,
        color: item.color || item.contentStyle?.color,
        marginTop: item.stylePadding ? item.stylePadding[1] : 0
      };
      const itemStyle = {
        paddingLeft: Array.isArray(item.padding) ? item.padding[0] : 0,
        paddingRight: Array.isArray(item.padding) ? item.padding[1] : 0,
        paddingTop: Array.isArray(item.padding) ? item.padding[2] : 0,
        paddingBottom: Array.isArray(item.padding) ? item.padding[3] : 16
      };

      res.push({
        ...item,
        value: ds[item.key] === void 0 ? item.value : ds[item.key],
        labelStyle,
        contentStyle,
        itemStyle
      });
    });
    return res;
  }, []);

  const setDataSource = useCallback((ds: any) => {
    setData(ds);
  }, []);

  // 后置操作渲染
  const SuffixRender = (props) => {
    const { type, id, value, useSuffix, suffixBtnText = '查看更多' } = props;
    const outputId = `${id}-suffixClick`;
    if (useSuffix && type === TypeEnum.Text) {
      const record = {
        ...rawDataRef.current
      };
      getDataSource().forEach((item) => {
        record[item.key] = item.value;
      });
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
  const RenderItems = () => {
    if (!data.items?.length) return null;

    return (
      <Descriptions
        title={showTitle ? env.i18n(title) : undefined}
        size={size}
        layout={layout}
        column={column}
        bordered={bordered}
        colon={colon}
        className={css.des}
        labelStyle={{
          ...globalLabelStyle,
          width: autoWidth ? 'unset' : globalLabelStyle.width ?? 65
        }}
      >
        {getDataSource().map((item) => {
          const {
            id,
            value,
            type,
            span,
            label,
            labelStyle,
            contentStyle,
            itemStyle,
            slotId = '',
            lineLimit,
            widthLimit,
            limit,
            showLable = true,
            labelDesc
          } = item || {};
          const SlotItem =
            type === TypeEnum.AllSlot || type === TypeEnum.PartSlot
              ? slots[slotId]?.render({
                  inputValues: {
                    [InputIds.CurDs]: value,
                    [InputIds.DataSource]: rawDataRef.current
                  },
                  key: slotId
                })
              : null;
          if (type === TypeEnum.AllSlot) {
            return (
              <Descriptions.Item label={''} key={id} span={span}>
                {SlotItem}
              </Descriptions.Item>
            );
          }

          let labelNode = env.i18n(label);
          if (showLable) {
            if (!!labelDesc) {
              labelNode = (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 5 }}>{labelNode}</span>
                  <Tooltip title={labelDesc}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              );
            }
          } else {
            labelNode = null;
          }
          return (
            <Descriptions.Item
              label={labelNode}
              key={id}
              span={span}
              labelStyle={labelStyle}
              contentStyle={contentStyle}
              style={itemStyle}
            >
              {type === TypeEnum.PartSlot
                ? SlotItem
                : contentMap[type](value, lineLimit, `${widthLimit}px`, limit)}
              {SuffixRender(item)}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  };

  useLayoutEffect(() => {
    if (env.edit && data.items?.length === 0) {
      data.items.push({
        id: uuid(),
        label: '描述项1',
        showLable: true,
        key: 'field1',
        value: 'field1',
        span: 1,
        labelStyle: {
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 1,
          color: '#8c8c8c',
          letterSpacing: 0
        },
        contentStyle: {
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 1,
          color: '#333333',
          letterSpacing: 0
        },
        padding: [0, 0],
        type: TypeEnum.Text,
        direction: 'horizontal',
        useSuffix: false,
        suffixBtnText: '查看更多',
        schema: {
          type: 'string'
        },
        labelDesc: ''
      });
    }
  }, [data]);

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetDataSource] && inputs[InputIds.SetDataSource](setDataSource);
      inputs[InputIds.SetTitle] &&
        inputs[InputIds.SetTitle]((t: string) => {
          data.title = t;
        });
    }
  }, [data]);

  return (
    <div>
      <RenderItems />
    </div>
  );
}
function MassiveValue({ value, customStyle, limit }) {
  const parentEle = useRef<HTMLDivElement>(null);
  return (
    <div ref={parentEle} style={customStyle}>
      {limit ? (
        <Tooltip title={value} overlayClassName={css.ellipsisTooltip} color="#fff">
          <div className={css.pre}>{value}</div>
        </Tooltip>
      ) : (
        <div className={css.pre}>{value}</div>
      )}
    </div>
  );
}
