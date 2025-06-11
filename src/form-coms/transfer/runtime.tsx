import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { message, Transfer, Tree, Empty, Input, Select, Modal } from 'antd';
import { UserOutlined, SearchOutlined, TeamOutlined} from '@ant-design/icons';
import { Data, TransferItem } from './types';
import { uuid } from '../../utils';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { debounceValidateTrigger } from '../form-container/models/validate';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import ConfigProvider from '../../components/ConfigProvider';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';
import { set } from 'lodash';

const generateTreeData = (data: TransferItem[]) => {
  data?.map((item) => {
      if (!item.key) {
        item.key = uuid();
      }
      if(item?.children) {
        generateTreeData(item.children)
      }
    });
}

function mergeAndDedupeArrays(arr1, arr2) {
  const mergedArray = [...arr1, ...arr2];
  const mergedSet = new Set(mergedArray);
  return Array.from(mergedSet);
}

function difference(set1, set2) {
  return set1.filter(item => !set2.includes(item));
}

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
  // const _dataSource = dataSource?.map((item) => {
  //   if (!item.key) {
  //     item.key = uuid();
  //   }
  //   return item;
  // });
  generateTreeData(dataSource||[])
  
  const transferRef = useRef(null);
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>([]);
  const [rightSelectedKeys, setRightSelectedKeys] = useState<string[] | undefined>([]);
  const [leftSelectedKeys, setLeftSelectedKeys] = useState<string[] | undefined>([]);
  const [searchValue, setSearchValue] = useState('');
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>([]);
  const [showTransfer, setShowTransfer] = useState(false);

  const transferDataSource: TransferItem[] = [];
  const leftAllKeys: String[] = []
  const selectDataSource: any[] = []
  const selectRef = React.useRef<any>();
  function flatten(list: TransferItem[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      leftAllKeys.push(item.key);
      selectDataSource.push(item)
      flatten(item.children);
    });
  }
  flatten(dataSource);

  const getTreeKeys = (list: TransferItem[] = [], keys: String[] = []) =>{
    list.forEach((item) => {
      keys.push(item.key)
      getTreeKeys(item.children, keys);
    });
  }

  const filterTreeData = (treeNodes: TransferItem[] = [],
    checkedKeys: string[],
    searchValue: string) => {
    const loop = (treeNodes) =>
      treeNodes
        .map((item ) => {
          const match = item.title.toLowerCase().includes(searchValue.toLowerCase());
          const children = item.children ? loop(item.children) : [];
          return {
            ...item,
            disabled: checkedKeys.includes(item.key as string),
            children,
            isMatch: match || children.some((child) => child.isMatch),
          };
        })
        .filter((item) => item.isMatch);
    return loop(treeNodes);
  }

  const treeData = filterTreeData(dataSource||[], targetKeys, searchValue)

  useEffect(() => {
    if (env.runtime.debug?.prototype) {
      data.dataSource = [
        {
          title: 'aaa',
          description: 'aaa',
          key: 'aaa'
        },
        {
          title: 'bbb',
          description: 'bbb',
          key: 'bbb'
        },
        {
          title: 'ccc',
          description: 'ccc',
          key: 'ccc'
        },
        {
          title: 'ddd',
          description: 'ddd',
          key: 'ddd'
        },
        {
          title: 'eee',
          description: 'eee',
          key: 'eee'
        }
      ];
    }
  }, [env.runtime.debug?.prototype]);

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
            debounceValidateTrigger(parentSlot, { id, name, validateInfo: r });
          }
        })
        .catch((e) => {
          outputRels(e);
          debounceValidateTrigger(parentSlot, { id, name, validateInfo: e });
        });
    },
    [targetKeys]
  );

  const clearSelectedTargetItems = () => {
    transferRef.current?.setStateKeys('right', []);
    setTargetKeys([])
  }

  const leftSelectAll = () => {
    let treeKeys = [] 
    getTreeKeys(treeData, treeKeys)
    transferRef.current?.setStateKeys('left',  mergeAndDedupeArrays(treeKeys, leftSelectedKeys));
  }

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


  const chooseSearchIcons = (val) => {
    if(val==1)
      return (<SearchOutlined />)
    return (<UserOutlined />)
  };

  const handleOpenTransfer = () => {
    setShowTransfer(true)
  };

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
      debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  const changeValue = (targetKeys: string[] | undefined) => {
    let uniqueArr = targetKeys?.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    setTargetKeys(uniqueArr);
    valueRef.current = uniqueArr;
    onChangeForFc(parentSlot, { id, name, value: uniqueArr });
  };

  const onChange = (targetKeys: string[], direction, moveKeys: string[]) => {
    changeValue(targetKeys);
    onValidateTrigger();
    outputs['onChange'](targetKeys);
  };


  const handleSubmit = () => {
    setShowTransfer(false)
    // if (typeof onOk === "function") {
    //     onOk(targetKeys, selectedLists);
    // };
};

  const renderItem = ({ title, description }) => {
    if (showDesc) {
      return `${title}-${description}`;
    }
    return title;
  };

  const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) =>
    selectedKeys.includes(eventKey);

  // 勾选数据更新
  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    outputs['onSelectChange'] &&
      outputs['onSelectChange']({ sourceSelectedKeys, targetSelectedKeys });
  };

  return (
    <ConfigProvider locale={env.vars?.locale}>
      <Select
        style={{ minWidth: 200 }}  
        placeholder="请选择"
        mode="multiple"
        // 以下属性不支持覆盖
        onChange={(value: any, options: any) => {
            setTargetKeys(value, options);
            let right = JSON.parse(JSON.stringify(rightSelectedKeys))
            let left = difference(targetKeys, right)
            transferRef.current?.setStateKeys('right', value);
            transferRef.current?.onRightItemSelectAll(left, false);
            // setState({ selectedKeys: value });
        }}
        open={false}
        ref={selectRef}
        value={targetKeys}
        onDropdownVisibleChange={handleOpenTransfer}>
        {selectDataSource.map((item: any) => {
                      return (
                          <Select.Option key={item?.key} value={item?.key}>
                              {item?.title}
                          </Select.Option>
                      );
                  })}
      </Select>
      <Modal
                title="请选择"
                width={800}
                okText="确定"
                cancelText="取消"
                // 以下属性不支持覆盖
                destroyOnClose
                visible={showTransfer}
                onCancel={() => {
                   setShowTransfer(false)
                }}
                onOk={handleSubmit}
                zIndex={1002}
                className={styles.transDlg}
            >
        <Transfer
          ref={transferRef}
          className={styles.transfer}
          style={{ height: style.height }}
          titles={[
            // <span data-transfer-title-idx="0">{env.i18n(titles[0])}</span>,
            // <span data-transfer-title-idx="1">{env.i18n(titles[1])}</span>
          ]}
          dataSource={transferDataSource}
          targetKeys={targetKeys === null || targetKeys === undefined ? [] : targetKeys}
          // selectedKeys={leftSelectedKeys}
          showSearch={showSearch}
          showSelectAll={false}
          oneWay={oneWay}
          disabled={disabled}
          operations={['>>', '<<']}
          render={renderItem}
          pagination={showPagination && pagination}
          onChange={onChange}
          // onSelectChange={onSelectChange}
          selectAllLabels={[
            ({ selectedCount, totalCount }) => (<div className={styles.search}> 
              <Input
                size="small"
                // placeholder="请输入"
                prefix={chooseSearchIcons(1)}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              /><div className={styles.leftSelectAll} onClick={leftSelectAll}>全选</div></div>),
            ({ selectedCount, totalCount }) => (
              <div className={styles.rightHeader}>
                <div>已选择({selectedCount})</div>
                <div onClick={clearSelectedTargetItems}>清空</div>
              </div>
            ),
          ]}
          >
          {({ direction, onItemSelect, selectedKeys }) => {
            if(direction === 'left') {
              setLeftSelectedKeys(selectedKeys)
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return(
                <div className={styles.container}>
                      {
                      treeData?.length <= 0 ? 
                        <div className={styles.empetyContainer}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/></div>:<div></div>
                      }
                      <div className={styles.treeContainer}>
                      <Tree
                      blockNode
                      checkable
                      className={styles.tree}
                      //checkStrictly
                      defaultExpandAll
                      checkedKeys={checkedKeys}
                      treeData={treeData}
                      onCheck={(_, { node: { key } }) => {
                        transferRef.current?.setStateKeys('left', _);
                        // onItemSelect(key as string, !isChecked(checkedKeys, key));
                      }}
                      onSelect={(_, { node: { key } }) => {
                        transferRef.current?.setStateKeys('left', _);
                        // onItemSelect(key as string, !isChecked(checkedKeys, key));
                      }}
                  />
                      </div>
                </div>
              )
            }
            if(direction === 'right') {
              setRightSelectedKeys(selectedKeys)
            }
        }}
        </Transfer>
      </Modal>
    </ConfigProvider>
  );
}
