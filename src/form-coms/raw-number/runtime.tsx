import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Popover, Typography } from 'antd';
import css from './runtime.less';

import {
  AlignTypeEnum,
  CursorTypeEnum,
  Data,
  InputIds,
  OutputIds,
  WhiteSpaceEnum
} from './constants';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

function numberToChineseFormat(num) {
  // 定义单位
  const units = ['', '万', '亿', '兆'];
  // 定义数字到中文的映射
  const chineseDigits = '零一二三四五六七八九';
 
  // 处理小数部分，这里我们只保留整数部分，所以小数部分直接返回空字符串
  // 如果需要处理小数部分，可以在这里添加逻辑
  let [integerPart, decimalPart] = num.toString().split('.');
  decimalPart = ''; // 忽略小数部分
 
  // 将整数部分转换为字符串并反转，方便从低位到高位处理
  let integerStr = integerPart.split('').reverse().join('');
  let result = '';
  let zeroCount = 0; // 连续零的计数
 
  // 遍历整数部分的每一位数字
  for (let i = 0; i < integerStr.length; i++) {
    let digit = parseInt(integerStr[i]);
    let position = Math.floor(i / 4); // 每4位一个单位（个、万、亿...）
 
    if (digit === 0) {
      zeroCount++;
    } else {
      // 如果前面有连续的零，并且不是单位的开头（即不是亿、万等单位的直接前面），则添加“零”
      if (zeroCount > 0 && i % 4 !== 0) {
        result += chineseDigits[0];
      }
      zeroCount = 0; // 重置连续零的计数
      result += chineseDigits[digit] + units[position];
    }
 
    // 如果是单位的最后一位（即4的倍数位），并且不是零，则添加单位但不添加额外的零
    if (i % 4 === 3 && digit !== 0) {
      result += units[position];
    }
  }
 
  // 去除结果末尾可能多余的单位（如“零万”、“零亿”等）
  result = result.replace(/零[万亿兆]$/, '');
  // 去除结果开头的“零”
  result = result.replace(/^零+/, '');
  // 如果整个结果是“零”（即输入为0），则特殊处理
  if (result === '') {
    result = chineseDigits[0];
  }
 
  // 添加小数部分（如果需要的话，这里我们省略了小数部分）
  // result += '.' + (decimalPart ? decimalPartToChinese(decimalPart) : '');
 
  return result;
}
export default ({ data, inputs, outputs, env }: RuntimeParams<Data>) => {
  const [dynamicStyle, setDynamicStyle] = useState<CSSProperties>({});
  useEffect(() => {
    inputs[InputIds.SetContent]((value: string, relOutputs) => {
      let res = value;
      if (res != undefined && typeof res !== 'string') {
        res = JSON.stringify(res);
      }
      data.content = res;
      if (relOutputs['setContentDone']) {
        relOutputs['setContentDone'](res);
      }
    });
    inputs[InputIds.SetStyle] &&
      inputs[InputIds.SetStyle]((value: CSSProperties, relOutputs) => {
        setDynamicStyle(value);
        relOutputs[`${InputIds.SetStyle}Done`](value);
      });
  }, []);

  const onClick = () => {
    if (outputs[OutputIds.Click]) {
      outputs[OutputIds.Click](data.outputContent || data.content || '');
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.title}>
        {data.title}
        {
          data.tips ? (
          <div className={css.tips}>
            <Popover placement="right" content={data.tips}>
              <QuestionCircleOutlined/>
            </Popover>
          </div>) : null
        }
      </div>
      <div className={css.content}>
      {
        data.contentType === 'text' ? data.content : null
      }
      {
        data.contentType === 'number' ? (
          <Popover placement="bottomLeft" content={numberToChineseFormat(data.content)}>
            <span className={css.number}>{String(data.content).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </Popover>
        ) : null
      }
      </div>
    </div>
  );
};
