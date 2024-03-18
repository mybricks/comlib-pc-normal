import { message } from 'antd';
import { Data, FormItemColonType, LabelWidthType, FormItems } from '../types';
import { ButtonType } from 'antd/es/button/button';
import { actionsEditor } from './actions';
import { SlotIds } from '../constants';
import { refreshSchema } from '../schema';
import { RuleKeys } from '../../../form-coms/utils/validator';
import { outputIds } from '../../form-container/constants';
import {
  fieldNameCheck,
  getFormItem,
  getFormItemProp,
  isShowLabel,
  setFormItemProps
} from '../utils';
import { StylesEditor } from './stylesEditor';

export const defaultRules = [
  {
    key: RuleKeys.REQUIRED,
    status: false,
    visible: true,
    title: '必填',
    message: '请至少添加一项'
  },
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: `export default async function (value, context) {
  if (!value) {
    // 校验失败
    context.failed('代码校验失败');
  } else {
    // 校验成功
    context.successed();
  }
}        
    `
  },
  {
    key: RuleKeys.CUSTOM_EVENT,
    status: false,
    visible: true,
    title: '自定义校验'
  }
];

/** 操作项显隐表达式提示片段 */
const getSuggestions = (data: Data) => {
  const valueSuggestion = data.items.map((item) => {
    return {
      label: item.name || item.label,
      insertText: item.name || item.label,
      detail: `${item.name || item.label}字段值`
    };
  });
  return [
    {
      label: 'item',
      insertText: `item.`,
      detail: `当前项`,
      properties: [
        {
          label: 'index',
          insertText: `index`,
          detail: `当前项的索引`
        },
        {
          label: 'isLast',
          insertText: `isLast`,
          detail: `当前是否是最后一项`
        },
        {
          label: 'listLength',
          insertText: `listLength`,
          detail: `动态表单项长度`
        },
        {
          label: 'key',
          insertText: `key`,
          detail: `当前项的唯一标识`
        },
        {
          label: 'value',
          insertText: `value`,
          detail: `当前项的值`,
          properties: valueSuggestion
        }
      ]
    }
  ];
};

