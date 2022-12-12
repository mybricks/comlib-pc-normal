import React, { useCallback, useState } from 'react';
import { message, Transfer } from 'antd';
import { Data } from './types';
import { uuid } from '../../utils';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';

export default function ({ data, inputs, outputs, slots, env, style }: RuntimeParams<Data>) {
  const { dataSource, showSearch, oneWay, showDesc, showPagination, pagination, titles, disabled } =
    data;
  const _dataSource = dataSource.map((item) => {
    if (!item.key) {
      item.key = uuid();
    }
    return item;
  });

  const [targetKeys, setTargetKeys] = useState<string[] | undefined>([]);

  const validate = useCallback(
    (output) => {
      validateFormItem({
        value: targetKeys,
        env,
        rules: data.rules
      })
        .then((r) => {
          output(r);
        })
        .catch((e) => {
          output(e);
        });
    },
    [targetKeys]
  );

  const setTarget = (val) => {
    if (!Array.isArray(val)) {
      message.error('穿梭框目标值必须是数组类型');
      return;
    }
    setTargetKeys(val);
  };

  const getTransferValue = useCallback(() => {
    return targetKeys;
  }, [targetKeys]);

  useFormItemInputs(
    {
      inputs,
      outputs,
      configs: {
        setValue: setTarget,
        setInitialValue: setTarget,
        returnValue(output) {
          output(getTransferValue());
        },
        resetValue() {
          setTargetKeys(void 0);
        },
        setDisabled() {
          data.disabled = true;
        },
        setEnabled() {
          data.disabled = false;
        },
        validate
      }
    },
    [targetKeys]
  );

  inputs['setSource']((dataSource) => {
    if (!Array.isArray(dataSource)) {
      message.error('数据源必须是数组类型');
      return;
    }
    if (!dataSource.every((item) => !!item.key)) {
      message.error('每个数据项必须包含唯一key标识');
      return;
    }
    data.dataSource = dataSource;
  });

  // inputs['setValue']((val) => {
  //   if (!Array.isArray(val)) {
  //     message.error('穿梭框目标值必须是数组类型');
  //     return;
  //   }
  //   setTargetKeys(val);
  // });

  // inputs['getValue']((_, outputRels) => {
  //   outputRels['returnValue'](getTransferValue());
  // });

  // inputs['resetValue'](() => {
  //   setTargetKeys([]);
  // });

  // inputs['validate'](validate);

  // inputs['setEnabled'](() => {
  //   data.disabled = true;
  // });

  // inputs['setDisabled'](() => {
  //   data.disabled = false;
  // });

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
    <div style={style}>
      <Transfer
        className={styles.wrap}
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
    </div>
  );
}
