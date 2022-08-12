/**
 * 使用树形选择器完成字段映射
 */

import React, { useState } from 'react';
import { TreeSelect, Tag, Input } from 'antd';
import css from './index.less';

const typeMap = {
  array: '列表',
  object: '对象',
  number: '数字',
  string: '字符串',
  boolean: '布尔值'
};

function schema2Tree(schema: any = {}, parentKey = '', list: any = [], config: any = {}) {
  const { isRoot = false, useArray = true } = config;
  const { type } = schema;
  if (type !== 'object' && type !== 'array') return;
  const properties = type === 'object' ? schema.properties : schema.items.properties;
  Object.keys(properties).forEach((key) => {
    const subSchema = properties[key];
    const item: any = {};
    item.title = (
      <div>
        <span className={css.gap}>{key}</span>
        <Tag>{typeMap[subSchema.type]}</Tag>
      </div>
    );
    item.value = isRoot ? key : `${parentKey}.${key}`;
    item.type = subSchema.type;
    list.push(item);
    if (subSchema.type === 'object') {
      item.children = [];
      schema2Tree(subSchema, isRoot ? key : `${parentKey}.${key}`, item.children);
    }
    if (subSchema.type === 'array' && useArray) {
      item.children = [];
      schema2Tree(subSchema.items, isRoot ? key : `${parentKey}.${key}`, item.children, {
        useArray: false
      });
    }
  });
}

export default function Tree({ editConfig }: any) {
  const { value } = editConfig;
  const { field, schema = {} } = value.get();
  const [selectedField, setField] = useState(field);
  const list = [];
  schema2Tree(schema, '', list, { isRoot: true, useArray: false });

  const onChange = (fieldName: string) => {
    setField(fieldName);
    value.set(fieldName);
  };

  const onInputChange = (e) => {
    value.set(e.target.value);
  };

  if (Object.keys(schema).length === 0) {
    return <Input defaultValue={field} onChange={onInputChange} />;
  }

  return (
    <TreeSelect
      onChange={onChange}
      allowClear
      value={selectedField}
      treeData={list}
      style={{ width: '100%' }}
      treeDefaultExpandAll
      treeLine={{ showLeafIcon: false }}
    />
  );
}
