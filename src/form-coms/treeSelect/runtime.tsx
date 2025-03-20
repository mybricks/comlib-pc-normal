import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import uniq from 'lodash/uniq';
import { TreeNodeProps, TreeSelect, Image, TreeSelectProps, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { typeCheck, uuid } from '../../utils';
import { InputIds, OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { debounceValidateTrigger } from '../form-container/models/validate';
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
  const validateRelOutputRef = useRef<any>(null);
  const [value, setValue] = useState<any>();
  //fetching, 是否开启loading的开关
  const [fetching, setFetching] = useState(false);
  const [treeLoadedKeys, setTreeLoadKeys] = useState<React.Key[]>([]);
  const treeLoadedKeysRef = useRef<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [fieldNames, setFieldNames] = useState<FieldNamesType>({
    label: 'label',
    value: 'value',
    children: 'children'
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<any>();
  const [color, setColor] = useState('');

  useEffect(() => {
    if (env.runtime.debug?.prototype) {
      data.options = [
        {
          label: 'aaa',
          value: 'aaa',
          children: []
        },
        {
          label: 'bbb',
          value: 'bbb',
          children: [
            {
              label: 'ddd',
              value: 'ddd',
              expanded: true,
              children: []
            },
            {
              label: 'eee',
              value: 'eee',
              children: []
            }
          ]
        },
        {
          label: 'ccc',
          value: 'ccc',
          children: []
        }
      ];
    }
  }, [env.runtime.debug?.prototype]);

  useLayoutEffect(() => {
    inputs['validate']((model, outputRels) => {
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
            validateRelOutputRef.current = outputRels['returnValidate'];
            outputs[OutputIds.OnValidate](valueRef.current);
          } else {
            outputRels['returnValidate'](r);
            debounceValidateTrigger(parentSlot, { id, name, validateInfo: r });
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          debounceValidateTrigger(parentSlot, { id, name, validateInfo: e });
        });
    });

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](valueRef.current);
    });

    inputs['setValue']((val, outputRels) => {
      if (data.config.multiple) {
        if (typeCheck(val, ['Array', 'NULL', 'UNDEFINED'])) {
          changeValue(val);
          outputs[OutputIds.OnChange](val);
        } else {
          logger.warn(`${title}【设置值】参数应为数组格式`);
        }
      } else if (typeCheck(val, ['NUMBER', 'BOOLEAN', 'STRING', 'NULL', 'UNDEFINED'])) {
        changeValue(val);
        outputs[OutputIds.OnChange](val);
      } else {
        logger.warn(`${title}【设置值】参数应为基本类型`);
      }
      if (outputRels['setValueDone']) {
        outputRels['setValueDone'](val);
      }
    });

    inputs['setInitialValue']((val, outputRels) => {
      if (data.config.multiple) {
        typeCheck(val, ['Array', 'NULL', 'UNDEFINED'])
          ? onInit(val)
          : logger.warn(`${title}【设置初始值】参数应为数组格式`);
      } else if (typeCheck(val, ['NUMBER', 'BOOLEAN', 'STRING', 'NULL', 'UNDEFINED'])) {
        onInit(val);
      } else {
        logger.warn(`${title}【设置初始值】参数应为基本类型`);
      }
      if (outputRels['setInitialValueDone']) {
        outputRels['setInitialValueDone'](val);
      }
    });

    inputs['resetValue']((_, outputRels) => {
      changeValue(void 0);
      if (outputRels['resetValueDone']) {
        outputRels['resetValueDone']();
      }
    });

    inputs['setOptions']((ds, outputRels) => {
      if (Array.isArray(ds)) {
        data.options = ds;

        let _treeLoadedKeys = getTreeLoadedKeys(ds, []);
        treeLoadedKeysRef.current = _treeLoadedKeys;
        setTreeLoadKeys(_treeLoadedKeys);

        setExpandedKeys(getDefaultExpandKeys());

        outputRels['setOptionsDone'](ds);
      } else {
        logger.warn(`组件 ${title} Invalid data: ${JSON.stringify(ds)}`);
      }
      setFetching(false);

      function getTreeLoadedKeys(treeData: TreeData[], keys: React.Key[]) {
        treeData.forEach((node) => {
          if (node.children && Array.isArray(node.children) && node.children.length) {
            keys.push(node[data.valueFieldName || 'value']);
            getTreeLoadedKeys(node.children, keys);
          }
        });
        return keys;
      }
    });

    inputs['setLoading']((val: boolean, outputRels) => {
      data.config = {
        ...data.config,
        loading: val
      };
      outputRels['setLoadingDone'](val);
    });

    //设置禁用
    inputs['setDisabled']((_, outputRels) => {
      data.config.disabled = true;
      if (outputRels['setDisabledDone']) {
        outputRels['setDisabledDone']();
      }
    });
    //设置启用
    inputs['setEnabled']((_, outputRels) => {
      data.config.disabled = false;
      if (outputRels['setEnabledDone']) {
        outputRels['setEnabledDone']();
      }
    });

    //设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.config.disabled = false;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      } else {
        data.config.disabled = true;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      }
    });

    //设置编辑/只读
    inputs['isEditable']((val, relOutputs) => {
      data.isEditable = val;
      if (relOutputs['isEditableDone']) {
        relOutputs['isEditableDone'](val);
      }
    });

    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, outputRels) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        outputRels['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
      }
    });
    // 设置下拉框字体颜色
    inputs[InputIds.SetColor]((color: string, relOutputs) => {
      if (typeof color === 'string') {
        setColor(color);
        relOutputs['setColorDone'](color);
      }
    });
  }, [value]);

  useEffect(() => {
    if (env.runtime) {
      setFieldNames(getFieldNames(data));
    }
  }, []);

  useEffect(() => {
    inputs['setLoadData']((val, relOutputs) => {
      if (!data.useLoadData) {
        return;
      }

      let myCurNode = curNode.current[val[data.valueFieldName]] as any;
      const { node, resolve } = myCurNode as any;
      // const { node, resolve } = curNode.current as any;
      data.options = setTreeDataForLoadData(data, node, data.options, val);
      resolve();
      treeLoadedKeysRef.current = uniq([...treeLoadedKeys, `${node.key}`]);
      setTreeLoadKeys(uniq([...treeLoadedKeys, `${node.key}`]));
      relOutputs['setLoadDataDone'](val);
    });
  }, [treeLoadedKeys]);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((value) => {
    if (value === undefined) {
      setValue('');
    }
    valueRef.current = value;
    setValue(value);
    onChangeForFc(parentSlot, { id, value, name });
  }, []);

  const onChange = useCallback((value) => {
    changeValue(value);
    outputs[OutputIds.OnChange](value);
    onValidateTrigger();
  }, []);

  const onInit = useCallback((value) => {
    changeValue(value);
    outputs[OutputIds.OnInitial](value);
  }, []);

  const onLoadData = useCallback(
    (node) => {
      if (treeLoadedKeys.includes(node.key)) {
        setTreeLoadKeys(uniq([...treeLoadedKeysRef.current, `${node.key}`]));
        return Promise.resolve();
      }

      treeLoadedKeysRef.current = uniq([...treeLoadedKeysRef.current, `${node.key}`]);
      // setTreeLoadKeys(uniq([...treeLoadedKeysRef.current, `${node.key}`]));

      return new Promise((resolve) => {
        // curNode.current = {
        //   node,
        //   resolve
        // };

        if (node.children && node.children.length > 0) {
          resolve();
          return;
        }

        curNode.current[node.key] = {
          node,
          resolve
        };

        if (!node._depth) {
          return;
        }

        outputs['loadData']({
          ...node,
          [data.labelFieldName || 'label']: node.title
        });
      });
    },
    [treeLoadedKeys]
  );

  /** 搜索事件 */
  const onSearch = (e) => {
    //开启自定义搜索功能
    if (data.customOnSearch) {
      setFetching(true);
      outputs['onSearch'](e);
    }
    //1、远程数据源
    if (!e && data.customOnSearch === true) {
      data.options = [];
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  /** 更新默认展开节点 */
  const getDefaultExpandKeys = useCallback(() => {
    const keys: React.Key[] = [];
    if (env.runtime) {
      traversalTree(data.options, fieldNames, (item) => {
        const { [data.valueFieldName || 'value']: key, expanded, _depth } = item;
        if (data.openDepth < 0) {
          keys.push(key);
        } else if (_depth < data.openDepth) {
          keys.push(key);
        } else if (expanded) {
          keys.push(key);
        }
      });
    }
    return keys;
  }, []);

  /** 展开事件 */
  const onExpand: TreeSelectProps['onTreeExpand'] = useCallback(
    (keys) => {
      if (keys?.length > expandedKeys?.length && data.useLoadData) {
        const key = keys[keys.length - 1];

        let node;
        traversalTree(data.options, fieldNames, (item) => {
          if (item[data.valueFieldName || 'value'] === key) {
            node = item;
          }
        });

        onLoadData(node);
      }

      setExpandedKeys([...keys]);
    },
    [expandedKeys, data.useLoadData, data.options]
  );

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
          const children = item[data.childrenFieldName || 'children'];
          const outputItem = {
            isRoot: depth === 0,
            _depth: depth,
            isLeaf: !children?.length,
            ...item
          };
          return (
            <TreeNode
              key={item[data.valueFieldName || 'value']}
              {...item}
              label={item[data.labelFieldName || 'label']}
              value={item[data.valueFieldName || 'value']}
              title={item[data.labelFieldName || 'label']}
              icon={getNodeIcon(outputItem, data, onError)}
            >
              {renderTreeNode(children || [], depth + 1)}
            </TreeNode>
          );
        })}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className={`${css.select} ${color ? css.selectColor : ''}`}>
      {data.isEditable ? (
        <TreeSelect
          treeIcon
          {...data.config}
          placeholder={env.i18n(data.config.placeholder)}
          showSearch={data.config.showSearch}
          showArrow={data.config.showArrow}
          treeDefaultExpandAll={env.design ? true : void 0}
          treeExpandedKeys={expandedKeys}
          onTreeExpand={onExpand}
          switcherIcon={(props) => getIcon(data.switcherIcon, props)}
          multiple={data.config.multiple}
          treeCheckable={data.config.treeCheckable}
          showCheckedStrategy={data.config.showCheckedStrategy}
          maxTagCount={data.config.maxTagCount}
          treeNodeFilterProp={data.config.treeNodeFilterProp}
          open={env.design ? true : void 0}
          value={value}
          loadData={data.useLoadData ? onLoadData : undefined}
          onChange={onChange}
          onSearch={onSearch}
          treeLoadedKeys={data.loadDataOnce ? treeLoadedKeys : []}
          dropdownClassName={id}
          getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
          notFoundContent={data.customOnSearch && fetching ? <Spin size="small" /> : void 0}
          style={{
            color: color
          }}
        >
          {renderTreeNode(env.design ? (treeDataInDesign(data) as any) : data.options)}
        </TreeSelect>
      ) : Array.isArray(value) ? (
        value.join(',')
      ) : (
        value
      )}
    </div>
  );
}

/**
 * 简单图标渲染
 * @param iconConfig 图标配置
 * @param props renderProps
 * @returns JSX
 */
const getIcon = (iconConfig: IconType, props: TreeNodeProps) => {
  const { src, innerIcon, customIcon } = iconConfig || {};
  switch (src) {
    case 'inner':
      return Icons && innerIcon && Icons[innerIcon]?.render();
    case 'custom':
      const { expanded } = props || {};
      return (
        customIcon && (
          <Image
            src={customIcon}
            preview={false}
            style={{
              transform: expanded ? 'rotate(90deg)' : void 0
            }}
          />
        )
      );
    default:
      return void 0;
  }
};

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
