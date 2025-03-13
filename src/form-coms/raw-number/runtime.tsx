import { Popover } from 'antd';
import React, { useLayoutEffect } from 'react';
import { InputIds, ValidateTriggerType } from '../types';
import css from './runtime.less';
export interface Data {
  content: string | undefined;
}

function numberToChineseFormatWithDecimal(num: string = '') {
  const [integer, decimal] = String(num).split('.');
  // 如果是非法数字直接返回
  if (Number.isNaN(Number(num))) {
    return num;
  }

  let units = [
    { name: '亿', unit: 100000000 },
    { name: '万', unit: 10000 },
    { name: '', unit: 1 }
  ];

  let calcNum = Number(integer);
  return (
    units.reduce((prev: string, curr) => {
      // 计算出当前数字是几个对应的unit
      const currentUnit = Number(calcNum) / curr.unit;
      // 只有大于等于1才进行格式化
      if (currentUnit >= 1) {
        // 将当前数字减去对应的“几个unit”便于下个循环计算，如260,000,000在第一次循环会减去2个亿变成60,000,000……
        calcNum -= curr.unit * Math.floor(currentUnit);
        // 拼接字符串
        return prev + Math.floor(currentUnit) + curr.name;
      } else {
        // 如果不大于1直接跳过本次计算
        return prev;
      }
      // 最后再拼接小数部分，按照原型如果这里是.00则不进行展示
    }, '') + (decimal === '00' || !decimal ? '' : '.' + decimal)
  );
}

function formatContent(content: string | undefined) {
  // 如果不是合法的数字则不进行千分位格式化
  if (!content || Number.isNaN(Number(content))) return content;
  return String(content).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  useLayoutEffect(() => {
    inputs[InputIds.SetValue]?.((value: string) => {
      data.content = value;
    });
  }, []);

  return (
    <Popover placement="bottomLeft" content={numberToChineseFormatWithDecimal(data.content)}>
      <span className={css.number}>{formatContent(data.content)}</span>
    </Popover>
  );
}
