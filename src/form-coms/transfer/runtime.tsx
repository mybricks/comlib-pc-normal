import React, { useCallback, useState } from 'react';
import { message, Transfer } from 'antd';
import { Data } from './types';
import { uuid } from '../../utils';
import { validateFormItem } from '../utils/validator';
import styles from './style.less';

export default function ({ data, inputs, outputs, slots, env }: RuntimeParams<Data>) {
  const { dataSource, showSearch, oneWay, showDesc, showPagination, pagination, titles, disabled } =
    data;
  const _dataSource = dataSource.map((item) => {
    if (!item.key) {
      item.key = uuid();
    }
    return item;
  });

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const validate = useCallback(
    (val, outputRels) => {
      validateFormItem({
        value: targetKeys,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    },
    [targetKeys]
  );

  const getTransferValue = useCallback(() => {
    return targetKeys;
  }, [targetKeys]);

  inputs['setSource']((dataSource) => {
    if (!Array.isArray(dataSource)) {
      message.error('数据源必须是数组类型');
      return;
    }
    data.dataSource = dataSource;
  });

  inputs['setValue']((val) => {
    if (!Array.isArray(val)) {
      message.error('穿梭框目标值必须是数组类型');
      return;
    }
    setTargetKeys(val);
  });

  inputs['getValue'](() => {
    outputs['returnValue'](getTransferValue());
  });

  inputs['resetValue'](() => {
    setTargetKeys([]);
  });

  inputs['validate'](validate);

  inputs['setEnabled'](() => {
    data.disabled = true;
  });

  inputs['setDisabled'](() => {
    data.disabled = false;
  });

  const onChange = (targetKeys: string[], direction, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
    outputs['onChange'](targetKeys);
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
      disabled={disabled}
      render={renderItem}
      pagination={showPagination && pagination}
      onChange={onChange}
    />
  );
}
