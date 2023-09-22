import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { uniq } from 'lodash';
import { TreeNodeProps, TreeSelect, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { validateFormItem } from '../utils/validator';
import { typeCheck, uuid } from '../../utils';
import { OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { Data, IconType, Option } from './types';
import { getDynamicDisplay, setTreeDataForLoadData, getFieldNames, traversalTree } from './utils';
import css from './runtime.less';
import { treeDataInDesign } from './const';
import { FieldNamesType } from 'antd/lib/cascader';

export default function Runtime({
  title,
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  name,
  onError
}: RuntimeParams<Data>) {
  const curNode = useRef({});
  const [treeLoadedKeys, setTreeLoadKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [fieldNames, setFieldNames] = useState<FieldNamesType>({
    label: 'label',
    value: 'value',
    children: 'children'
  });

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
    if (env.runtime) {
      setFieldNames(getFieldNames(data));
    }
  }, []);

  useEffect(() => {
    inputs['setLoadData']((val) => {
      if (!data.useLoadData) {
        return;
      }

      const { node, resolve } = curNode.current as any;

      data.options = setTreeDataForLoadData(data, node, data.options, val);
      setTreeLoadKeys(uniq([...treeLoadedKeys, node.key]));
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

      outputs['loadData']({
        ...node,
        [data.labelFieldName || 'label']: node.title
      });
    });
  };

  /** 更新展开节点 */
  useEffect(() => {
    if (env.runtime) {
      const keys: React.Key[] = [];
      traversalTree(data.options, fieldNames, (item) => {
        const { [data.valueFieldName || 'value']: key, _depth } = item;
        if (data.openDepth < 0) {
          keys.push(key);
        } else if (_depth < data.openDepth) {
          keys.push(key);
        }
      });
      setExpandedKeys(keys);
    }
  }, [data.options]);

  /**
   * 树节点遍历渲染
   * @param treeData 树数据
   * @param depth 当前层级
   * @param parent 父节点数据
   * @returns JSX
   */
  const renderTreeNode = (treeData: Option[], depth = 0) => {
    const { TreeNode } = TreeSelect;
    return (
      <>
        {treeData.map((item, inx) => {
          const outputItem = {
            isRoot: depth === 0,
            _depth: depth,
            isLeaf: !item.children?.length,
            ...item
          };
          return (
            <TreeNode
              key={item[data.valueFieldName || 'value']}
              {...item}
              icon={getNodeIcon(outputItem, data, onError)}
            >
              {renderTreeNode(item.children || [], depth + 1)}
            </TreeNode>
          );
        })}
      </>
    );
  };

  return (
    <div className={css.select}>
      <TreeSelect
        treeIcon
        {...data.config}
        showSearch={data.config.showSearch}
        showArrow={data.config.showArrow}
        treeDefaultExpandAll={env.design ? true : void 0}
        treeExpandedKeys={expandedKeys}
        // switcherIcon={}
        multiple={data.config.multiple}
        treeCheckable={data.config.treeCheckable}
        showCheckedStrategy={data.config.showCheckedStrategy}
        maxTagCount={data.config.maxTagCount}
        treeNodeFilterProp={data.config.treeNodeFilterProp}
        open={env.design ? true : void 0}
        value={data.value}
        loadData={data.useLoadData ? onLoadData : undefined}
        fieldNames={fieldNames}
        onChange={onChange}
        treeLoadedKeys={data.loadDataOnce ? treeLoadedKeys : []}
        dropdownClassName={id}
        getPopupContainer={(triggerNode: HTMLElement) =>
          env.edit || env.runtime.debug ? env?.canvasElement : env.container || document.body
        }
      >
        {renderTreeNode(env.design ? (treeDataInDesign(data) as any) : data.options)}
      </TreeSelect>
    </div>
  );
}

/**
 * 节点图标渲染
 * @param item 节点数据
 * @param data 组件数据
 * @returns JSX
 */
const getNodeIcon = (item: TreeNodeProps, data: Data, onError?) => {
  const icon =
    data.icons?.find((icon) => getDynamicDisplay(item, icon, onError)) ||
    ({
      size: [14, 14]
    } as IconType);
  const { src, size, innerIcon, customIcon } = icon;
  if (item.icon || (src === 'custom' && customIcon))
    return (
      <Image
        width={size[1] || 14}
        height={size[0] || 14}
        src={item.icon || customIcon}
        preview={false}
      />
    );
  if (src === 'inner') {
    return (
      Icons && (
        <span style={{ fontSize: Math.max(...size) }}>
          {Icons[innerIcon || ('FolderOpenOutlined' as string)]?.render()}
        </span>
      )
    );
  }

  return void 0;
};
