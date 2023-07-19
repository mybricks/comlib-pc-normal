import React, { useEffect, useMemo, useState, CSSProperties } from 'react';
import { Typography, Tag } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { Data, Item } from './constants';
import { uuid, typeCheck } from '../utils';
import css from './runtime.less';

const { Text, Link } = Typography;

const defaultStyle: {
  [prop: string]: any;
} = {
  fontWeight: 'normal',
  fontSize: 12,
  letterSpacing: 0,
  lineHeight: 1,
  color: '#000000'
};

const itemRender = ({
  data: item,
  outputs,
  env,
  isSet,
  isUnity,
  padding,
  allData,
  dynamicStyle
}) => {
  let style = defaultStyle;
  if (item.style) {
    style = item.style;
  }
  const itemContent = env.edit
    ? env.i18n(`${item.content}`)
    : item.src === 1
    ? env.i18n(`${item.content}`)
    : '';
  //文本、链接等点击事件
  const textClick = () => {
    if (item.click && !isSet && env.runtime) {
      outputs[item.key](item.outputContent || item.content || '');
    }
    if (env.runtime) {
      outputs['click']({
        key: item.key,
        content: item.content || '',
        type: item.type,
        link: item.link || ''
      });
      if (isSet) {
        let newData = [...allData.itemList];
        allData.itemList = newData.map((item) => {
          if (item.active) {
            item.active = false;
          }
          return item;
        });
        item.active = true;
      }
    }
  };
  const doubleClick = () => {
    if (env.runtime) {
      if (isSet) {
        item.active = false;
      }
    }
  };
  const paddingStyle = {
    paddingLeft:
      !isUnity || (isSet && item.stylePadding?.[0]) ? item.stylePadding?.[0] || 0 : padding[0],
    paddingRight:
      !isUnity || (isSet && item.stylePadding?.[1]) ? item.stylePadding?.[1] || 0 : padding[1]
  };
  //1、统一处理时样式，颜色从根节点（container）注入，所以去除子节点颜色配置
  //2、动态设置颜色且该子项被激活时，设置动态颜色
  const fontStyle = {
    color: isUnity
      ? isSet && dynamicStyle.color && item.active
        ? dynamicStyle.color
        : 'unset'
      : isSet && dynamicStyle.color && item.active
      ? dynamicStyle.color
      : void 0,
    fontSize: isUnity
      ? isSet && dynamicStyle.fontSize && item.active
        ? dynamicStyle.fontSize
        : 'unset'
      : isSet && dynamicStyle.fontSize && item.active
      ? dynamicStyle.fontSize
      : void 0,
    fontWeight: isUnity
      ? isSet && dynamicStyle.fontWeight && item.active
        ? dynamicStyle.fontWeight
        : 'unset'
      : isSet && dynamicStyle.fontWeight && item.active
      ? dynamicStyle.fontWeight
      : void 0
  };
  if (!itemContent) return null;
  switch (item.type) {
    case 'Text':
      return (
        <span
          key={item.key}
          data-item-type="text"
          data-text-id={item.key}
          style={{
            // display: 'inline-block',
            height: 'fit-content',
            maxWidth: '100%',
            ...paddingStyle
          }}
          onDoubleClick={doubleClick}
        >
          <Text
            style={{ cursor: item.click || isSet ? 'pointer' : 'unset', ...fontStyle }}
            className={!isUnity ? `${item.key} ${css.text} text` : void 0}
            type={item.textType}
            onClick={textClick}
          >
            {itemContent}
          </Text>
        </span>
      );
    case 'Tag':
      return (
        <span
          key={item.key}
          data-item-type="tag"
          data-tag-id={item.key}
          style={{
            height: 'fit-content',
            ...paddingStyle
          }}
        >
          <Tag
            onClick={textClick}
            onDoubleClick={doubleClick}
            color={item.color}
            style={{
              margin: 0,
              cursor: item.click ? 'pointer' : 'unset'
            }}
          >
            {itemContent}
          </Tag>
        </span>
      );
    case 'Link':
      return (
        <span
          key={item.key}
          data-item-type="link"
          data-link-id={item.key}
          style={{
            // display: 'inline-block',
            height: 'fit-content',
            maxWidth: '100%',
            ...paddingStyle
          }}
        >
          <Link
            style={{
              // fontSize: item.fontSize,
              // fontWeight: item.fontStyle,
              ...fontStyle,
              color: isSet && dynamicStyle.color && item.active ? dynamicStyle.color : void 0
            }}
            onClick={textClick}
            onDoubleClick={doubleClick}
          >
            {itemContent}
          </Link>
        </span>
      );
    default:
      return (
        <span
          key={item.key}
          data-item-type="text"
          data-text-id={item.key}
          style={{ height: 'fit-content' }}
        >
          <Text className={`${item.key} ${css.text} text`} type={item.textType}>
            {itemContent}
          </Text>
        </span>
      );
  }
};

