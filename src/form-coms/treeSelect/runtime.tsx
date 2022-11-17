import React, { useCallback, useLayoutEffect } from 'react';
import { TreeSelect } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, uuid } from '../../utils';
import { Option } from '../types';

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

export default function Runtime({ env, data, inputs, outputs, logger }: RuntimeParams<Data>) {
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
        onChange(val);
      } else {
        logger.error(`树选择的值应为基本类型`);
      }
    });

    inputs['resetValue'](() => {
      onChange(void 0);
    });

    inputs['setOptions']((ds) => {
      let tempDs: Option[] = [];
      if (Array.isArray(ds)) {
        ds.forEach((item, index) => {
          tempDs.push({
            checked: false,
            disabled: false,
            lable: `选项${index}`,
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
            lable: `选项`,
            value: `${uuid()}`,
            children: [],
            ...(ds || {})
          }
        ];
      }
      let newValArray: any[] = [],
        newVal;
      let updateValue = false;
      traversalTree(tempDs, (node) => {
        const { checked, value } = node;
        if (checked && value != undefined) {
          updateValue = true;
          newVal = value;
          newValArray.push(value);
        }
      });
      if (updateValue) {
        onChange(data.config.multiple ? newValArray : newVal);
      }
      data.options = tempDs.map(({ label, value, disabled, checked, children }) => {
        return {
          label,
          value,
          disabled,
          checked,
          children
        };
      });
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

  const onChange = useCallback((value) => {
    data.value = value;
    outputs['onChange'](value);
  }, []);

  const options = data.options.map((item) => {
    return {
      ...item,
      label: item.label
    };
  });

  return (
    <div className={css.select}>
      <TreeSelect {...data.config} value={data.value} onChange={onChange} treeData={options} />
    </div>
  );
}
