import { Data, DescriptionPositionType } from '../runtime';
import { addFormItem } from './index';
import { setFormModelSchema } from '../schema';
import {
  getFormItemIndex,
  getFormItemType,
  getCompositionItemIndex,
  getCompositionItems,
  getCompositionItem,
  getRadioKey,
  RuleKeys,
  defaultValidatorAnnotation,
  defaultValidatorExample
} from '../utils';
import { deepCopy } from '../../utils';
import { FormItemType } from '../type';
import { getValidatorScratchConfig } from '../rules';
import inputNumberEditors from './formItem/inputNumber';

export default {
  '[data-item-type=composition]': {
    title: '组合表单',
    items: [
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
        title: '添加表单项',
        type: 'Button',
        value: {
          set({ data, focusArea, output, input }: EditorResult<Data>) {
            const index = getFormItemIndex(focusArea);
            const formItem = data.formItems[index];
            let compositionItems = formItem.compositionItems || [];
            const itemType = getFormItemType(focusArea);

            if (itemType === 'radio') {
              const radioKey = getRadioKey(focusArea);
              if (typeof formItem.radioCompositionItems === 'undefined') {
                formItem.radioCompositionItems = {};
              }
              compositionItems = formItem.radioCompositionItems[radioKey];
              addFormItem(compositionItems);
              formItem.radioCompositionItems[radioKey] = [...compositionItems];
            } else {
              addFormItem(compositionItems);
              data.formItems[index].compositionItems = [...compositionItems];
            }

            setFormModelSchema({ data, output, input });
          }
        }
      }
    ]
  },
  '[data-item-type=compositionItem]': {
    title: '组合表单项',
    items: [
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '输入框', value: 'inputText' },
          { label: '数字输入框', value: 'inputNumber' },
          { label: '选择框', value: 'select' },
          { label: '固定文本', value: 'text' },
          { label: '日期选择框', value: 'datePicker' }
        ],
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: FormItemType) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);

            if (
              ['select', 'multipleSelect', 'dynamicItem'].includes(value) &&
              compositionItem?.placeholder.indexOf('输入')
            ) {
              compositionItem.placeholder = compositionItem.placeholder.replace(
                /输入/g,
                '选择'
              );
            }

            if (compositionItem) {
              compositionItem.type = value;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);

            return compositionItem?.type;
          }
        }
      },
      {
        title: '字段',
        type: 'Text',
        description: '表单提交时的字段值，多数情况下应与接口所需字段对应',
        value: {
          set(
            { data, focusArea, output, input }: EditorResult<Data>,
            value: string
          ) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.name = value;
              setFormModelSchema({ data, output, input });
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            return compositionItem?.name;
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        description: '该提示会在输入字段为空时在表单项内显示',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const compositionItem = getCompositionItem(data, focusArea);

          return compositionItem?.type !== 'text';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.placeholder = value;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            return compositionItem?.placeholder;
          }
        }
      },
      // {
      //   title: '备注信息',
      //   type: 'Text',
      //   description: '表单提交时的字段值，多数情况下应与接口所需字段对应',
      //   value: {
      //     set({ data, focusArea }: EditorResult<Data>, value: string) {
      //       if (!focusArea) return;
      //       const compositionItem = getCompositionItem(data, focusArea);
      //       if (compositionItem) {
      //         compositionItem.description = value;
      //       }
      //     },
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;
      //       const compositionItem = getCompositionItem(data, focusArea);
      //       return compositionItem?.description;
      //     }
      //   }
      // },
      {
        title: '备注信息',
        items: [
          {
            title: '前置标签',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                compositionItem.addonBefore = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                return compositionItem?.addonBefore;
              }
            }
          },
          {
            title: '后置标签',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                compositionItem.addonAfter = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                return compositionItem?.addonAfter;
              }
            }
          },
          {
            title: '前置文案',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                compositionItem.preCopy = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                return compositionItem?.preCopy;
              }
            }
          },
          {
            title: '后置文案',
            type: 'Text',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                compositionItem.postCopy = value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                return compositionItem?.postCopy || compositionItem?.description ;
              }
            }
          },
        ]
      },
      ...inputNumberEditors,
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
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.size = value;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            return compositionItem?.size;
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
          const compositionItem = getCompositionItem(data, focusArea);
          return compositionItem?.size === 'custom';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string | number) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.width = Number(value);
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            return compositionItem?.width;
          }
        }
      },
      {
        title: '清除内容图标',
        type: 'Switch',
        description: '开启后可点清除内容',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const compositionItem = getCompositionItem(data, focusArea);
          return (
            compositionItem &&
            ['inputText', 'select'].includes(compositionItem.type)
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.allowClear = value;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);

            return compositionItem?.allowClear;
          }
        }
      },
      {
        title: '不可操作',
        type: 'Switch',
        description: '是否禁用表单项，若被禁用该表单项将不可使用不可点击',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const compositionItem = getCompositionItem(data, focusArea);

          return compositionItem?.type !== 'text';
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            if (compositionItem) {
              compositionItem.disabled = value;
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItem = getCompositionItem(data, focusArea);
            return compositionItem?.disabled;
          }
        }
      },
      {
        title: "表单项校验",
        items: [
          {
            title: '必填',
            type: 'Switch',
            description: '该字段是否必填',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = getCompositionItem(data, focusArea);
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const item = getCompositionItem(data, focusArea);
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
                const item = getCompositionItem(data, focusArea);
                return item.isNewRequired;
              },
            },
          },
          // {
          //   title: '隐藏必填样式',
          //   type: 'Switch',
          //   ifVisible({ data, focusArea }: EditorResult<Data>) {
          //     if (!focusArea) return
          //     const item = getCompositionItem(data, focusArea);
          //     return item.isNewRequired;
          //   },
          //   value: {
          //     get({ data, focusArea }: EditorResult<Data>) {
          //       if (!focusArea) return
          //       const item = getCompositionItem(data, focusArea);
          //       return item.hideRequiredStyle
          //     },
          //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          //       if (!focusArea) return
          //       const item = getCompositionItem(data, focusArea);
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
              const item = getCompositionItem(data, focusArea);
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: number) {
                if (!focusArea) return;
                const item = getCompositionItem(data, focusArea);
                item.maxLength = value === 0 ? undefined : value;
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getCompositionItem(data, focusArea);
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
              const item = getCompositionItem(data, focusArea);
              return (
                item &&
                (!item.useCodeValidator && !item.isRequired) &&
                ['inputText'].includes(item.type)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: number) {
                if (!focusArea) return;
                const item = getCompositionItem(data, focusArea);
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
                const item = getCompositionItem(data, focusArea);

                return item?.minLength;
              },
            },
          },
          {
            title: '代码校验',
            type: 'Switch',
            description: '编写代码对该表单项进行校验, 默认进行不为空校验',
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;

                const compositionItem = getCompositionItem(data, focusArea);
                if (compositionItem) {
                  if (value) {
                    compositionItem.blocksValidator = compositionItem.blocksValidator || {};
                  }
                  compositionItem.useCodeValidator = value;
                  compositionItem.isRequired = value;
                }
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);
                return compositionItem?.useCodeValidator || compositionItem?.isRequired;
              },
            },
          },
          {
            title: '编辑校验规则',
            type: 'Code',
            options: {
              language: 'javascript',
              title: '编辑校验规则',
              width: 600,
              minimap: {
                enabled: false,
              },
            },
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const compositionItem = getCompositionItem(data, focusArea);

              return (
                compositionItem && (compositionItem.useCodeValidator || compositionItem.isRequired)
              );
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);

                if (compositionItem) {
                  compositionItem.validator = value;
                }
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const compositionItem = getCompositionItem(data, focusArea);

                return compositionItem?.validator || defaultValidatorExample;
              },
            },
          },
        ]
      },
      // {
      //   title: '启用校验',
      //   type: 'Switch',
      //   description: '对该表单项进行校验，默认进行不可为空校验',
      //   value: {
      //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
      //       if (!focusArea) return;

      //       const compositionItem = getCompositionItem(data, focusArea);
      //       if (compositionItem) {
      //         if (value) {
      //           compositionItem.blocksValidator =
      //             compositionItem.blocksValidator || {};
      //         }
      //         compositionItem.isRequired = value;
      //       }
      //     },
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;

      //       const compositionItem = getCompositionItem(data, focusArea);
      //       return compositionItem?.isRequired;
      //     }
      //   }
      // },
      // {
      //   title: '编辑校验规则',
      //   type: 'Code',
      //   options: {
      //     language: 'javascript',
      //     title: '编辑校验规则',
      //     comments: defaultValidatorAnnotation,
      //     width: 600,
      //     minimap: {
      //       enabled: false
      //     }
      //   },
      //   ifVisible({ data, focusArea }: EditorResult<Data>) {
      //     if (!focusArea) return;
      //     const compositionItem = getCompositionItem(data, focusArea);

      //     return (
      //       compositionItem &&
      //       compositionItem.isRequired
      //     );
      //   },
      //   value: {
      //     set({ data, focusArea }: EditorResult<Data>, value: string) {
      //       if (!focusArea) return;
      //       const compositionItem = getCompositionItem(data, focusArea);

      //       if (compositionItem) {
      //         compositionItem.validator = value;
      //       }
      //     },
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       if (!focusArea) return;
      //       const compositionItem = getCompositionItem(data, focusArea);

      //       return compositionItem?.validator || defaultValidatorExample;
      //     }
      //   }
      // },
      {
        title: '删除表单项',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const compositionItems = getCompositionItems(data, focusArea) || [];

          return compositionItems.length > 1;
        },
        value: {
          set({ data, focusArea, output, input }: EditorResult<Data>) {
            if (!focusArea) return;
            const compositionItems = getCompositionItems(data, focusArea) || [];
            const index = getCompositionItemIndex(focusArea);
            const matchMap = deepCopy(data.matchMap);
            if (compositionItems[index]) {
              const { key } = compositionItems[index];
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
            compositionItems.splice(index, 1);
            setFormModelSchema({ data, output, input });
            data.matchMap = matchMap;
          }
        }
      }
    ]
  }
};
