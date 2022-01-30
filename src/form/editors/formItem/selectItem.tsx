import { uuid } from '../../../utils';
import { Data } from '../../runtime';
import { defaultCommentTrans, defaultTransOptScript } from '../../utils';
import { checkItemType, getFormItemProps, setFormItemProps } from './utils';

const SelectItemBaseEditor = [
  {
    title: '下拉框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, [
        'select',
        'multipleSelect',
        'tagsSelect'
      ]);
    },
    items: [
      {
        title: '提交数据为选项的{标签-值}',
        type: 'Switch',
        description: '开启后提交选项的标签（文本）和值',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'labelInValue');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'labelInValue', value);
          }
        }
      },
      {
        title: '清除内容图标',
        type: 'Switch',
        description: '开启后可点击清除内容',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'allowClear');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'allowClear', value);
          }
        }
      },
      {
        title: '下拉菜单和选择器同宽',
        type: 'Switch',
        description:
          '关闭时会关闭虚拟滚动，开启虚拟滚动在海量列表项时有更好的性能',
        // ifVisible({ data, focusArea }: EditorResult<Data>) {
        //   return checkItemType({ data, focusArea }, ['select']);
        // },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps(
                { data, focusArea },
                'dropdownMatchSelectWidth'
              ) !== false
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps(
              { data, focusArea },
              'dropdownMatchSelectWidth',
              value
            );
          }
        }
      },
      {
        title: '显示下拉图标',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'dropdownShowArrow');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'dropdownShowArrow', value);
          }
        }
      }
    ]
  }
];

const SelctItemPowerEditor = [
  {
    title: '输入配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['select', 'multipleSelect']);
    },
    items: [
      {
        title: '输入',
        type: 'Switch',
        description: '开启后下拉框支持输入，可配置搜索规则',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps({ data, focusArea }, 'showSearch') !== false
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'showSearch', value);
          }
        }
      }
    ]
  },
  {
    title: '默认搜索配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return (
        checkItemType({ data, focusArea }, ['select', 'multipleSelect']) &&
        getFormItemProps({ data, focusArea }, 'showSearch') !== false
      );
    },
    items: [
      {
        title: '搜索',
        type: 'Switch',
        description: '开启后下拉框可以配置默认搜索规则',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps({ data, focusArea }, 'filterOption') !== false
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'filterOption', value);
          }
        }
      },
      {
        title: '规则',
        type: 'Select',
        options: [
          {
            label: '根据名称搜索',
            value: 'label'
          },
          {
            label: '根据值搜索',
            value: 'value'
          }
        ],
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return (
            getFormItemProps({ data, focusArea }, 'filterOption') !== false
          );
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps({ data, focusArea }, 'optionFilterProp') ||
              'label'
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'optionFilterProp', value);
          }
        }
      }
    ]
  },
  {
    title: '远程搜索',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['select', 'multipleSelect']);
    },
    items: [
      {
        title: '支持搜索动态获取选项',
        type: 'Switch',
        description:
          '开启后配置接口，通过"search"参数动态返回{label, value}对象的列表作为下拉选项',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps(
              { data, focusArea },
              'dropdownSearchOption'
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'dropdownSearchOption', value);
          }
        }
      },
      {
        title: '内部接口选择',
        type: 'insideService',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return getFormItemProps({ data, focusArea }, 'dropdownSearchOption');
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'serviceContent');
          },
          set({ data, focusArea }: EditorResult<Data>, value: any) {
            setFormItemProps({ data, focusArea }, 'serviceContent', { id: value.id, title: value?.content.title });
          }
        }
      },
      {
        title: '编辑转换逻辑',
        descriptions: '使用代码编辑器编写数据转换逻辑',
        type: 'code',
        options: {
          theme: 'light',
          title: '接口数据格式化',
          language: 'javascript',
          comments: defaultCommentTrans,
          minimap: {
            enabled: false
          }
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return getFormItemProps({ data, focusArea }, 'dropdownSearchOption');
        },
        value: {
          get({ data, focusArea }) {
            return (
              getFormItemProps({ data, focusArea }, 'transOptScript') ||
              defaultTransOptScript
            );
          },
          set({ data, focusArea }, value: string) {
            setFormItemProps({ data, focusArea }, 'transOptScript', value);
          }
        }
      }
    ]
  },
  {
    title: '自定义空白内容',
    type: 'Switch',
    descriptions: '开启后，无数据时显示自定义内容',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, [
        'select',
        'multipleSelect',
        'tagsSelect'
      ]);
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return getFormItemProps(
          { data, focusArea },
          'useCustomNotFoundContent'
        );
      },
      set({ data, focusArea, slot }: EditorResult<Data>, value: boolean) {
        setFormItemProps(
          { data, focusArea },
          'useCustomNotFoundContent',
          value
        );
        const slotId =
          getFormItemProps(
            { data, focusArea },
            'customNotFoundContentSlotId'
          ) || uuid();
        if (value) {
          setFormItemProps(
            { data, focusArea },
            'customNotFoundContentSlotId',
            slotId
          );
          if (!slot.get(slotId)) {
            slot.add(slotId, '下拉框无数据时渲染内容');
          }
        }
        if (!value && slotId && slot.get(slotId)) {
          slot.remove(slotId);
        }
      }
    }
  }
];

export { SelectItemBaseEditor, SelctItemPowerEditor };
