import React, { useEffect, useState } from 'react';
import { AutoComplete, Select } from 'antd';

export default function DomainFieldEditor({ editConfig }) {
  const { value, options } = editConfig;
  const { domainModel } = options;

  const entity = domainModel?.entity || { fieldAry: [] };

  const getFieldOptions = () => {
    const systemFileds: any = {
      label: '系统字段',
      options: []
    };

    const normalFileds: any = {
      label: '普通字段',
      options: []
    };

    const options: any = [];

    entity?.fieldAry?.forEach((item) => {
      if (!item.isPrivate) {
        options.push({
          label: item.name,
          value: item.name
        });
      }

      // if (item.isPrimaryKey) {
      //   systemFileds.options.push({
      //     label: item.name,
      //     value: item.name
      //   })
      // }
    });

    return options;
  };

  const handleChange = (val) => {
    const item = entity?.fieldAry.find((item) => item.name === val);

    value.set({
      name: val,
      bizType: item.bizType
    });
  };

  return (
    <div className="fangzhou-theme">
      {domainModel?.type === 'aggregation-model' ? (
        <AutoComplete
          value={value.get()}
          size="small"
          style={{ width: '100%' }}
          placeholder="请选择或者输入查询字段"
          onChange={handleChange}
          options={getFieldOptions()}
        />
      ) : (
        <Select
          value={value.get()}
          size="small"
          style={{ width: '100%' }}
          placeholder="请选择领域模型查询字段"
          onChange={handleChange}
          options={getFieldOptions()}
        />
      )}
    </div>
  );
}
