import React, { useCallback, useState } from 'react';
import { message, Transfer, Typography } from 'antd';
import { Data } from './types';
import { uuid } from '../utils';
import styles from './style.less';

const { Text, Title } = Typography;

export default function ({ data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const { dataSource, showSearch, oneWay, showDesc, showPagination, pagination, titles } = data;
  const _dataSource = dataSource.map((item) => {
    if (!item.key) {
      item.key = uuid();
    }
    return item;
  });

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  inputs['dataSource'](({ dataSource, target }) => {
    if (!Array.isArray(dataSource)) {
      message.error('数据源必须是数组类型');
      return;
    }
    data.dataSource = dataSource;
    if (!Array.isArray(target)) {
      message.error('目标数据必须是数组类型');
      return;
    }
    setTargetKeys(target);
  });

  inputs['getData'](() => {
    outputs['dataOut'](getTransferData());
  });

  const getTransferData = useCallback(() => {
    const lastSource = _dataSource.filter(({ key }) => !targetKeys.includes(key));
    const targetData = _dataSource.filter(({ key }) => targetKeys.includes(key));
    return {
      source: lastSource,
      target: targetData
    };
  }, [targetKeys]);

  const onChange = (targetKeys: string[], direction, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
    outputs['onChange'](_dataSource.filter(({ key }) => targetKeys.includes(key)));
  };

  const renderItem = ({ title, description }) => {
    if (showDesc) {
      return `${title}-${description}`;
    }
    return title;
  };

  return (
    <Transfer
      titles={titles}
      dataSource={_dataSource}
      targetKeys={targetKeys}
      showSearch={showSearch}
      showSelectAll
      oneWay={oneWay}
      // render={item => `${item.title}-${item.description}`}
      render={renderItem}
      pagination={showPagination && pagination}
      onChange={onChange}
    />
  );
}
