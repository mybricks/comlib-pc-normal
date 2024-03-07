import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>([]);


  useEffect(() => {
    if (env.runtime.debug?.prototype) {
      data.dataSource = [{
        title: "aaa",
        description: "aaa",
        key: 'aaa'
      }, {
        title: "bbb",
        description: "bbb",
        key: 'bbb'
      }, {
        title: "ccc",
        description: "ccc",
        key: 'ccc'
      }, {
        title: "ddd",
        description: "ddd",
        key: 'ddd'
      }, {
        title: "eee",
        description: "eee",
        key: 'eee'
      },]
    }
  }, [env.runtime.debug?.prototype])

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels;
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
    changeValue(val);
  };

  const getTransferValue = useCallback(() => {
    return valueRef.current;
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
          changeValue(void 0);
        },
        setDisabled() {
          data.disabled = true;
        },
        setEnabled() {
          data.disabled = false;
        },
        setIsEnabled(val) {
          if (val === true) {
            data.disabled = false;
          } else if (val === false) {
            data.disabled = true;
          }
        },
        validate
      }
    },
    [targetKeys]
  );

  inputs['setSource']((dataSource, relOutputs) => {
    if (!Array.isArray(dataSource)) {
      message.error('数据源必须是数组类型');
      return;
    }
    if (!dataSource.every((item) => !!item.key)) {
      message.error('每个数据项必须包含唯一key标识');
      return;
    }
    data.dataSource = dataSource;
    relOutputs['setSourceDone'](dataSource);
  });
  // 设置校验状态
  inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
    if (validateRelOutputRef.current) {
      validateRelOutputRef.current(info);
      relOutputs['setValidateInfoDone'](info);
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  const changeValue = (targetKeys: string[] | undefined) => {
    setTargetKeys(targetKeys);
    valueRef.current = targetKeys;
    onChangeForFc(parentSlot, { id, name, value: targetKeys });
  };

  const onChange = (targetKeys: string[], direction, moveKeys: string[]) => {
    changeValue(targetKeys);
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
        style={{ height: style.height }}
        titles={[env.i18n(titles[0]), env.i18n(titles[1])]}
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
