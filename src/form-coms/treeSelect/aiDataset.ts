import { defineDataSet, DataSetItem } from 'ai-dataset';
import { SelectOptionFilterPropsType } from './const';
import { TreeSelect } from 'antd';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 提示内容 ========================
  result.push(
    ...utils.repeat(() => {
      const placeholder = utils.word.noun();
      return {
        Q: `值为空时设置提示内容为“请输入${placeholder}”`,
        A: {
          data: {
            config: {
              placeholder: `请输入${placeholder}`
            }
          }
        }
      };
    })
  );

  // ======================== 清除图标 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}清除图标`,
      A: {
        data: {
          config: {
            allowClear: item.value
          }
        }
      }
    }))
  );

  // ======================== 显示下拉剪头 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}显示下拉剪头`,
      A: {
        data: {
          config: {
            showArrow: item.value
          }
        }
      }
    }))
  );

  // ======================== 下拉菜单和选择器同宽 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}下拉菜单和选择器同宽`,
      A: {
        data: {
          config: {
            dropdownMatchSelectWidth: item.value
          }
        }
      }
    }))
  );

  // ======================== 禁用状态 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}禁用状态`,
      A: {
        data: {
          config: {
            disabled: item.value
          }
        }
      }
    }))
  );

  // ======================== 默认展开深度 ========================
  result.push(
    ...utils.repeat(() => {
      const depth = utils.options.slider({ min: -1, max: 20 });
      return {
        Q: `默认展开深度为${depth}`,
        A: {
          data: { openDepth: depth }
        }
      };
    })
  );

  // ======================== 支持搜索 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}支持搜索`,
      A: {
        data: {
          config: {
            showSearch: item.value
          }
        }
      }
    }))
  );

  // ======================== 搜索规则 ========================
  const searchOptions = [
    {
      label: '根据名称搜索',
      value: SelectOptionFilterPropsType.Label
    },
    {
      label: '根据值搜索',
      value: SelectOptionFilterPropsType.Value
    }
  ];
  result.push(
    ...searchOptions.map((item) => ({
      Q: `搜索规则为${item.label}`,
      A: {
        data: {
          config: {
            showSearch: true,
            treeNodeFilterProp: item.value
          }
        }
      }
    }))
  );

  // ======================== 多选 ========================
  // TODO: src/form-coms/treeSelect/treeSelectEditors.ts:70
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}多选`,
      A: {
        data: {
          config: {
            treeCheckable: item.value,
            multiple: item.value ? 'multiple' : undefined
          }
        }
      }
    }))
  );

  // ========================  节点数配置 ========================
  const maxTagCountType = [
    {
      label: '自适应',
      value: 'isResponsive'
    },
    {
      label: '自定义',
      value: 'isCustom'
    }
  ];
  result.push(
    ...maxTagCountType.map((item) => ({
      Q: `设置节点数配置为${item.label}`,
      A: {
        data: {
          config: {
            multiple: true,
            maxTagCount: item.value
          }
        }
      }
    }))
  );

  // ======================== 最多显示数量 ========================
  result.push(
    ...utils.repeat(() => {
      const maxTagCount = utils.options.slider({ min: 0, max: 50 });
      return {
        Q: `最多显示数量为${maxTagCount}`,
        A: {
          data: {
            maxTagCountType: 'isCustom',
            config: {
              multiple: true,
              maxTagCount
            }
          }
        }
      };
    })
  );

  // ======================== 输出内容 ========================
  const showCheckedStrategy = [
    { label: '只输出子节点', value: TreeSelect.SHOW_CHILD },
    { label: '只输出父节点', value: TreeSelect.SHOW_PARENT },
    { label: '输出父节点和子节点', value: TreeSelect.SHOW_ALL }
  ];
  result.push(
    ...showCheckedStrategy.map((item) => ({
      Q: `输出内容为${item.label}`,
      A: {
        data: {
          config: {
            multiple: true,
            showCheckedStrategy: item.value
          }
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/treeSelect/editors.ts:325

  return result;
});
