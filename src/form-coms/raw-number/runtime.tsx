import { Form, Input, InputProps, Popover } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { validateFormItem, RuleKeys } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import css from './runtime.less';
export interface Data {
  content: number | undefined;
}

function numberToChineseFormatWithDecimal(num, decimalPlaces = 2) {
  // 定义单位
  const units = ['', '万', '亿', '兆'];

  // 分离整数部分和小数部分
  const [integerStr, decimalStr] = num.toFixed(decimalPlaces).split('.');
  const integer = parseInt(integerStr, 10);
  const decimal = parseFloat(`0.${decimalStr}`);

  let result = '';
  let unitIndex = 0;
  let tempNum = integer;
  let lastPartHadValue = false; // 标记上一部分是否有值

  // 处理整数部分
  while (tempNum > 0) {
      const part = tempNum % 10000;
      if (part > 0) {
          lastPartHadValue = true;
      }
      if (lastPartHadValue || part > 0) {
          result = `${part}${units[unitIndex]}${result}`;
      }
      tempNum = Math.floor(tempNum / 10000);
      unitIndex++;
  }

  // 移除结果末尾多余的'万'或'亿'（如果整数部分为0）
  if (result === '0万' || result === '0亿' || result === '0兆') {
      result = '0';
  } else {
      // 移除整数部分末尾不必要的'0万'或'0亿'（例如10000 -> 1，而不是10000万）
      result = result.replace(/0万$/, '').replace(/0亿$/, '').replace(/0兆$/, '');
  }

  // 处理小数部分并合并结果
  const decimalResult = decimal.toFixed(decimalPlaces).slice(1); // 去掉开头的'0.'
  return `${result === '0' && decimalResult !== '00' ? '' : result}${decimalResult === '00' ? '' : `.${decimalResult}`}`;
}

export default function ({
  env,
  data,
  _inputs,
  inputs,
  _outputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {


  return (
    <Popover placement="bottomLeft" content={numberToChineseFormatWithDecimal(data.content)}>
      <span className={css.number}>{String(data.content).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
    </Popover>
  );
}