export default {
  ':slot': {},
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  '@childAdd'({ data, inputs, outputs, slots }: EditorResult<Data>, child, curSlot) {
    if (curSlot.id === SlotIds.FormItems) {
      const { id, inputDefs, outputDefs, name } = child;
      const item = data.items.find((item) => item.id === id || item.comName === name);
      const com = outputDefs.find((item) => item.id === 'returnValue');
      if (com) {
        // 表单项
        if (item) {
          item.schema = com.schema;
        } else {
          data.nameCount++;
          data.items.push({
            id,
            schema: com.schema,
            comName: name,
            name: `name${data.nameCount}`,
            label: `${data.nameCount}`,
            widthOption: 'span',
            span: 24 / data.formItemColumn,
            colon: 'default',
            labelAlign: 'default',
            labelAutoWrap: 'default',
            showLabel: 'default',
            descriptionStyle: {
              whiteSpace: 'pre-wrap',
              lineHeight: '12px',
              letterSpacing: '0px',
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.45)',
              fontStyle: 'normal'
            },
            labelStyle: {
              lineHeight: '14px',
              letterSpacing: '0px',
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.85)',
              fontStyle: 'normal'
            },
            inlineMargin: [0, 16, 24, 0],
            visible: true
          });
        }
        refreshSchema({ data, inputs, outputs, slots });
      } else {
        data.additionalItems.push({
          id,
          comName: name,
          widthOption: 'span',
          span: 24 / data.formItemColumn
        });
      }
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, { id, name, title }) {
    data.items = data.items.filter((item) => item.comName !== name);

    data.additionalItems = data.additionalItems?.filter((item) => item.comName !== name);

    refreshSchema({ data, inputs, outputs, slots });
  },
  '@parentUpdated'({ id, name, data, parent }, { schema }) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      // parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true;
    } else {
      data.isFormItem = false;
    }
  },
  ':root': {
    style: [
      {
        title: '列表项',
        options: ['border', 'background', 'padding'],
        target: '.ant-row.form-list-item'
      },
      {
        title: '列表项外边距',
        type: 'inputNumber',
        options: [
          { min: 0, title: '上' },
          { min: 0, title: '右' },
          { min: 0, title: '下' },
          { min: 0, title: '左' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.listItemMargin;
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.listItemMargin = value;
          }
        }
      }
    ],
    items: ({ data, output }: EditorResult<Data>, cate1, cate2) => {
      cate1.items = [
        {
          title: '布局',
          items: [
            // {
            //   title: '排列方式',
            //   type: 'layout',
            //   options: [],
            //   value: {
            //     get({ data, slots }: EditorResult<Data>) {
            //       const { slotStyle = {} } = data;
            //       const slotInstance = slots.get(SlotIds.FormItems);
            //       setSlotLayout(slotInstance, slotStyle);
            //       return slotStyle;
            //     },
            //     set({ data, slots }: EditorResult<Data>, val: any) {
            //       if (!data.slotStyle) {
            //         data.slotStyle = {};
            //       }
            //       data.slotStyle = {
            //         ...data.slotStyle,
            //         ...val
            //       };
            //       const slotInstance = slots.get(SlotIds.FormItems);
            //       setSlotLayout(slotInstance, val);
            //     }
            //   }
            // },
            {
              title: '每行列数',
              type: 'Slider',
              description:
                '每行的表单项个数，可以实现平均分布各表单项及操作项，仅对“宽度配置”为“24栅格”的表单项及操作项生效',
              options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.formItemColumn;
                },
                set({ data }: EditorResult<Data>, value: number) {
                  data.formItemColumn = value;
                  data.actions.span = 24 / value;
                  data.items.forEach((item) => {
                    item.span = 24 / value;
                  });
                  data.additionalItems?.forEach((item) => {
                    item.span = 24 / value;
                  });
                }
              }
            }
            // {
            //   title: '表单项',
            //   items: [

            //   ]
            // }
          ]
        },
        {
          title: '子项标题',
          items: [
            {
              title: '显示',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.showLabel;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.showLabel = val;
                }
              }
            },
            {
              title: '宽度类型',
              type: 'Select',
              ifVisible({ data }: EditorResult<Data>) {
                return data.showLabel;
              },
              options: [
                { label: '固定像素', value: 'px' },
                { label: '24 栅格', value: 'span' }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.labelWidthType;
                },
                set({ data }: EditorResult<Data>, value: LabelWidthType) {
                  data.labelWidthType = value;
                }
              }
            },
            {
              title: '标题宽度(px)',
              type: 'inputNumber',
              options: [{ min: 1 }],
              ifVisible({ data }: EditorResult<Data>) {
                return data.showLabel && data.labelWidthType === 'px';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.labelWidth];
                },
                set({ data }: EditorResult<Data>, value: number) {
                  data.labelWidth = value[0];
                }
              }
            },
            {
              title: '标题宽度(栅格)',
              type: 'Slider',
              options: [{ max: 24, min: 1, steps: 1, formatter: '格' }],
              ifVisible({ data }: EditorResult<Data>) {
                return data.showLabel && data.labelWidthType === 'span';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.labelCol;
                },
                set({ data }: EditorResult<Data>, value: number) {
                  data.labelCol = value;
                }
              }
            },
            {
              title: '显示冒号',
              type: 'Switch',
              ifVisible({ data }: EditorResult<Data>) {
                return data.showLabel;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.formItemConfig?.colon;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.formItemConfig.colon = value;
                }
              }
            },
            {
              title: '对齐方式',
              type: 'Radio',
              options: [
                { label: '左对齐', value: 'left' },
                { label: '右对齐', value: 'right' }
              ],
              ifVisible({ data }: EditorResult<Data>) {
                return data.showLabel;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.formItemConfig?.labelAlign;
                },
                set({ data }: EditorResult<Data>, value: 'left' | 'right') {
                  data.formItemConfig.labelAlign = value;
                }
              }
            }
          ]
        },
        // {
        //   title: '初始长度',
        //   type: 'Slider',
        //   options: [{ min: 0, steps: 1 }],
        //   description: '动态列表的初始项数',
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.initLength;
        //     },
        //     set({ data }: EditorResult<Data>, val: number) {
        //       data.initLength = val;
        //     }
        //   }
        // },
        {
          title: '添加表单项',
          type: 'comSelector',
          options: {
            schema: 'mybricks.normal-pc.form-container/*',
            type: 'add'
          },
          value: {
            set({ data, slot }: EditorResult<Data>, namespace: string) {
              slot
                .get(SlotIds.FormItems)
                .addCom(namespace, false, { deletable: true, movable: true });
            }
          }
        },
        {
          title: '提交隐藏表单项',
          type: 'Switch',
          description: '提交时收集被隐藏的表单项字段并进行校验',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.submitHiddenFields;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.submitHiddenFields = val;
            }
          }
        },
        // {
        //   title: '禁用状态',
        //   type: 'Switch',
        //   description: '开启后，所以表单项和操作项都会被禁用',
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.disabled
        //     },
        //     set({ data }: EditorResult<Data>, val: boolean) {
        //       data.disabled = val
        //       if (val) {
        //         data.currentAction = InputIds.SetDisabled;
        //       }
        //       else {
        //         data.currentAction = InputIds.SetEnabled;
        //       }
        //     }
        //   }
        // },
        {
          title: '校验规则',
          description: '提供快捷校验配置，需要配合表单容器使用生效',
          type: 'ArrayCheckbox',
          options: {
            checkField: 'status',
            visibleField: 'visible',
            getTitle: ({ title }: any) => {
              return title;
            },
            items: [
              {
                title: '提示文字',
                type: 'Text',
                value: 'message',
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REQUIRED;
                },
                options: {
                  locale: true
                }
              },
              {
                title: '编辑校验规则',
                type: 'code',
                options: {
                  language: 'javascript',
                  enableFullscreen: false,
                  title: '编辑校验规则',
                  width: 600,
                  minimap: {
                    enabled: false
                  },
                  babel: true,
                  eslint: {
                    parserOptions: {
                      ecmaVersion: '2020',
                      sourceType: 'module'
                    }
                  }
                },
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.CODE_VALIDATOR;
                },
                value: 'validateCode'
              }
            ]
          },
          value: {
            get({ data }) {
              return data.rules?.length > 0 ? data.rules : defaultRules;
            },
            set({ data }, value: any) {
              data.rules = value;
            }
          }
        },
        {
          title: '校验触发事件',
          type: '_event',
          ifVisible({ data }: EditorResult<Data>) {
            const customRule = (data.rules || defaultRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            return !!customRule?.status;
          },
          options: {
            outputId: outputIds.ON_VALIDATE
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '值初始化',
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              type: '_event',
              options: {
                outputId: 'onChange'
              }
            }
          ]
        }
      ];
      cate2.title = '操作区';
      cate2.items = actionsEditor(data, output);
    }
  },
  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    items: [
      {
        title: '显示标题',
        type: 'Radio',
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
          { label: '跟随容器配置', value: 'default' }
        ],
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, com: { name, id } }, 'showLabel');
          },
          set({ id, name, data }: EditorResult<Data>, value: true | false | 'default') {
            setFormItemProps({ data, com: { name, id } }, 'showLabel', value);
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return isShowLabel({ data, com: { id, name } });
        },
        options: {
          locale: true
        },
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, com: { name, id } }, 'label');
          },
          set({ id, name, data, slot }: EditorResult<Data>, val) {
            setFormItemProps({ data, com: { name, id } }, 'label', val);
          }
        }
      },
      {
        title: '字段',
        type: 'text',
        value: {
          get({ id, name, data, focusArea }: EditorResult<Data>) {
            const { item } = getFormItem(data, { id, name }) || {};
            return item?.name || item?.label;
          },
          set(
            { id, name, data, focusArea, input, output, slots }: EditorResult<Data>,
            val: string
          ) {
            val = val.trim();
            if (!val) {
              return message.warn('字段名不能为空');
            }

            const item = data.items.find((item) => item.id === id || item.comName === name);

            if (item && item.name !== val) {
              if (fieldNameCheck(data, val)) {
                return message.warn('字段名不能重复');
              }
              item.name = val;

              refreshSchema({ data, inputs: input, outputs: output, slots });
            }
          }
        }
      },
      {
        title: '标题提示',
        type: 'Text',
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return isShowLabel({ data, com: { id, name } });
        },
        options: {
          locale: true
        },
        description: '展示在标题后面的悬浮提示内容',
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, com: { name, id } }, 'tooltip');
          },
          set({ id, name, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, com: { name, id } }, 'tooltip', value);
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        description: '展示在表单项下方的提示内容',
        options: {
          locale: true
        },
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, com: { name, id } }, 'description');
          },
          set({ id, name, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, com: { name, id } }, 'description', value);
          }
        }
      },
      {
        title: '样式',
        items: [
          {
            title: '宽度模式',
            type: 'Select',
            options: [
              {
                label: '24栅格',
                value: 'span'
              },
              {
                label: '固定宽度(px)',
                value: 'px'
              }
            ],
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'widthOption');
              },
              set({ data, name, id, inputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, com: { name, id } }, 'widthOption', value);
              }
            }
          },
          {
            title: '宽度配置(共24格)',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24'
              }
            ],
            ifVisible({ data, name, id }: EditorResult<Data>) {
              return getFormItemProp({ data, com: { name, id } }, 'widthOption') !== 'px';
            },
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'span');
              },
              set({ data, name, id }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, com: { name, id } }, 'span', value);
              }
            }
          },
          {
            title: '宽度配置(px)',
            type: 'text',
            options: {
              type: 'number'
            },
            ifVisible({ data, name, id }: EditorResult<Data>) {
              return getFormItemProp({ data, com: { name, id } }, 'widthOption') === 'px';
            },
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'width');
              },
              set({ data, name, id }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, com: { name, id } }, 'width', value);
              }
            }
          },
          {
            title: '边距',
            type: 'inputNumber',
            options: [
              { min: 0, title: '上' },
              { min: 0, title: '右' },
              { min: 0, title: '下' },
              { min: 0, title: '左' }
            ],
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'inlineMargin');
              },
              set({ id, name, data }: EditorResult<Data>, value: number[]) {
                setFormItemProps({ data, com: { name, id } }, 'inlineMargin', value);
              }
            }
          },
          {
            title: '边距应用其它表单项及操作项',
            type: 'Button',
            value: {
              set({ id, name, data }: EditorResult<Data>) {
                const { item: curItem } = getFormItem(data, { name, id }) || {};
                const margin = curItem?.inlineMargin || [0, 16, 24, 0];
                data.items.forEach((item) => (item.inlineMargin = [...margin]));
                data.actions.inlinePadding = [...margin];
              }
            }
          },
          // {
          //   title: '标题自动换行',
          //   type: 'Radio',
          //   ifVisible({ id, name, data }: EditorResult<Data>) {
          //     return isShowLabel({ data, com: { id, name } });
          //   },
          //   options: [
          //     { label: '是', value: true },
          //     { label: '否', value: false },
          //     { label: '跟随容器配置', value: 'default' },
          //   ],
          //   value: {
          //     get({ id, name, data }: EditorResult<Data>) {
          //       return getFormItemProp({ data, com: { name, id } }, 'labelAutoWrap');
          //     },
          //     set({ id, name, data }: EditorResult<Data>, value: boolean) {
          //       setFormItemProps({ data, com: { name, id } }, 'labelAutoWrap', value);
          //     }
          //   }
          // },
          {
            title: '标题对齐方式',
            type: 'Radio',
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return isShowLabel({ data, com: { id, name } });
            },
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' },
              { label: '跟随容器配置', value: 'default' }
            ],
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'labelAlign');
              },
              set({ id, name, data }: EditorResult<Data>, value: 'left' | 'right') {
                setFormItemProps({ data, com: { name, id } }, 'labelAlign', value);
              }
            }
          },
          {
            title: '标题冒号',
            type: 'Radio',
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return isShowLabel({ data, com: { id, name } });
            },
            description: '当标题配置为空时，始终不展示冒号',
            options: [
              { label: '显示', value: true },
              { label: '隐藏', value: false },
              { label: '跟随容器配置', value: 'default' }
            ],
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'colon');
              },
              set({ id, name, data }: EditorResult<Data>, value: FormItemColonType) {
                setFormItemProps({ data, com: { name, id } }, 'colon', value);
              }
            }
          },
          {
            title: '标题样式',
            type: 'Style',
            options: ['font'],
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return isShowLabel({ data, com: { id, name } });
            },
            description: '表单项标题的字体样式',
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                const item = data.items.find((item) => item.id === id || item.comName === name);
                if (!item?.labelStyle) {
                  setFormItemProps({ data, com: { name, id } }, 'labelStyle', {
                    lineHeight: '14px',
                    letterSpacing: '0px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontStyle: 'normal'
                  });
                }
                return item?.labelStyle;
              },
              set({ id, name, data }: EditorResult<Data>, value: any) {
                const { styleEditorUnfold, ...style } = value;
                setFormItemProps({ data, com: { name, id } }, 'labelStyle', style);
              }
            }
          },
          {
            title: '标题样式应用所有表单项',
            type: 'Button',
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return isShowLabel({ data, com: { id, name } });
            },
            value: {
              set({ id, name, data }: EditorResult<Data>, value: {}) {
                const { item } = getFormItem(data, { name, id }) || {};
                const labelStyle = item?.labelStyle || {
                  lineHeight: '14px',
                  letterSpacing: '0px',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontStyle: 'normal'
                };
                data.items.forEach((item) => (item.labelStyle = labelStyle));
              }
            }
          },
          {
            title: '提示语样式',
            type: 'Style',
            options: ['font'],
            description: '表单项提示语的字体样式',
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                const item = data.items.find((item) => item.id === id || item.comName === name);
                if (!item?.descriptionStyle) {
                  setFormItemProps({ data, com: { name, id } }, 'descriptionStyle', {
                    whiteSpace: 'pre-wrap',
                    lineHeight: '12px',
                    letterSpacing: '0px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontStyle: 'normal'
                  });
                }
                return item?.descriptionStyle;
              },
              set({ id, name, data }: EditorResult<Data>, value: any) {
                const { styleEditorUnfold, ...style } = value;
                setFormItemProps({ data, com: { name, id } }, 'descriptionStyle', style);
              }
            }
          },
          {
            title: '提示语样式应用所有表单项',
            type: 'Button',
            value: {
              set({ id, name, data }: EditorResult<Data>) {
                const { item } = getFormItem(data, { name, id }) || {};
                const descriptionStyle = item?.descriptionStyle || {
                  whiteSpace: 'pre-wrap',
                  lineHeight: '12px',
                  letterSpacing: '0px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.45)',
                  fontStyle: 'normal'
                };
                data.items.forEach((item) => (item.descriptionStyle = descriptionStyle));
              }
            }
          },
          {
            title: '必填样式',
            type: 'Switch',
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'required');
              },
              set({ id, name, data }: EditorResult<Data>, value) {
                setFormItemProps({ data, com: { name, id } }, 'required', value);
              }
            }
          }
        ]
      }
    ]
  },
  ':child(mybricks.normal-pc.form-container/form-addition-container)': {
    title: '自定义内容',
    items: [
      {
        title: '样式',
        items: [
          {
            title: '宽度模式',
            type: 'Select',
            options: [
              {
                label: '24栅格',
                value: 'span'
              },
              {
                label: '固定宽度(px)',
                value: 'px'
              }
            ],
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'widthOption');
              },
              set({ data, name, id, inputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, com: { name, id } }, 'widthOption', value);
              }
            }
          },
          {
            title: '宽度配置(共24格)',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24'
              }
            ],
            ifVisible({ data, id, name }: EditorResult<Data>) {
              const { item } = getFormItem(data, { id, name });

              return item?.widthOption !== 'px';
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'span');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, com: { name, id } }, 'span', value);
              }
            }
          },
          {
            title: '宽度配置(px)',
            type: 'text',
            options: {
              type: 'number'
            },
            ifVisible({ data, id, name }: EditorResult<Data>) {
              const { item } = getFormItem(data, { id, name });
              return item?.widthOption === 'px';
            },
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, com: { name, id } }, 'width');
              },
              set({ data, name, id }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, com: { name, id } }, 'width', value);
              }
            }
          }
        ]
      }
    ]
  },
  '[data-form-actions]': {
    title: '操作区',
    items: ({ data, output }: EditorResult<Data>, cate1) => {
      cate1.title = '操作区';
      cate1.items = actionsEditor(data, output);
    }
  },
  '[data-form-actions-item]': {
    title: '操作',
    style: [
      ...StylesEditor,
      {
        items: [
          {
            options: ['size'],
            catelog: '默认',
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]`;
            }
          },
          {
            title: '内置图标',
            catelog: '默认',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"] .anticon`;
            }
          },
          {
            title: '自定义图标',
            catelog: '默认',
            options: ['size'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"] .ant-image-img`;
            }
          },
          {
            title: '按钮样式',
            catelog: '默认',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]`;
            }
          },
          {
            title: '按钮样式',
            catelog: 'Hover',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:hover`;
            }
          },
          {
            title: '内置图标',
            catelog: 'Hover',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:hover .anticon`;
            }
          },
          {
            title: '自定义图标',
            catelog: 'Hover',
            options: ['size'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:hover .ant-image-img`;
            }
          },
          {
            title: '按钮样式',
            catelog: '激活',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:active`;
            }
          },
          {
            title: '内置图标',
            catelog: '激活',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:active .anticon`;
            }
          },
          {
            title: '自定义图标',
            catelog: '激活',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"]:active .ant-image-img`;
            }
          },
          {
            title: '按钮样式',
            catelog: '禁用',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled]`;
            }
          },
          {
            title: '内置图标',
            catelog: '禁用',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled] .anticon`;
            }
          },
          {
            title: '自定义图标',
            catelog: '激活',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target({ focusArea, data }) {
              if (!focusArea) return;
              const comId = focusArea.dataset['formActionsItem'];
              const btn = data.actions.items.find((item) => item.key === comId);

              if (!btn) return;
              return `button[data-form-actions-item="${btn.key}"].ant-btn[disabled] .ant-image-img`;
            }
          }
        ]
      }
    ],
    items: ({ data, output, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.items.find((item) => item.key === comId);

      if (!btn) return;

      cate1.title = '操作';
      cate1.items = [
        {
          title: '显示',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return btn.visible;
            },
            set({ data }: EditorResult<Data>, val) {
              btn.visible = val;
            }
          }
        },
        {
          title: '动态显示表达式',
          type: 'expression',
          options: {
            suggestions: getSuggestions(data),
            placeholder: `例：{item.index < 4}`
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return btn.displayExpression;
            },
            set({ data }: EditorResult<Data>, val: string) {
              btn.displayExpression = val;
            }
          }
        },
        {
          title: '标题',
          type: 'text',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return btn.title;
            },
            set({ data, output }: EditorResult<Data>, val) {
              btn.title = val;
              output.setTitle(btn.outputId, `点击${btn.title}`);
            }
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '点击',
              type: '_event',
              options({ data }) {
                return {
                  outputId: btn.outputId
                  // slotId: SlotIds.FormItems
                };
              }
            }
          ]
        },
        {
          title: '删除',
          type: 'Button',
          ifVisible({ data }) {
            return !btn?.isDefault;
          },
          value: {
            set({ data, output, focusArea }: EditorResult<Data>) {
              const actions = data.actions.items;
              const itemId = focusArea.dataset['formActionsItem'];
              const index = actions.findIndex((item) => item.key === itemId);

              output.remove(btn.outputId);
              data.actions.items.splice(index, 1);
            }
          }
        }
      ];

      cate2.title = '高级';
      cate2.items = [
        {
          title: '权限信息配置',
          description: '权限信息配置',
          type: '_permission',
          options: {
            placeholder: '不填写，默认无权限校验'
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return btn.permission;
            },
            set({ data, focusArea }: EditorResult<Data>, value: { id: string, register: () => void }) {
              btn.permission = { id: value.id };
              value.register();
            }
          }
        },
      ];

      // cate3.title = '样式';
      // cate3.items = [
      //   ...StyleEditor(btn),
      //   ...IconEditor(btn)
      // ];
    }
  }
};
