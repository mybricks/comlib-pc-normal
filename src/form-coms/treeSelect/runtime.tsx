import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { TreeSelect } from 'antd';
import { validateFormItem } from '../utils/validator';
import { typeCheck, uuid } from '../../utils';
import { OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { Data, Option } from './types';
import css from './runtime.less';

/**遍历树组件 */
// const traversalTree = (treeData: Option[], cb) => {
//   treeData.forEach((node) => {
//     const { children, ...res } = node;
//     cb(res);
//     if (Array.isArray(children)) {
//       traversalTree(children, cb);
//     }
//   });
// };

export default function Runtime({
  title,
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const curNode = useRef({});

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
      if (Array.isArray(ds)) {
        data.options = ds;
      } else {
        logger.warn(`组件 ${title} Invalid data: ${JSON.stringify(ds)}`);
      }
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

  useEffect(() => {
    inputs['setLoadData']((val) => {
      if (!data.useLoadData) {
        return;
      }

      const { node, resolve } = curNode.current as any;

      data.options = setTreeDataForLoadData(data, node, data.options, val);

      resolve();
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

  const onLoadData = (node) => {
    return new Promise((resolve) => {
      curNode.current = {
        node,
        resolve
      };

      outputs['loadData'](node);
    });
  };

  return (
    <div className={css.select}>
      <TreeSelect
        {...data.config}
        value={data.value}
        treeData={data.options}
        loadData={data.useLoadData ? onLoadData : undefined}
        fieldNames={getFieldNames(data)}
        onChange={onChange}
      />
    </div>
  );
}

const setTreeDataForLoadData = (data, curNode, treeData, leafData) => {
  let newTreeData = [];
  const trueValueFieldName = data.valueFieldName || 'value';
  const trurChildrenFieldName = data.childrenFieldName || 'children';

  newTreeData = treeData.map((item) => {
    if (item[trueValueFieldName] === curNode[trueValueFieldName]) {
      item[trurChildrenFieldName] = leafData;
    } else {
      if (Array.isArray(item[trurChildrenFieldName])) {
        item[trurChildrenFieldName] = setTreeDataForLoadData(
          data,
          curNode,
          item[trurChildrenFieldName],
          leafData
        );
      }
    }

    return item;
  });

  return newTreeData;
};

const getFieldNames = (data: Data) => {
  const fieldNames = {
    label: data.labelFieldName,
    value: data.valueFieldName,
    children: data.childrenFieldName
  };

  return fieldNames;
};
