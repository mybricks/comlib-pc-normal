import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

export default function DomainFieldEditor({ editConfig }) {
  const { value, options } = editConfig;
  const { entity } = options;
  // const [fieldOptions, setFieldOptions] = useState([])
  // console.log(entity?.fieldAry);
  const getFieldOptions = () => {
    const systemFileds: any = {
      label: '系统字段',
      options: []
    };

    const normalFileds: any = {
      label: '普通字段',
      options: []
    };

    entity?.fieldAry?.forEach((item) => {
      if (!item.isPrivate) {
        normalFileds.options.push({
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

    return [normalFileds];
  };

  const handleChange = (val) => {
    value.set(val);
  };

  return (
    <div className="fangzhou-theme">
      <Select
        value={value.get()}
        size="small"
        style={{ width: '100%' }}
        placeholder="请选择领域模型字段"
        onChange={handleChange}
        options={getFieldOptions()}
      />
    </div>
  );
}
