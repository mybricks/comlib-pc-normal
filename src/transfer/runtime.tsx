import React, { useEffect } from 'react';
import { Transfer } from 'antd';
import { Data } from './types';
import { uuid } from '../utils';
import styles from './style.less';

export default function ({ data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const { dataSource } = data;
  const _dataSource = dataSource.map((item) => {
    if (!item.key) {
      item.key = uuid();
    }
    return item;
  });

  return <Transfer dataSource={_dataSource} />;
}
