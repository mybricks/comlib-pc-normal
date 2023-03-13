import { Select } from 'antd';
import React from 'react';

const SelectRender = () => {
  return (
    <Select
      style={{ width: '100%' }}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true }
      ]}
    ></Select>
  );
};

export { SelectRender };
