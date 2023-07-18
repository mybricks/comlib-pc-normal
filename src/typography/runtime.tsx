import React, { useEffect, useMemo, useState } from 'react';
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

const itemRender = ({ data: item, outputs, env, isSet, isUnity }) => {
  let style = defaultStyle;
  if (item.style) {
    style = item.style;
  }
  const itemContent = env.edit
    ? env.i18n(`${item.content}`)
    : item.src === 1
    ? env.i18n(`${item.content}`)
    : '';
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
            paddingLeft: item.stylePadding?.[0] || 0,
            paddingRight: item.stylePadding?.[1] || 0
          }}
        >
          <Text
            style={{ cursor: item.click ? 'pointer' : 'unset', color: isUnity ? 'unset' : void 0 }}
            className={!isUnity ? `${item.key} ${css.text} text` : void 0}
            type={item.textType}
            onClick={() => {
              if (item.click && !isSet && env.runtime) {
                outputs[item.key](item.outputContent || item.content || '');
              }
              if (env.runtime) {
                outputs['click']({
                  key: item.key,
                  content: item.content || '',
                  type: item.type
                });
              }
            }}
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
            paddingLeft: item.stylePadding?.[0] || 0,
            paddingRight: item.stylePadding?.[1] || 0
          }}
        >
          <Tag
            onClick={() => {
              if (item.click && !isSet && env.runtime) {
                outputs[item.key](item.outputContent || '');
              }
              if (env.runtime) {
                outputs['click']({
                  key: item.key,
                  content: item.content || '',
                  type: item.type
                });
              }
            }}
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
          style={{ height: 'fit-content' }}
        >
          <Link
            style={{ fontSize: item.fontSize, fontWeight: item.fontStyle }}
            onClick={() => {
              if (!isSet && item.key) {
                outputs[item.key](item.link);
              }
              if (env.runtime) {
                outputs['click']({
                  key: item.key,
                  content: item.content || '',
                  type: item.type,
                  link: item.link || ''
                });
              }
            }}
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
          itemRender({ ...props, data: item, isSet: false, isUnity: data.isUnity })
        )}
      </>
    );
  };
  return (
    <div
      className={`${css.container} container`}
      style={{ textAlign: data.style.textAlign, fontSize: !data.isUnity ? 'unset' : void 0 }}
    >
      {renderItems()}
    </div>
  );
};

const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { inputs, data, env } = props;
  const [isSet, setIsSet] = useState<boolean>(false);

  useMemo(() => {
    // TODO remove cloneDeep?
    data.itemList = cloneDeep(data.items);
  }, []);

  useEffect(() => {
    if (env.runtime && inputs['setData']) {
      inputs['setData']((val) => {
        if (Array.isArray(val)) {
          let newVal = val.map((item) => {
            let newItem = { ...item, src: 1 };
            if (!item.key) {
              newItem = { ...newItem, key: uuid() };
            }
            if (!item.type) {
              newItem = { ...newItem, type: 'Text' };
            }
            return newItem;
          });

          setIsSet(true);
          data.itemList = newVal;
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
          itemRender({ ...props, data: item, isSet: isSet, isUnity: data.isUnity })
        )}
      </>
    );
  };

  return (
    <div
      className={css.container}
      style={{ textAlign: data.style.textAlign, fontSize: !data.isUnity ? 'unset' : void 0 }}
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
