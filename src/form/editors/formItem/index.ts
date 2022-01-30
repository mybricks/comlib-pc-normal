import { uuid, deepCopy } from '../../../utils';
import { Data, FormItemProps } from '../../runtime';
import { setFormModelSchema, uploadSubmitSchema } from '../../schema';
import { FormItemType } from '../../type';
import { addFormItem } from '../index';
import {
  defaultValidatorAnnotation,
  defaultValidatorExample,
  RuleKeys,
  getDefaultGroupStyle
} from '../../utils';
import inputNumberEditors from './inputNumber';
import {
  checkItemType,
  defaultValidateFn,
  getFormItem,
  getFormItemProps,
  setFormItemProps
} from './utils';
import btnItemEditors from './btnItem';
import codeStyleEditors from './codeStyleEditors';
import cascaderItemEditors from './cascader';
import datePickerItemEditors from './datePicker';
import timePickerItemEditors from './timePicker';
import { SelctItemPowerEditor, SelectItemBaseEditor } from './selectItem';
import { InputItemBaseEditor, InputItemPowerEditor } from './inputItem';
import { CheckboxItemBaseEditor } from './checkboxItem';
import { RadioItemBaseEditor } from './radioItem';
import { SwitchItemBaseEditor } from './switchItem';

function isValidator(type: FormItemType) {
  return ['dynamicItem', 'compositionItem'].includes(type);
}

const addBtn = ({
  data,
  output,
  input,
  text,
  btnType,
  idx
}: {
  data: FormItemProps;
  output: any;
  input: any;
  text?: string;
  btnType?: string;
  idx?: number;
}) => {
  const id = uuid();
  const title = text || '按钮';
  const schema = { type: 'follow' }
  const defaultBtn = {
    id,
    title,
    btnType: btnType || 'link',
    size: 'middle',
    idx
  };
  output.add(id, title, schema);
  data.tailBtns.push({ ...defaultBtn });
};

