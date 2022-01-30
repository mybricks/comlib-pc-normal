import {
  Data,
  DynamicItemLabelShowType,
  DescriptionPositionType,
  DescriptionShowProgram
} from '../runtime';
import { addFormItem } from './index';
import { setFormModelSchema } from '../schema';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ButtonType } from 'antd/es/button';
import {
  getFormItemIndex,
  getFieldItemIndex,
  buttonTypeOptions,
  defaultValidatorExample,
  RuleKeys,
  defaultValidatorAnnotation
} from '../utils';
import { deepCopy, uuid } from '../../utils';
import { getValidatorScratchConfig } from '../rules';
import inputNumberEditors from './formItem/inputNumber';

const dynamicForm = {
  '[data-item-dynamic="0"]': {
    title: '动态表单',
    items: [
      {
        title: '文案显示类型',
        type: 'Select',
        options: [
          { value: 'default', label: '默认' },
          { value: 'index', label: '序号' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicItemLabelShowType || 'default';
          },
          set(
            { data, focusArea }: EditorResult<Data>,
            value: DynamicItemLabelShowType
          ) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            formItem['dynamicItemLabelShowType'] = value;
          }
        }
      },
      {
        title: '长度限制',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicItemLength;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            const length = formItem.dynamicItemLength
              ? formItem.dynamicItemLength
              : 1;
            formItem['dynamicItemLength'] = value ? length : void 0;
          }
        }
      },
      {
        title: '长度',
        type: 'Slider',
        description: '可添加表单项数量',
        options: [{ max: 99, min: 1, steps: 1, formatter: '行' }],
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const index = getFormItemIndex(focusArea);
          const formItem = data.formItems[index];
          return !!formItem.dynamicItemLength;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicItemLength || 1;
          },
          set({ data, focusArea }: EditorResult<Data>, value: number) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            formItem['dynamicItemLength'] = value;
          }
        }
      },
      {
        title: '值拷贝',
        type: 'Switch',
        description: '是否提供该表单项的复制功能',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            if (data.formItems[index].fieldsActions) {
              return data.formItems[index].fieldsActions?.includes('copy');
            } else {
              data.formItems[index]['fieldsActions'] = [];
              return false;
            }
          },
          set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
            const index = getFormItemIndex(focusArea);
            const fieldsActions: 'copy'[] =
              data.formItems[index].fieldsActions || [];

            if (value) {
              fieldsActions.push('copy');
              data.formItems[index].copyOutputId = uuid();
              const paramRules = { title: '表单项内容复制', type: 'object', properties: {} };
              output.add(
                data.formItems[index].copyOutputId,
                `复制${index}`,
                paramRules
              );
            } else {
              const copyIndex: number = fieldsActions.findIndex(
                (v: string) => v === 'copy'
              );
              fieldsActions.splice(copyIndex, 1);
              output.remove(data.formItems[index].copyOutputId);
            }

            data.formItems[index]['fieldsActions'] = fieldsActions;
          }
        }
      },
      {
        title: '备注位置',
        type: 'Select',
        options: [
          { value: 'top', label: '上' },
          { value: 'right', label: '右' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.descriptionPosition || 'right';
          },
          set(
            { data, focusArea }: EditorResult<Data>,
            value: DescriptionPositionType
          ) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            formItem['descriptionPosition'] = value;
          }
        }
      },
      {
        title: '备注显示策略',
        type: 'Select',
        options: [
          { value: 'default', label: '默认' },
          { value: 'first', label: '首行' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicdItemDscriptionShowProgram || 'default';
          },
          set(
            { data, focusArea }: EditorResult<Data>,
            value: DescriptionShowProgram
          ) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            formItem['dynamicdItemDscriptionShowProgram'] = value;
          }
        }
      },
      {
        title: '添加表单项',
        type: 'Button',
        value: {
          set({ data, focusArea, output, input }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            const fieldsFormItems = [...data.formItems[index].fieldsFormItems];
            addFormItem(fieldsFormItems, 'dynamicItem');
            data.formItems[index].fieldsFormItems = [...fieldsFormItems];
            setFormModelSchema({ data, output, input });
          }
        }
      }
    ]
  }
};
const dynamicFormItem = {
  '[data-item-type=dynamicFormItem]': {
    title: '动态表单项',
    items: [
      {
        title: '标题名称',
        type: 'Text',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].label = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;

            const index = getFormItemIndex(focusArea);
            return data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].label;
          }
        }
      },
      {
        title: '字段名称',
        type: 'Text',
        description: '表单提交时的字段值，多数情况下应与接口所需字段对应',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].name = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            return data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].name;
          }
        }
      },
      {
        title: '表单类型',
        type: 'Select',
        options: [
          { label: '输入框(文字)', value: 'inputText' },
          { label: '输入框(数字)', value: 'inputNumber' },
          { label: '下拉框', value: 'select' },
          { label: '多选下拉框', value: 'multipleSelect' },
          { label: '标签多选框', value: 'tagsSelect' }
        ],
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            if (
              ['select', 'multipleSelect', 'dynamicItem'].includes(value) &&
              item.placeholder.indexOf('输入')
            ) {
              item.placeholder = item.placeholder.replace(/输入/g, '选择');
            }
            item.type = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            return data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].type;
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        description: '该提示会在输入字段为空时在表单项内显示',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const index = getFormItemIndex(focusArea);
          const item =
            data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
          return item && !['switch', 'checkbox'].includes(item.type);
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            item.placeholder = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            return item.placeholder;
          }
        }
      },
      ...inputNumberEditors,
      {
        title: '备注信息',
        type: 'Text',
        description: '展示在表单项右方的文本',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const fieldsFormItems = {
              ...data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ]
            };
            fieldsFormItems.mark = value;
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ] = { ...fieldsFormItems };
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            return data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ].mark;
          }
        }
      },
      {
        title: '表单尺寸',
        type: 'Select',
        options: [
          { label: '默认', value: 'large' },
          // { label: '中', value: 'default' },
          // { label: '小', value: 'small' },
          { label: '自定义', value: 'custom' }
        ],
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: SizeType) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            item.size = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            return item.size;
          }
        }
      },
      {
        title: '宽度',
        type: 'Text',
        options: {
          type: 'number'
        },
        ifVisible({ data, focusArea }) {
          if (!focusArea) return;
          const index = getFormItemIndex(focusArea);
          const item =
            data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
          return item.size === 'custom';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: SizeType) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            item.width = Number(value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            return item.width;
          }
        }
      },
      {
        title: '清除内容图标',
        type: 'Switch',
        description: '开启后可点清除内容',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const index = getFormItemIndex(focusArea);
          const item =
            data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];

          return item && ['inputText', 'select'].includes(item.type);
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];

            item.allowClear = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];

            return item.allowClear;
          }
        }
      },
      {
        title: '默认不可操作',
        type: 'Switch',
        description: '是否在表单初始化时默认禁用该表单项',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;

            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            item.disabled = value;
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;

            const index = getFormItemIndex(focusArea);
            const item =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            return item.disabled;
          }
        }
      },
      // {
      //   title: '启用校验',
      //   type: 'Switch',
      //   description: '该表单项是否必须有值',
      //   value: {
      //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];

      //       if (value) {
      //         item.blocksValidator = item.blocksValidator || {};
      //       }

      //       item.isRequired = value;
      //     },
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];

      //       return item.isRequired;
      //     }
      //   }
      // },
      // {
      //   title: '编辑校验规则',
      //   type: 'scratch',
      //   options: {
      //     blocks: [...validatorBlocks, ...blocks()]
      //   },
      //   ifVisible({ data, focusArea }: EditorResult<Data>) {
      //     if (!focusArea) return;

      //     const index = getFormItemIndex(focusArea);
      //     const item =
      //       data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
      //     return item && item.isRequired;
      //   },
      //   value: {
      //     set({ data, focusArea }: EditorResult<Data>, value: any[]) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];

      //       const { vars, xml } = value[0];
      //       item.blocksValidator = {
      //         vars,
      //         xml,
      //         script: value[0].script
      //       };
      //     },
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];
      //       const blocksOri = item.blocksValidator || {};

      //       return getValidatorScratchConfig({
      //         formItem: item,
      //         blocksOri,
      //         formItems: data.formItems
      //       });
      //     }
      //   }
      // },
      // {
      //   title: '代码校验',
      //   type: 'Switch',
      //   ifVisible({ data, focusArea }: EditorResult<Data>) {
      //     if (!focusArea) return;
      //     const index = getFormItemIndex(focusArea);
      //     const item =
      //       data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];

      //     return item && item.isRequired;
      //   },
      //   value: {
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];

      //       return item.useCodeValidator;
      //     },
      //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
      //       if (!focusArea) return;
      //       const index = getFormItemIndex(focusArea);
      //       const item =
      //         data.formItems[index].fieldsFormItems[
      //           getFieldItemIndex(focusArea)
      //         ];

      //       item.useCodeValidator = value;
      //     }
      //   }
      // },
      {
        title: '表单项校验',
        items: [
          {
            title: "必填",
            type: "Switch",
            description: '该字段是否必填',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const index = getFormItemIndex(focusArea);
              const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                item.isNewRequired = value;
                const preRules = item.rules || [];
                if (value) {
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
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                return item.isNewRequired;
              },
            }
          },
          // {
          //   title: '隐藏必填样式',
          //   type: 'Switch',
          //   ifVisible({ data, focusArea }: EditorResult<Data>) {
          //     if (!focusArea) return;
          //     const index = getFormItemIndex(focusArea);
          //     const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
          //     return item?.isNewRequired
          //   },
          //   value: {
          //     get({ data, focusArea }: EditorResult<Data>) {
          //       if (!focusArea) return
          //       const index = getFormItemIndex(focusArea);
          //       const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
          //       return item?.hideRequiredStyle
          //     },
          //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          //       if (!focusArea) return
          //       const index = getFormItemIndex(focusArea);
          //       const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
          //       item.hideRequiredStyle = value
          //     }
          //   }
          // },
          {
            title: '最大字数限制',
            type: 'Slider',
            options: [
              {
                min: 0,
                steps: 10,
                max: 1000
              },
            ],
            description: '最大字数限制',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const index = getFormItemIndex(focusArea);
              const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: number) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                item.maxLength = value === 0 ? undefined : value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                return item?.maxLength;
              },
            },
          },
          {
            title: '最小字数限制',
            type: 'Slider',
            options: [
              {
                min: 0,
                steps: 10,
              },
            ],
            description: '最小字数限制',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;

              const index = getFormItemIndex(focusArea);
              const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: number) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                item.minLength = value === 0 ? undefined : value;
                const preRules = item.rules || [];
                if (value) {
                  if (!item.rules) {
                    item.rules = [];
                  }
                  item.rules = preRules.filter((i) => i !== RuleKeys.MIN);
                  item.rules.push(RuleKeys.MIN);
                } else {
                  item.rules = preRules.filter((i) => i !== RuleKeys.MIN);
                }
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                return item?.minLength;
              },
            },
          },
          {
            title: '代码校验',
            type: 'Switch',
            description: '编写代码对该表单进行校验',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                if (value) {
                  item.blocksValidator = item.blocksValidator || {};
                }

                item.useCodeValidator = value;
                item.isRequired = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];

                return item.useCodeValidator || item.isRequired;
              },
            }
          },
          {
            title: '编辑校验规则',
            type: 'Code',
            options: {
              title: '编辑校验规则',
              language: 'javascript',
              width: 600,
              minimap: {
                enabled: false,
              },
            },
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const index = getFormItemIndex(focusArea);
              const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];

              return item && (item.useCodeValidator || item.isRequired);
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                item.validator = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const index = getFormItemIndex(focusArea);
                const item = data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
                return item.validator || defaultValidatorExample;
              },
            },
          }
        ]
      },
      {
        title: '左移',
        type: 'Button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            if (!focusArea || data.formItems[index].fieldsFormItems.length <= 1)
              return;
            if (getFieldItemIndex(focusArea) < 1) return;

            const currentFormItem =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            const previousFormItem =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea) - 1
              ];
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea) - 1
            ] = currentFormItem;
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ] = previousFormItem;
          }
        }
      },
      {
        title: '右移',
        type: 'Button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            if (!focusArea || data.formItems[index].fieldsFormItems.length <= 1)
              return;
            if (
              getFieldItemIndex(focusArea) ===
              data.formItems[index].fieldsFormItems.length - 1
            )
              return;

            const currentFormItem =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ];
            const nextFormItem =
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea) + 1
              ];
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea) + 1
            ] = currentFormItem;
            data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
            ] = nextFormItem;
          }
        }
      },
      {
        title: '删除表单项',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const index = getFormItemIndex(focusArea);
          return data.formItems[index].fieldsFormItems.length > 1;
        },
        value: {
          set({ data, focusArea, input, output }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            if (!focusArea || data.formItems[index].fieldsFormItems.length <= 1)
              return;
            const matchMap = deepCopy(data.matchMap);
            if (
              data.formItems[index].fieldsFormItems[
              getFieldItemIndex(focusArea)
              ]
            ) {
              const { key } =
                data.formItems[index].fieldsFormItems[
                getFieldItemIndex(focusArea)
                ];
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
            data.matchMap = matchMap;
            data.formItems[index].fieldsFormItems.splice(
              getFieldItemIndex(focusArea),
              1
            );
            setFormModelSchema({ data, output, input });
          }
        }
      }
    ]
  }
};

const dynamicItemAction = {
  '[data-form-item-type=dynamicItemAction]': {
    title: '操作',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicItemAction?.title || formItem.label;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            if (formItem.dynamicItemAction) {
              formItem.dynamicItemAction.title = value;
            }
          }
        }
      },
      {
        title: '类型',
        type: 'Select',
        options: buttonTypeOptions,
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            return formItem.dynamicItemAction?.type || 'default';
          },
          set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
            if (!focusArea) return;
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            if (formItem.dynamicItemAction) {
              formItem.dynamicItemAction.type = value;
            }
          }
        }
      }
    ]
  }
};

export default {
  ...dynamicForm,
  ...dynamicFormItem,
  ...dynamicItemAction
};
