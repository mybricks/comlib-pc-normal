/**
 * 使用树形选择器完成字段映射
 */

import React, { useCallback } from 'react';
import { Tag, Input, AutoComplete } from 'antd';
import css from './index.less';

const typeMap = {
  array: '列表',
  object: '对象',
  number: '数字',
  string: '字符串',
  boolean: '布尔值'
};

function schema2Options(schema: any = {}, parentKey = '', config: any = {}) {
  const { isRoot = false } = config;
  const { type } = schema;
  const list: any = [];
  if (type !== 'object' && type !== 'array') return;
  const properties = type === 'object' ? schema.properties : schema.items.properties;
  Object.keys(properties).forEach((key) => {
    const subSchema = properties[key];
    const item: any = {};
    item.label = (
      <div>
        <span className={css.gap}>{key}</span>
        <Tag>{typeMap[subSchema.type]}</Tag>
      </div>
    );
    item.value = isRoot ? key : `${parentKey}.${key}`;
    item.type = subSchema.type;
    list.push(item);
  });
  return list;
}

export default function Tree({ editConfig }: any) {
  const { value } = editConfig;
  const { field, schema = {} } = value.get();

  const options = schema2Options(schema, '', { isRoot: true, useArray: false });

  const onBlur = useCallback((e) => {
    if (field !== e.target.value) {
      value.set(e.target.value);
    }
  }, []);

  return (
    <AutoComplete
      defaultValue={field}
      className={css.auto}
      options={options}
      onBlur={onBlur}
    >
      <Input className={css.input} defaultValue={field} />
    </AutoComplete>
  );
}
