import React, { useCallback, useRef, useState } from 'react';
import { message, Transfer } from 'antd';
import { Data } from './types';
import { uuid } from '../../utils';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import ConfigProvider from '../../components/ConfigProvider';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';

export default function ({
  data,
  inputs,
  outputs,
  slots,
  env,
  style,
  id,
  name,
  parentSlot
}: RuntimeParams<Data>) {
  const { dataSource, showSearch, oneWay, showDesc, showPagination, pagination, titles, disabled } =
    data;
  const _dataSource = dataSource?.map((item) => {
    if (!item.key) {
      item.key = uuid();
    }
    return item;
  });

  const [targetKeys, setTargetKeys] = useState<string[] | undefined>([]);
  const validateRelOuputRef = useRef<any>(null);

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: targetKeys,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const cutomRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (cutomRule?.status) {
            validateRelOuputRef.current = outputRels;
            outputs[OutputIds.OnValidate](getTransferValue());
          } else {
            outputRels(r);
          }
        })
        .catch((e) => {
          outputRels(e);
        });
    },
    [targetKeys]
  );

  const setTarget = (val) => {
    if (!Array.isArray(val) && val !== null && val !== undefined) {
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
      id,
      name,
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
  // 设置校验状态
  inputs[InputIds.SetValidateInfo]((info: object) => {
    if (validateRelOuputRef.current) {
      validateRelOuputRef.current(info);
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  const onChange = (targetKeys: string[], direction, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
    onChangeForFc(parentSlot, { id, name, value: targetKeys });
    onValidateTrigger();
    outputs['onChange'](targetKeys);
  };

  const renderItem = ({ title, description }) => {
    if (showDesc) {
      return `${title}-${description}`;
    }
    return title;
  };

  return (
    <ConfigProvider locale={env.vars?.locale}>
      <Transfer
        className={styles.transfer}
        titles={titles}
        dataSource={_dataSource}
        targetKeys={targetKeys === null || targetKeys === undefined ? [] : targetKeys}
        showSearch={showSearch}
        showSelectAll
        oneWay={oneWay}
        disabled={disabled}
        render={renderItem}
        pagination={showPagination && pagination}
        onChange={onChange}
      />
    </ConfigProvider>
  );
}
