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

/**
 * 根据key查找节点
 * @param treeData treeNodes 数据
 * @param key 节点标识
 * @param keyFieldName 节点标识字段
 * @param cb 回调函数
 * @returns
 */
export const getNodeDataByKey = (treeData: Option[], key: string, keyFieldName, cb) => {
  treeData.forEach((item) => {
    if (item[keyFieldName] === key) {
      cb(item);
    } else if (item.children) {
      getNodeDataByKey(item.children, key, keyFieldName, cb);
    }
  });
};

/**
 * 根据keyFieldName更新节点数据
 * @param treeData treeNodes 数据
 * @param newNodeData 新节点数据
 * @param keyFieldName 节点标识字段
 * @returns
 */
export const updateNodeData = (treeData: Option[], newNodeData: Option, keyFieldName: string) => {
  treeData = treeData.map((item) => {
    if (item[keyFieldName] === newNodeData[keyFieldName]) {
      item = {
        ...item,
        ...newNodeData
      };
    } else if (item.children) {
      item.children = updateNodeData(item.children, newNodeData, keyFieldName);
    }
    return item;
  });
  return treeData;
};

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
  const keyFieldName = data.valueFieldName || 'value';
  let expandKeys: React.Key[] = [];

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

    // 更新节点数据
    inputs['setNodeData'] &&
      inputs['setNodeData']((nodeData: Option) => {
        if (typeCheck(nodeData, 'OBJECT')) {
          data.options = [...updateNodeData(data.options, nodeData, keyFieldName)];
        }
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

  const onExpand = (newExpandKeys) => {
    if (newExpandKeys.length > expandKeys.length) {
      const index = newExpandKeys.length - 1;
      const currentExpandKey = newExpandKeys[index];
      let currentNode = {};
      getNodeDataByKey(data.options, currentExpandKey, keyFieldName, (node) => {
        currentNode = node;
      });
      outputs['onExpand']({ ...currentNode });
    }
    expandKeys = newExpandKeys;
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
        onTreeExpand={onExpand}
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
