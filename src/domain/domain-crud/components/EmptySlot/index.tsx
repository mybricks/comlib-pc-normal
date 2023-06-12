/** @format */

import React from 'react';
import { Empty } from 'antd';
import styles from './index.less';

export default function ({ slot, description }) {
  return (
    <div className={styles.wrap}>
      <Empty
        imageStyle={{
          height: 45
        }}
        description={description || '可拖拽组件'}
      />
      {slot}
    </div>
  );
}
