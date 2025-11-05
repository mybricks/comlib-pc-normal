import { Popover } from 'antd';
import React, { useLayoutEffect, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

export interface Data {
  content: string | undefined;
  placeholderValue?: string;
  addonBefore?: string;
  addonAfter?: string;
  isFormat: boolean;
}

function fomatFloat(num, n = 2) {
  var f = parseFloat(num);
  if (isNaN(f)) {
    return num;
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
  // n 幂
  var s = f.toString();
  var rs = s.indexOf('.');
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  return s;
}

function numberToChineseFormatWithDecimal(num: string = '', isFormat, placeholderValue) {
  // 如果是非法数字直接返回
  if (num === null || num === '' || num === undefined) return placeholderValue || '';
  if (Number.isNaN(Number(num))) {
    return num;
  }

  const [integer, decimal] = (isFormat ? fomatFloat(num) : String(num)).split('.');

  let units = [
    { name: '亿', unit: 100000000 },
    { name: '万', unit: 10000 },
    { name: '', unit: 1 }
  ];

  let calcNum = Number(integer);
  if (calcNum === 0) return '0' + (decimal === '00' || !decimal ? '' : '.' + decimal);
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

function formatContent(
  content: string | undefined,
  isFormat,
  placeholderValue,
  addonBefore,
  addonAfter
) {
  if (content === null || content === '' || content === undefined) return placeholderValue || '';
  // 如果不是合法的数字则不进行千分位格式化
  if (Number.isNaN(Number(content))) return (addonBefore || '') + content + (addonAfter || '');
  return (
    (addonBefore || '') +
    String(isFormat ? fomatFloat(content) : content).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (addonAfter || '')
  );
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, parentSlot } = props;
  const [value, setValue] = useState(data.content);
  const [addonBefore, setAddonBefore] = useState(data.addonBefore || '');
  const [addonAfter, setAddonAfter] = useState(data.addonAfter || '');

  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
      parentSlot,
      inputs,
      outputs,
      configs: {
        setValue(val) {
          setValue(val);
        },
        setInitialValue(val) {
          setValue(val);
        },
        returnValue(output) {
          output(value);
        },
        resetValue() {
          setValue('');
        },
        validate(model, relOutput) {
          validateFormItem({
            value: value,
            env,
            model,
            rules: []
          }).then((r) => {
            relOutput(r);
          });
        }
      }
    },
    [value]
  );

  useLayoutEffect(() => {
    inputs['setAddon']((conf, relOutputs) => {
      if (conf.before) {
        setAddonBefore(conf.before);
      }
      if (conf.after) {
        setAddonAfter(conf.after);
      }
      relOutputs['setAddonDone'](conf);
    });
  }, []);

  return (
    <Popover
      placement="bottomLeft"
      content={`${numberToChineseFormatWithDecimal(value, data.isFormat, data.placeholderValue)}`}
    >
      <span className={css.rawNumber + ' raw-number'}>
        {formatContent(value, data.isFormat, data.placeholderValue, addonBefore, addonAfter)}
      </span>
    </Popover>
  );
}
