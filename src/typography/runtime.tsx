import React, { useEffect, useState } from 'react';
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

const itemRender = ({ data: item, outputs, env }: RuntimeParams<Item>) => {
  let style = defaultStyle;
  if (item.style) {
    style = item.style;
  }
  const itemContent = env.edit
    ? env.i18n(`${item.content}`)
    : item.src === 1
    ? env.i18n(`${item.content}`)
    : '';
  switch (item.type) {
    case 'Text':
      return (
        <span
          key={item.key}
          data-item-type="text"
          data-text-id={item.key}
          style={{
            display: 'inline-block',
            height: 'fit-content',
            maxWidth: '100%',
            paddingLeft: item.stylePadding?.[0] || 0,
            paddingRight: item.stylePadding?.[1] || 0
          }}
        >
          <Text
            style={{
              ...style,
              whiteSpace: 'pre-wrap',
              cursor: item.click ? 'pointer' : 'unset'
            }}
            type={item.textType}
            onClick={() => {
              if (item.click) {
                outputs[item.key](item.outputContent || item.content || '');
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
              if (item.click) {
                outputs[item.key](item.outputContent || '');
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
              outputs[item.key](item.link);
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
          <Text
            style={{
              fontSize: item.fontSize,
              fontWeight: item.fontStyle,
              whiteSpace: 'pre-wrap'
            }}
            type={item.textType}
          >
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
    return <>{data.items.map((item) => itemRender({ ...props, data: item }))}</>;
  };
  return (
    <div className={css.container} style={data.style || {}}>
      {renderItems()}
    </div>
  );
};

const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { inputs, data } = props;
  const [itemList, setItemList] = useState(cloneDeep(data.items));

  useEffect(() => {
    itemList.forEach((item) => {
      inputs[item.key]((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, 'string') || typeCheck(ds, 'number')) {
          item.content = ds;
        } else if (typeCheck(ds, 'object')) {
          const { value, color } = ds;
          item.content = value;
          if (item.style) {
            item.style.color = color;
          } else item.style = { color };
        } else {
          item.content = '';
        }
        setItemList([...itemList]);
      });
      inputs[item.key + '-extend']((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, 'object')) {
          const { value, color } = ds;
          item.content = value;
          if (item.style) {
            item.style.color = color;
          } else item.style = { color };
        } else {
          item.content = '';
        }
        setItemList([...itemList]);
      });

      inputs[`${item.key}-append`]((ds: any) => {
        item.src = 1;
        if (typeCheck(ds, 'string') || typeCheck(ds, 'number')) {
          item.content = item.content === '[外部获取]' ? `${ds}` : `${item.content || ''}${ds}`;
        }
        setItemList([...itemList]);
      });
    });
    // inputs['slotProps'] &&
    //   inputs['slotProps']((content: string | string[]) => {
    //     if (
    //       Array.isArray(content) &&
    //       !content.some((item) => typeof item !== 'string')
    //     ) {
    //       content.forEach((item, idx) => {
    //         if (itemList[idx]) {
    //           itemList[idx].src = 1;
    //           itemList[idx].content = item;
    //         }
    //       });
    //       setItemList([...itemList]);
    //     }
    //     if (typeof content === 'string' && itemList[0]) {
    //       itemList[0].content = content;
    //       itemList[0].src = 1;
    //       setItemList([...itemList]);
    //     }
    //   });
    inputs['append'] &&
      inputs['append']((ds) => {
        if (typeof ds === 'string') {
          itemList.push({
            src: 1,
            key: uuid(),
            type: 'Text',
            content: ds,
            oldcontent: '文本',
            fontSize: 12,
            fontStyle: 'normal',
            stylePadding: [0, 0]
          });
          setItemList([...itemList]);
        }
      });
  }, []);

  const renderItems = () => {
    return <>{itemList.map((item) => itemRender({ ...props, data: item }))}</>;
  };

  return (
    <div className={css.container} style={data.style || {}}>
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
