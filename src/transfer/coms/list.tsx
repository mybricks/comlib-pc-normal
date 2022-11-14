import React from 'react';
import { List } from 'antd';
export default ({ dataSource }) => {
  const renderItem = () => {};
  return <List dataSource={dataSource} renderItem={renderItem} />;
};