const EditRender = (props: RuntimeParams<Data>) => {
  const { data } = props;
  const renderItems = () => {
    if (!data.items || data.items.length === 0) {
      return <p className={css.suggestion}>在编辑栏中点击"添加文本"</p>;
    }
    return (
      <>
        {data.items.map((item) =>
          itemRender({
            ...props,
            data: item,
            isSet: false,
            isUnity: data.isUnity,
            padding: data.padding,
            allData: data,
            dynamicStyle: {}
          })
        )}
      </>
    );
  };
  return (
    <div
      className={`${css.container} container`}
      style={{
        textAlign: data.style.textAlign,
        fontSize: !data.isUnity ? 'unset' : void 0,
        lineHeight: !data.isUnity ? 'unset' : void 0
      }}
    >
      {renderItems()}
    </div>
  );
};

const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { inputs, data, env } = props;
  const [isSet, setIsSet] = useState<boolean>(false);
  const [dynamicStyle, setDynamicStyle] = useState<CSSProperties>({});

  useMemo(() => {
    // TODO remove cloneDeep?
    data.itemList = cloneDeep(data.items);
  }, []);

  useEffect(() => {
    if (env.runtime && inputs['setData']) {
      inputs['setData']((val) => {
        if (Array.isArray(val.textList) && val.textList) {
          const rowKey = 'key';
          let newVal = val.textList.map((item) => {
            let newItem = {
              ...item,
              src: 1,
              [rowKey]: data.rowKey === '' ? uuid() : item[data.rowKey] || uuid()
            };
            if (!item.type) {
              newItem = { ...newItem, type: 'Text' };
            }
            return newItem;
          });
          setIsSet(true);
          data.itemList = newVal;
        }
        //用户自定义样式
        if (val.style) {
          setDynamicStyle(val.style);
        }
      });
    }
  }, []);

  useEffect(() => {
    data.itemList.forEach((item) => {
      inputs[item.key]((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, ['string', 'number'])) {
          item.content = ds;
        } else {
          item.content = '';
        }
      });
      inputs[item.key + '-extend']((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, 'object')) {
          const { value, color } = ds;
          if (typeCheck(value, ['string', 'number'])) {
            item.content = value;
          } else {
            item.content = '';
          }
          switch (item.type) {
            case 'Tag':
              item.color = color;
              break;
            default:
              if (item.style) {
                item.style.color = color;
              } else {
                item.style = { color };
              }
          }
        } else {
          item.content = '';
        }
      });

      inputs[`${item.key}-append`]((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, ['string', 'number'])) {
          item.content = item.content === '[外部获取]' ? `${ds}` : `${item.content || ''}${ds}`;
        }
      });
    });
    inputs['append'] &&
      inputs['append']((ds) => {
        if (typeof ds === 'string') {
          data.itemList.push({
            src: 1,
            key: uuid(),
            type: 'Text',
            content: ds,
            oldcontent: '文本',
            fontSize: 12,
            fontStyle: 'normal',
            stylePadding: [0, 0]
          });
        }
      });
  }, []);

  const renderItems = () => {
    return (
      <>
        {data.itemList.map((item) =>
          itemRender({
            ...props,
            data: item,
            isSet: isSet,
            isUnity: data.isUnity,
            padding: data.padding,
            allData: data,
            dynamicStyle: dynamicStyle
          })
        )}
      </>
    );
  };

  return (
    <div
      className={`${css.container} container`}
      style={{
        textAlign: data.style.textAlign,
        fontSize: !data.isUnity ? 'unset' : void 0,
        lineHeight: !data.isUnity ? 'unset' : void 0
      }}
      data-root="root"
    >
      {renderItems()}
    </div>
  );
};
export default function (props: RuntimeParams<Data>) {
  const { env } = props;
  if (env.edit) {
    return EditRender(props);
  }
  return RuntimeRender(props);
}
