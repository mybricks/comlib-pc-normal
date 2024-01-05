/**
 * 使用树形选择器完成字段映射
 */
import React, { useCallback, useState } from 'react';
import { Input, TreeSelect, Select, message } from 'antd';
import classnames from 'classnames';
import css from './index.less';
const { Option } = Select;
const typeMap = {
  array: '列表',
  object: '对象',
  number: '数字',
  string: '字符串',
  boolean: '布尔值'
};

export function schema2Options(schema: any = {}, parentKey = '', config: any = {}) {
  const { isRoot = false, noType } = config;
  const { type } = schema;
  const list: any = [];
  if (type !== 'object' && type !== 'array') return;
  const properties = (type === 'object' ? schema.properties : schema.items?.properties) || {};
  Object.keys(properties).forEach((key) => {
    const subSchema = properties[key];
    const item: any = {};
    item.label = key;
    // item.label = noType ? (
    //   key
    // ) : (
    //   <div>
    //     <span className={css.gap}>{key}</span>
    //     <Tag>{typeMap[subSchema.type]}</Tag>
    //   </div>
    // );
    item.value = isRoot ? key : `${parentKey}.${key}`;
    item.type = subSchema.type;
    if (properties[key]?.type === 'object') {
      item.children = schema2Options(properties[key], item.value, { ...config, isRoot: false });
    }
    list.push(item);
  });
  return list;
}

const isUseSelect = (options, val) => {
  // if (Array.isArray(options) && options.length) {
  //   return options.some((item) => {
  //     if (item.value === val) {
  //       return true;
  //     }
  //     return isUseSelect(item.children, val);
  //   });
  // } else {
  //   return false;
  // }
  return false;
};
export default function Tree({ editConfig }: any) {
  const { value, schema = {}, placeholder, disabled } = editConfig.value.get() || {};
  const options = schema2Options(schema, '', { isRoot: true, useArray: false });
  const [useTreeSelect, setUseTreeSelect] = useState(isUseSelect(options, value));

  const onChange = useCallback((val) => {
    if (val === '') {
      message.warn(`字段不能为空！`);
      editConfig.value.set(value);
      return;
    }
    if (value !== val) {
      editConfig.value.set(val);
    }
  }, []);
  const isSelect = useTreeSelect && !!options?.length;

  return (
    <div className={classnames(css.wrap, 'fangzhou-theme')}>
      <Input.Group compact>
        <Select
          size="small"
          onChange={(val) => setUseTreeSelect(val === 'select')}
          style={{ width: '65px' }}
          defaultValue={isSelect ? 'select' : 'input'}
        >
          <Option value="input">输入</Option>
          <Option value="select">选择</Option>
        </Select>
        {isSelect ? (
          <TreeSelect
            defaultValue={value}
            treeData={options}
            size="small"
            onChange={onChange}
            showSearch
            treeDefaultExpandAll
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: 'calc(100% - 65px)'
            }}
          />
        ) : (
          <Input
            defaultValue={value}
            onBlur={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            size="small"
            style={{
              width: 'calc(100% - 65px)'
            }}
          />
        )}
      </Input.Group>
    </div>
  );
}
