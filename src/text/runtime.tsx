import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import css from './runtime.less';

import {
  AlignTypeEnum,
  CursorTypeEnum,
  Data,
  InputIds,
  OutputIds,
  WhiteSpaceEnum
} from './constants';

const { Text, Paragraph } = Typography;

export default ({ data, inputs, outputs, env }: RuntimeParams<Data>) => {
  const [dynamicStyle, setDynamicStyle] = useState<CSSProperties>({});
  useEffect(() => {
    inputs[InputIds.SetContent]((value: string) => {
      let res = value;
      if (res != undefined && typeof res !== 'string') {
        res = JSON.stringify(res);
      }
      data.content = res;
    });
    inputs[InputIds.SetStyle] &&
      inputs[InputIds.SetStyle]((value: CSSProperties) => {
        setDynamicStyle(value);
      });
  }, []);

  const onClick = () => {
    if (data.useClick && outputs[OutputIds.Click]) {
      outputs[OutputIds.Click](data.outputContent || data.content || '');
    }
  };

  const legacyConfigStyle = useMemo(() => {
    return data.legacyConfigStyle ?? {};
  }, [data.legacyConfigStyle]);

  //海外的语言包结构
  const TI18nData1 = {
    language: ['ZH', 'EN'],
    textList: [
      {
        key: 'text',
        text: ['文本', 'text']
      },
      {
        key: 'apple',
        text: ['苹果', 'apple']
      }
    ]
  };
  //方舟语言包结构
  const TI18nData2 = {
    textList: [
      {
        id: 'text',
        content: {
          ZH: '文本',
          EN: 'text'
        }
      },
      {
        id: 'apple',
        content: {
          ZH: '苹果',
          EN: 'apple'
        }
      }
    ]
  };

  function transformObject(keyArr, valueArr) {
    var obj = {};
    keyArr.map((v, i) => {
      obj[keyArr[i]] = valueArr[i];
    });
    return obj;
  }

  //海外转换为方舟内到函数
  let translateData = (data) => {
    let newList = data.textList.map((item, index) => {
      const list = transformObject(data.language, item.text);
      return {
        id: item.key,
        content: list
      };
    });
    return {
      textList: newList
    };
  };

  console.log('转换完的语言包', translateData(TI18nData1));

  const i18ntest = (key) => {
    const locale = 'ZH';
    const idList = TI18nData2.textList.map((item) => item.id);

    const num = idList.indexOf(key);
    console.log('num', num);

    const title = TI18nData2.textList[num]['content'][locale];
    return title;
  };

  console.log('i18ntest(apple)', i18ntest('apple'));

  const content = {
    u_WCZjt: {
      id: 'u_WCZjt',
      content: {
        'zh-CN': '你好',
        en: 'hello'
      }
    },
    x_zqWvf: {
      id: 'x_zqWvf',
      content: {
        'zh-CN': '苹果',
        en: 'apple'
      }
    },
    c_zqWvf: {
      id: 'c_zqWvf',
      content: {
        'zh-CN': '再见',
        en: 'byebye'
      }
    }
  };

  const list = ['u_WCZjt', 'c_zqWvf'];
  const i18nLangContentFilter = (content, list) => {
    let newContent = {};
    let contentIdList = Object.keys(content);
    list.forEach((item) => {
      if (contentIdList.indexOf(item) !== -1) {
        newContent[item] = content[item];
      }
    });
    return newContent;
  };

  console.log('i18nLangContentFilter(content,list)', i18nLangContentFilter(content, list));

  return (
    <div style={{ lineHeight: 1 }}>
      {data.isEllipsis && data.ellipsis?.rows > 1 ? (
        <Paragraph
          style={{
            ...dynamicStyle,
            ...legacyConfigStyle,
            wordBreak: 'break-all',
            whiteSpace: WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : void 0
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {env.i18n(data.content || '')}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...dynamicStyle,
            ...data.legacyConfigStyle,
            wordBreak: 'break-all',
            whiteSpace: data.isEllipsis ? WhiteSpaceEnum.NoWrap : WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : void 0
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {env.i18n(data.content || '')}
        </Text>
      )}
    </div>
  );
};
