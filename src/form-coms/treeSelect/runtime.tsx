import React, { useCallback, useLayoutEffect } from 'react';
import { TreeSelect } from 'antd';
import { validateFormItem } from '../utils/validator';
import { typeCheck, uuid } from '../../utils';
import { OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { Data, Option } from './types';
import css from './runtime.less';

/**遍历树组件 */
const traversalTree = (treeData: Option[], cb) => {
  treeData.forEach((node) => {
    const { children, ...res } = node;
    cb(res);
    if (Array.isArray(children)) {
      traversalTree(children, cb);
    }
  });
};

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  useLayoutEffect(() => {
    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['setValue']((val) => {
      if (data.config.multiple) {
        Array.isArray(val) ? onChange(val) : logger.error(`树选择的值应为数组格式`);
      } else if (typeCheck(val, ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED'])) {
        changeValue(val);
      } else {
        logger.error(`树选择的值应为基本类型`);
      }
    });

    inputs['setInitialValue']((val) => {
      if (data.config.multiple) {
        Array.isArray(val) ? onInit(val) : logger.error(`树选择的值应为数组格式`);
      } else if (typeCheck(val, ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED'])) {
        onInit(val);
      } else {
        logger.error(`树选择的值应为基本类型`);
      }
    });

    inputs['resetValue'](() => {
      data.value = void 0;
    });

    inputs['setOptions']((ds) => {
      let tempDs: Option[] = [];
      if (Array.isArray(ds)) {
        ds.forEach((item, index) => {
          tempDs.push({
            checked: false,
            disabled: false,
            label: `选项${index}`,
            value: `${uuid()}`,
            children: [],
            ...item
          });
        });
      } else {
        tempDs = [
          {
            checked: false,
            disabled: false,
            label: `选项`,
            value: `${uuid()}`,
            children: [],
            ...(ds || {})
          }
        ];
      }
      let newValArray: any[] = [],
        newVal;
      traversalTree(tempDs, (node) => {
        const { checked, value } = node;
        if (checked && value != undefined) {
          newVal = value;
          newValArray.push(value);
        }
      });
      data.options = tempDs.map(
        ({ label, checkable, disableCheckbox, selectable, value, disabled, children }) => {
          return {
            label,
            value,
            disabled,
            children,
            checkable,
            disableCheckbox,
            selectable
          };
        }
      );
    });

    inputs['setLoading']((val: boolean) => {
      data.config = {
        ...data.config,
        loading: val
      };
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((value) => {
    if (value === undefined) {
      data.value = '';
    }
    data.value = value;
    onChangeForFc(parentSlot, { id, value, name });
    outputs[OutputIds.OnChange](value);
  }, []);

  const onChange = useCallback((value) => {
    changeValue(value);
    onValidateTrigger();
  }, []);

  const onInit = useCallback((value) => {
    data.value = value;
    outputs[OutputIds.OnInitial](value);
  }, []);

  return (
    <div className={css.select}>
      <TreeSelect {...data.config} value={data.value} onChange={onChange} treeData={data.options} />
    </div>
  );
}