export default {
  '[data-item-type=formItem]': ({ }, ...editorList) => {
    editorList[0].title = '表单项';
    editorList[0].items = [
      {
        title: '标题',
        type: 'Text',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return !checkItemType({ data, focusArea }, ['slotItem']);
        },
        value: {
          set(
            { data, focusArea, output, input }: EditorResult<Data>,
            value: string
          ) {
            setFormItemProps({ data, focusArea }, 'label', value);
            setFormModelSchema({ data, output, input });
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'label');
          }
        }
      },
      {
        title: '显示标题',
        type: 'switch',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'showLabel', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'showLabel') !== false;
          }
        }
      },
      {
        title: '字段',
        type: 'Text',
        description: '表单提交时的字段值，多数情况下应与接口所需字段对应',
        // ifVisible({ data, focusArea }: EditorResult<Data>) {
        //   return !checkItemType({ data, focusArea }, ['slotItem']);
        // },
        value: {
          set(
            { data, focusArea, output, input }: EditorResult<Data>,
            value: string
          ) {
            setFormItemProps({ data, focusArea }, 'name', value);
            setFormModelSchema({ data, output, input });
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'name');
          }
        }
      },
      {
        title: '类型',
        type: 'Select',
        description: '表单项的类型',
        options: [
          { label: '输入框', value: 'inputText' },
          { label: '密码框', value: 'inputPassword' },
          { label: '数字输入框', value: 'inputNumber' },
          { label: '文本域', value: 'inputTextarea' },
          { label: '下拉框', value: 'select' },
          { label: '多选下拉框', value: 'multipleSelect' },
          { label: '标签多选框', value: 'tagsSelect' },
          { label: '时间选择框', value: 'timePicker' },
          { label: '时间范围选择框', value: 'timeRangePicker' },
          { label: '日期选择框', value: 'datePicker' },
          { label: '日期范围选择框', value: 'rangePicker' },
          { label: '开关', value: 'switch' },
          { label: '分组', value: 'group' },
          { label: '单选框', value: 'radio' },
          { label: '多选框', value: 'checkbox' },
          { label: '级联选择', value: 'cascader' },
          { label: '动态表单项', value: 'dynamicItem' },
          { label: '组合表单项', value: 'compositionItem' },
          { label: '代码编辑器', value: 'codeEditor' },
          { label: '全局自定义插槽', value: 'slotItem' },
          { label: '局部自定义插槽', value: 'slotItemWithLabel' }
        ],
        value: {
          set(
            { data, focusArea, output, input, slot }: EditorResult<Data>,
            value: FormItemType
          ) {
            if (!focusArea) return;
            const item = data.formItems[~~focusArea.dataset.itemIndex];
            const checkPlaceholder =
              ['select', 'multipleSelect', 'dynamicItem'].includes(value) &&
              item.placeholder.indexOf('输入');
            const fieldsValue = JSON.parse(data.fieldsValue);

            if (checkPlaceholder) {
              item.placeholder = item.placeholder.replace(/输入/g, '选择');
            } else if (value === 'datePicker') {
              item.picker = 'date';
              item.placeholder = '请选择日期';
            } else if (value === 'rangePicker') {
              item.picker = 'date';
              item.placeholder = '开始日期,结束日期';
            } else if (value === 'timePicker') {
              item.placeholder = '请选择时间';
            } else if (value === 'timeRangePicker') {
              item.placeholder = '开始时间,结束时间';
            }

            if (value === 'dynamicItem') {
              item['dynamicItemAction'] = { title: '', type: 'default' };
              item['fieldsFormItems'] = [];
              addFormItem(item.fieldsFormItems, 'dynamicItem');
            }

            if (value === 'compositionItem') {
              item['compositionItems'] = [];
              addFormItem(item.compositionItems);
            }

            if (value === 'select') {
              item.dropdownMatchSelectWidth = true;
              item.dropdownShowArrow = true;
            }

            if (value === 'slotItem' || value === 'slotItemWithLabel') {
              const slotId = uuid();
              item['slotId'] = slotId;
              slot.add(slotId, '自定义内容', {
                schema: 'fangzhou.normal-pc.form-slot-item:1.0'
              });
              const outputId = uuid();
              item.slotConfig = Object.assign(item.slotConfig || {}, {
                outputId
              });
              output.add(outputId, `${item.label} 自定义插槽内容刷新`, { type: 'any' });
            } else {
              if (slot.get(item.slotId)) {
                slot.remove(item.slotId);
                item.slotId = '';
              }
              if (item.slotConfig?.outputId) {
                output.remove(item.slotConfig.outputId);
                item.slotConfig.outputId = undefined;
              }
            }

            data.formRef?.current?.setFieldsValue({
              [item.name]: undefined
            });

            fieldsValue[item.name] = undefined;
            item.useInitialValue = false;

            item.type = value;
            data.fieldsValue = JSON.stringify(fieldsValue);
            setFormModelSchema({ data, output, input });
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;

            return data.formItems[~~focusArea.dataset.itemIndex]?.type;
          }
        }
      },
      {
        title: '宽度',
        type: 'Slider',
        options: {
          max: 24,
          min: 1,
          steps: 1,
          formatter: '/24'
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: number) {
            if (!focusArea) return;
            const item = data.formItems[~~focusArea.dataset.itemIndex];
            const span = (24 / data.columnCount).toFixed(0);
            if (value) {
              item['span'] = value;
            } else {
              item['span'] = ~~span;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            // (24 / data.columnCount).toFixed(0)
            if (!focusArea) return;
            const item = data.formItems[~~focusArea.dataset.itemIndex];
            let span = ~~(24 / data.columnCount).toFixed(0);
            if (item && item.span) {
              span = item.span;
            }

            return span;
          }
        }
      },
      {
        title: '输入框尺寸',
        type: 'Select',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'middle' },
          { label: '小', value: 'small' },
          { label: '自定义', value: 'default' }
        ],
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return !checkItemType({ data, focusArea }, [
            'switch',
            'checkbox',
            'slotItem'
          ]);
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'size', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'size');
          }
        }
      },
      {
        title: '宽度',
        type: 'Text',
        options: {
          type: 'number'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          return (
            item &&
            !['switch', 'checkbox', 'slotItem'].includes(item.type) &&
            item.size === 'default'
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'width', Number(value));
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'width');
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        description: '该提示会在输入字段为空时在表单项内显示',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return !checkItemType({ data, focusArea }, [
            'switch',
            'radio',
            'slotItem'
          ]);
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'placeholder', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'placeholder');
          }
        }
      },
      {
        title: '标题提示',
        type: 'Text',
        description: '展示在标题后面的额外提示内容',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          return item && item.type !== 'slotItem';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'tooltip', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'tooltip');
          }
        }
      },
      {
        title: '提示描述',
        type: 'Text',
        description: '展示在表单项下方的提示内容',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          return item && item.type !== 'slotItem';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'description', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'description');
          }
        }
      },
      {
        title: '备注信息',
        items: [
          {
            title: '前置文案',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                setFormItemProps({ data, focusArea }, 'preCopy', value);
              },
              get({ data, focusArea }: EditorResult<Data>) {
                return getFormItemProps({ data, focusArea }, 'preCopy');
              }
            }
          },
          {
            title: '后置文案',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                setFormItemProps({ data, focusArea }, 'postCopy', value);
              },
              get({ data, focusArea }: EditorResult<Data>) {
                return getFormItemProps({ data, focusArea }, 'postCopy');
              }
            }
          }
        ]
      },
      ...InputItemBaseEditor,
      ...SelectItemBaseEditor,
      ...CheckboxItemBaseEditor,
      ...RadioItemBaseEditor,
      ...SwitchItemBaseEditor,
      ...timePickerItemEditors,
      ...datePickerItemEditors,
      ...cascaderItemEditors,
      ...inputNumberEditors,
      ...codeStyleEditors,
      {
        title: '额外内容',
        items: [
          {
            title: '后置按钮',
            type: 'Switch',
            value: {
              get({ data, focusArea }) {
                if (!focusArea) return;
                const item = data.formItems[~~focusArea.dataset.itemIndex];
                return item?.showTailBtn;
              },
              set({ data, focusArea, output, input }, value: boolean) {
                if (!focusArea) return;
                const item = data.formItems[~~focusArea.dataset.itemIndex];
                item.showTailBtn = value;
                item.tailBtns = item.tailBtns || [];
                if (value && item.tailBtns.length === 0) {
                  addBtn({ data: item, output, input, idx: focusArea?.index });
                } else if (!value) {
                  item.tailBtns = [];
                }
              }
            }
          }
        ]
      },
      {
        title: '不可操作',
        type: 'Switch',
        description: '是否禁用表单项，若被禁用该表单项将不可使用不可点击',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          return item && item.type !== 'slotItem';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'disabled', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'disabled');
          }
        }
      },
      {
        title: '校验反馈图标',
        type: 'Switch',
        description: '支持显示校验反馈图标',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, ['inputText']);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'supportValidateIcon');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'supportValidateIcon', value);
          }
        }
      },
      {
        title: '编辑规则',
        type: 'code',
        options: {
          theme: 'light',
          title: '编辑规则',
          minimap: {
            enabled: false
          }
        },
        ifVisible({ data, focusArea }) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          return item?.supportValidateIcon;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = data.formItems[~~focusArea.dataset.itemIndex];
            return item?.validateCode || defaultValidateFn;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const item = data.formItems[~~focusArea.dataset.itemIndex];
            item.validateCode = value;
          }
        }
      },
      {
        title: '表单项校验',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.formItems[~~focusArea.dataset.itemIndex];
          if (item && isValidator(item.type)) {
            return false;
          }
          return item && item.type !== 'slotItem';
        },
        items: [
          {
            title: '必填',
            type: 'Switch',
            description: '该字段是否必填, 展示必填样式',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = data.formItems[~~focusArea.dataset.itemIndex];
              return (
                item &&
                !item.useCodeValidator &&
                !item.isRequired &&
                ['inputText', 'inputPassword', 'inputTextarea'].includes(
                  item.type
                )
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;

                const item = data.formItems[~~focusArea.dataset.itemIndex];
                item.isNewRequired = value;
                const preRules = item.rules || [];

                if (value) {
                  item.blocksValidator = item.blocksValidator || {};
                  if (!item.rules) {
                    item.rules = [];
                  }
                  item.rules = preRules.filter((i) => i !== RuleKeys.REQUIRED);
                  item.rules?.push(RuleKeys.REQUIRED);
                } else {
                  item.rules = preRules.filter((i) => i !== RuleKeys.REQUIRED);
                }
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                return data.formItems[~~focusArea.dataset.itemIndex]
                  ?.isNewRequired;
              }
            }
          },
          {
            title: '必填样式',
            type: 'Switch',
            description: '是否显示必填样式',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = data.formItems[~~focusArea.dataset.itemIndex];
              return item.isNewRequired;
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = data.formItems[~~focusArea.dataset.itemIndex];
                return !item.hideRequiredStyle;
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const item = data.formItems[~~focusArea.dataset.itemIndex];
                item.hideRequiredStyle = !value;
              }
            }
          },
          {
            title: '代码校验',
            type: 'Switch',
            description: '对该表单项进行校验',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = data.formItems[~~focusArea.dataset.itemIndex];
              if (item && isValidator(item.type)) {
                return false;
              }
              return item && item.type !== 'slotItem';
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;

                const item = data.formItems[~~focusArea.dataset.itemIndex];

                if (value) {
                  item.blocksValidator = item.blocksValidator || {};
                }

                item.useCodeValidator = value;
                item.isRequired = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;

                return (
                  data.formItems[~~focusArea.dataset.itemIndex]
                    ?.useCodeValidator ||
                  data.formItems[~~focusArea.dataset.itemIndex]?.isRequired
                );
              }
            }
          },
          {
            title: '编辑校验规则',
            type: 'code',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = data.formItems[~~focusArea.dataset.itemIndex];
              if (item && isValidator(item.type)) {
                return false;
              }
              return item && (item.useCodeValidator || item.isRequired);
            },
            options: {
              theme: 'light',
              title: '编辑校验规则',
              comments: defaultValidatorAnnotation,
              minimap: {
                enabled: false
              }
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return (
                  getFormItemProps({ data, focusArea }, 'validator') ||
                  defaultValidatorExample
                );
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                setFormItemProps({ data, focusArea }, 'validator', value);
              }
            }
          }
        ]
      },
      {
        title: '上移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea || data.formItems.length <= 1) return;
          return ~~focusArea.dataset.itemIndex !== 0;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea || data.formItems.length <= 1) return;
            if (~~focusArea.dataset.itemIndex < 1) return;

            const currentFormItem =
              data.formItems[~~focusArea.dataset.itemIndex];
            const previousFormItem =
              data.formItems[~~focusArea.dataset.itemIndex - 1];
            data.formItems[~~focusArea.dataset.itemIndex - 1] = currentFormItem;
            data.formItems[~~focusArea.dataset.itemIndex] = previousFormItem;
          }
        }
      },
      {
        title: '下移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea || data.formItems.length <= 1) return;
          return ~~focusArea.dataset.itemIndex + 1 !== data.formItems.length;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea || data.formItems.length <= 1) return;
            if (~~focusArea.dataset.itemIndex === data.formItems.length - 1)
              return;

            const currentFormItem =
              data.formItems[~~focusArea.dataset.itemIndex];
            const nextFormItem =
              data.formItems[~~focusArea.dataset.itemIndex + 1];
            data.formItems[~~focusArea.dataset.itemIndex + 1] = currentFormItem;
            data.formItems[~~focusArea.dataset.itemIndex] = nextFormItem;
          }
        }
      },
      {
        title: '删除表单项',
        type: 'Button',
        ifVisible({ data }: EditorResult<Data>) {
          return !(data.formItems.length <= 1);
        },
        value: {
          set({ data, focusArea, output, input, slot }: EditorResult<Data>) {
            if (!focusArea || data.formItems.length <= 1) return;
            const matchMap = deepCopy(data.matchMap);
            const currentFormItem =
              data.formItems[~~focusArea.dataset.itemIndex];
            if (currentFormItem) {
              const { key, slotId } = currentFormItem;
              if (slotId && slot.get(slotId)) {
                slot.remove(slotId);
              }
              Object.keys(matchMap).forEach((i) => {
                if (i.indexOf(key) !== -1) {
                  delete matchMap[i];
                } else {
                  matchMap[i] = matchMap[i].filter(
                    (i) => i.indexOf(key) === -1
                  );
                }
              });
            }
            if (
              currentFormItem.type === 'upload' &&
              currentFormItem.uploadConfig
            ) {
              output.remove(currentFormItem.uploadConfig?.outputId);
              input.remove(currentFormItem.uploadConfig?.inputId);
            }
            if (currentFormItem.slotConfig?.outputId) {
              output.remove(currentFormItem.slotConfig.outputId);
              currentFormItem.slotConfig.outputId = undefined;
            }

            data.formItems.splice(~~focusArea.dataset.itemIndex, 1);
            setFormModelSchema({ data, output, input });
            data.matchMap = matchMap;
          }
        }
      }
    ];

    editorList[1].title = '样式';
    editorList[1].items = [
      {
        title: '标题样式',
        type: 'Character',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const item = getFormItem({ data, focusArea });
            if (item.type === 'group' && !item.titleStyle) {
              item.titleStyle = getDefaultGroupStyle();
            }
            return item?.titleStyle;
          },
          set({ data, focusArea }: EditorResult<Data>, value) {
            setFormItemProps({ data, focusArea }, 'titleStyle', value);
          }
        }
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [
          { title: '上', min: 0, max: 50, width: 50 },
          { title: '下', min: 0, max: 50, width: 50 },
          { title: '左', min: 0, max: 50, width: 50 },
          { title: '右', min: 0, max: 50, width: 50 }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const defaultMargin = [
              0, 24, 0, data.layout === 'inline' ? 16 : 0
            ]
            const cusMargin = getFormItemProps({ data, focusArea }, 'cusMargin')

            return cusMargin || defaultMargin
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            setFormItemProps({ data, focusArea }, 'cusMargin', value);
          }
        }
      }
    ];

    editorList[2].title = '高级';
    editorList[2].items = [...InputItemPowerEditor, ...SelctItemPowerEditor];

    return {
      title: '表单项'
    };
  },
  ...btnItemEditors
};
