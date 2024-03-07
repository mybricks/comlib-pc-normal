import { message } from 'antd';
import { Data, FormItemColonType, LabelWidthType, FormItems } from '../types';
import { FormLayout } from 'antd/es/form/Form';
import { ButtonType } from 'antd/es/button/button';
import { actionsEditor } from './actions';
import { inputIds, outputIds } from '../constants';
import { refreshSchema, refreshParamsSchema, refreshFormItemPropsSchema } from '../schema';
import { getFormItem } from '../utils';
import { uuid } from '../../../utils';
import iconEditor from './iconEditor';
import { createrCatelogEditor } from '../../utils/index';
import { SizeOptions, SizeEnum } from '../../types';

import { FieldBizType } from '../../../domain/domain-crud/constants';

import DomainFieldEditor from './DomainFieldEditor';

function getFormItemProp(
  { data, ...com }: { data: Data; id: string; name: string },
  name: keyof FormItems
) {
  try {
    const { item } = getFormItem(data, { id: com.id, name: com.name });

    return item?.[name];
  } catch (e) {
    console.error(e);
  }
}
function setFormItemProps(
  { data, ...com }: { data: Data; id: string; name: string },
  name: keyof FormItems,
  value: any
) {
  try {
    const { item } = getFormItem(data, { id: com.id, name: com.name }) || {};

    item[name] = value;
  } catch (e) {
    console.error(e);
  }
}

export default {
  // '@init' ({ data, inputs, outputs, slots }) {
  //   console.log(data.domainModel, slots)
  // },
  ':slot': {},
  '@inputConnected'({ data, outputs }, fromPin, toPin) {
    if (toPin.id === inputIds.SUBMIT_AND_MERGE) {
      if (fromPin.schema.type === 'object') {
        data.paramsSchema = fromPin.schema;
      } else {
        data.paramsSchema = {};
      }
      refreshParamsSchema(data, outputs);
    }
  },
  '@inputDisConnected'({ data, outputs }, fromPin, toPin) {
    if (toPin.id === inputIds.SUBMIT_AND_MERGE) {
      data.paramsSchema = {};
      refreshParamsSchema(data, outputs);
    }
  },
  '@childAdd'({ data, inputs, outputs, logs, slots }, child, curSlot, ...res) {
    if (curSlot.id === 'content') {
      const { id, inputDefs, outputDefs, name } = child;
      const item = data.items.find((item) => item.id === id);
      const com = outputDefs.find((item) => item.id === 'returnValue');
      if (com) {
        // 表单项
        if (item) {
          item.schema = com.schema;
        } else {
          const nowC = data.nameCount++;

          data.items.push({
            id,
            comName: name,
            schema: com.schema,
            name: `表单项${nowC}`,
            label: `表单项${nowC}`,
            widthOption: 'span',
            span: 24 / data.formItemColumn,
            colon: 'default',
            labelWidthType: 'default',
            // labelAlign: 'default',
            // labelAutoWrap: 'default',
            hiddenLabel: false,
            // descriptionStyle: {
            //   whiteSpace: 'pre-wrap',
            //   lineHeight: '12px',
            //   letterSpacing: '0px',
            //   fontSize: '12px',
            //   fontWeight: 400,
            //   color: 'rgba(0, 0, 0, 0.45)',
            //   fontStyle: 'normal'
            // },
            // labelStyle: {
            //   lineHeight: '14px',
            //   letterSpacing: '0px',
            //   fontSize: '14px',
            //   fontWeight: 400,
            //   color: 'rgba(0, 0, 0, 0.85)',
            //   fontStyle: 'normal'
            // },
            // inlineMargin: [0, 16, 24, 0],
            visible: true,
            hidden: false
          });
        }

        refreshSchema({ data, inputs, outputs, slots });
      } else {
        data.additionalItems.push({
          id,
          comName: name,
          widthOption: 'span',
          span: 24 / data.formItemColumn,
          colon: 'default',
          hiddenLabel: false,
          visible: true
        });
      }
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, child) {
    const { id, name, title } = child;

    data.items = data.items.filter((item) => {
      if (item?.comName) {
        return item.comName !== name;
      }

      return item.id !== id;
    });

    data.additionalItems = data.additionalItems.filter((item) => {
      if (item?.comName) {
        return item.comName !== name;
      }

      return item.id !== id;
    });

    refreshSchema({ data, inputs, outputs, slots });
  },
  // '@_setFormItem'({data, inputs, outputs, children, logs, slots}, {id, schema}) {//As schema
  //   const item = data.items.find(item => item.id === id)
  //   // console.log('_setFormItem', id)
  //   if (item) {
  //     // console.log('_setFormItem item')
  //     item.schema = schema
  //   } else {
  //     const nowC = data.nameCount++

  //     data.items.push({
  //       id,
  //       schema,
  //       name: `item${nowC}`,
  //       label: `表单项${nowC}`,
  //       span: 24,
  //       visible: true,
  //     })
  //   }
  //   refreshSchema({data, inputs, outputs, slots})
  // },
  '@parentUpdated'(curEditor, { schema }) {
    const { id, data, parent, slot } = curEditor;

    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      // parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true;
      data.actions.visible = false;
    } else {
      data.isFormItem = false;
    }
    // console.log(curEditor, data.domainModel.entity.fieldAry)
    // if (schema === 'mybricks.domain-pc.crud/query') {
    //   if (data.items.length === 0) {
    //     slot.get('content').addCom('mybricks.normal-pc.form-text', false, { deletable: true, movable: true });
    //   }
    // }

    if (
      schema !== 'mybricks.domain-pc.crud/query' &&
      schema !== 'mybricks.domain-pc.crud/createModal' &&
      schema !== 'mybricks.domain-pc.crud/editModal'
    ) {
      if (data.domainModel.entity) {
        data.domainModel = {
          entity: undefined,
          type: '',
          queryFieldRules: undefined
        };
      }
    }
  },
  // '@init': ({ data, setDesc, setAutoRun, isAutoRun, slot }) => {
  //   console.log('@init', slot.get('content'))
  // },
  '@resize': {
    options: ['width']
  },
  ':root': {
    style: [
      {
        title: '默认',
        catelog: '默认',
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-form'
      },
      {
        title: '公共标题样式',
        catelog: '默认',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: `.ant-form-item > div.ant-col.ant-form-item-label > label > label`
      },
      {
        title: '公共冒号样式',
        catelog: '默认',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: `.ant-form-item > div.ant-col.ant-form-item-label > label:after`
      },
      {
        title: '公共标题对齐方式',
        catelog: '默认',
        options: [
          {
            type: 'font',
            config: {
              disableFontFamily: true,
              disableColor: true,
              disableFontWeight: true,
              disableFontSize: true,
              disableLineHeight: true,
              disableLetterSpacing: true,
              disableWhiteSpace: true
            }
          }
        ],
        target: `.ant-form-item > div.ant-col.ant-form-item-label`
      },
      {
        title: '公共提示语样式',
        catelog: '默认',
        options: ['font'],
        target: `.ant-form-item > div.ant-col.ant-form-item-control .formItemDesc`
      },
      {
        title: '公共表单项边距',
        catelog: '默认',
        options: ['margin'],
        target: `.ant-col:not(:last-child) .ant-form-item`,
        ifVisible({ data }: EditorResult<Data>) {
          /**
           * 领域模型查询区内，为保持样式统一 暂时不支持边距自定义
           */
          return !(data?.domainModel?.entity?.fieldAry?.length > 0 && data?.domainModel?.isQuery);
        }
      },
      {
        title: '操作项内边距',
        catelog: '默认',
        options: ['padding'],
        target: `div.ant-col.formAction`
      },
      {
        title: '操作项外边距',
        catelog: '默认',
        options: ['margin'],
        target: `div.ant-col.formAction div.ant-row.ant-form-item`
      }
    ],
    items: ({ data, output, env }: EditorResult<Data>, cate1, cate2) => {
      cate1.items = [
        {
          title: '类型',
          type: 'Select',
          options: [
            { label: '普通表单', value: 'Form' },
            { label: '查询表单', value: 'QueryFilter' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.layoutType;
            },
            set({ data, outputs }: EditorResult<Data>, value: 'Form' | 'QueryFilter') {
              data.layoutType = value;
              if (value === 'QueryFilter') {
                outputs.add(outputIds.ON_COLLAPSE, '收起/展开表单项', {
                  type: 'boolean'
                });
              } else {
                outputs.remove(outputIds.ON_COLLAPSE);
              }
            }
          }
        },
        {
          title: '默认折叠表单项',
          type: 'Switch',
          description: '默认折叠收起超出的表单项，折叠的表单项会参与提交',
          ifVisible({ data, id, name }: EditorResult<Data>) {
            return data.layoutType === 'QueryFilter';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.defaultCollapsed;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.defaultCollapsed = value;
            }
          }
        },
        {
          title: '提交隐藏表单项字段',
          type: 'Switch',
          description: '提交时收集被隐藏的表单项字段',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.submitHiddenFields;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.submitHiddenFields = val;
            }
          }
        },
        {
          title: '校验隐藏表单项字段',
          type: 'Switch',
          description: '提交隐藏表单项字段时，是否需要对隐藏字段进行校验，默认为 True 需要校验',
          ifVisible({ data }: EditorResult<Data>) {
            return data.submitHiddenFields;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.validateHiddenFields;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.validateHiddenFields = val;
            }
          }
        },
        {
          title: '添加表单项',
          type: 'comSelector',
          options: {
            schema: 'mybricks.normal-pc.form-container/*',
            type: 'add'
          },
          value: {
            set({ data, slot }: EditorResult<Data>, namespace: string) {
              slot.get('content').addCom(namespace, false, { deletable: true, movable: true });
            }
          }
        },
        {
          title: '表单项布局',
          items: [
            {
              title: '类型',
              type: 'Select',
              options: [
                { label: '水平', value: 'horizontal' },
                { label: '垂直', value: 'vertical' },
                { label: '内联', value: 'inline' }
                // { label: '自由', value: 'absolute' },
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.config?.layout || data.layout;
                },
                set({ data, inputs }: EditorResult<Data>, value: FormLayout) {
                  data.config.layout = value;
                  // refreshFormItemPropsSchema({ data, inputs });
                }
              }
            },
            {
              title: '表单项宽度',
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
                return data.layoutType === 'QueryFilter';
              },
              value: {
                get({ data, id, name }: EditorResult<Data>) {
                  return data.span || 8;
                },
                set({ data, id, name }: EditorResult<Data>, value: number) {
                  data.span = value;
                  data.actions.align = 'right';
                }
              }
            },
            {
              title: '尺寸',
              description: '全局设置表单项尺寸, 默认是中(middle)',
              type: 'Select',
              options: SizeOptions,
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.config.size || 'middle';
                },
                set({ data }: EditorResult<Data>, val: SizeEnum) {
                  data.config = {
                    ...data.config,
                    size: val
                  };
                }
              }
            },
            {
              title: '每行列数',
              type: 'Slider',
              description:
                '每行的表单项个数，可以实现平均分布各表单项及操作项，仅对“宽度配置”为“24栅格”的表单项及操作项生效',
              options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
              ifVisible({ data, id, name }: EditorResult<Data>) {
                return data.layoutType === 'Form';
              },
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
                  data.additionalItems.forEach((item) => {
                    item.span = 24 / value;
                  });
                }
              }
            }
          ]
        },

        {
          title: '标题',
          ifVisible({ data }: EditorResult<Data>) {
            return (data.config?.layout || data.layout) === 'horizontal';
          },
          items: [
            {
              title: '宽度类型',
              type: 'Select',
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
                return data.labelWidthType === 'px';
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
                return data.labelWidthType === 'span';
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
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.config?.colon || data.colon;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.config.colon = value;
                }
              }
            }
          ]
        },
        // {
        //   title: '禁用状态',
        //   type: 'Switch',
        //   description: '开启后，所以表单项和操作项都会被禁用',
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.config.disabled
        //     },
        //     set({ data }: EditorResult<Data>, val: boolean) {
        //       data.config.disabled = val
        //     }
        //   }
        // },
        {
          title: '事件',
          items: [
            {
              title: '字段值更新',
              type: '_event',
              options({ data }) {
                return {
                  outputId: outputIds.ON_VALUES_CHANGE
                };
              }
            }
          ]
        }
      ];

      if (!data.isFormItem) {
        cate2.title = actionsEditor(data, output, env).title;
        cate2.items = actionsEditor(data, output, env).items;
      }
    }
  },

  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    style: [
      {
        title: '标题字体',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: `div.ant-row.ant-form-item > div.ant-col.ant-form-item-label > label > label`
      },
      {
        title: '标题冒号',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: `div.ant-row.ant-form-item > div.ant-col.ant-form-item-label > label:after`
      },
      {
        title: '标题对齐方式',
        options: [
          {
            type: 'font',
            config: {
              disableFontFamily: true,
              disableColor: true,
              disableFontWeight: true,
              disableFontSize: true,
              disableLineHeight: true,
              disableLetterSpacing: true,
              disableWhiteSpace: true
            }
          }
        ],
        target: `div.ant-row.ant-form-item > div.ant-col.ant-form-item-label`
      },
      {
        title: '提示语样式',
        options: ['font'],
        target: ({ comId, comName, ...arg }) => {
          return `div.ant-row.ant-form-item > div.ant-col.ant-form-item-control .formItemDesc`;
        }
      },
      {
        title: '表单项边距',
        catelog: '默认',
        options: ['margin'],
        target: `div.ant-row.ant-form-item`,
        ifVisible({ comDef }) {
          const { data } = comDef;
          /**
           * 领域模型查询区内，为保持样式统一 暂时不支持边距自定义
           */
          return !(data.domainModel?.entity?.fieldAry?.length > 0 && data.domainModel?.isQuery);
        }
      }
    ],
    items: [
      {
        title: '显示标题',
        type: 'Switch',
        value: {
          get({ id, data, name }: EditorResult<Data>) {
            return !getFormItemProp({ data, id, name }, 'hiddenLabel');
          },
          set({ id, data, name }: EditorResult<Data>, val) {
            setFormItemProps({ data, id, name }, 'hiddenLabel', !val);
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        options: {
          locale: true
        },
        ifVisible({ id, data, name }: EditorResult<Data>) {
          return !getFormItemProp({ data, id, name }, 'hiddenLabel');
        },
        value: {
          get({ id, data, name }: EditorResult<Data>) {
            return getFormItemProp({ data, id, name }, 'label');
          },
          set({ id, name, data, slot }: EditorResult<Data>, val) {
            const { item, isFormItem } = getFormItem(data, { id, name });

            if (item && isFormItem) {
              if (item?.slotAfter) {
                slot.setTitle(item?.slotAfter, getSlotAfterTitle(val));
              }

              item['label'] = val;
              // setFormItemProps({ data, id }, 'label', val);
            }
          }
        }
      },
      {
        title: '字段',
        type: 'text',
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return !data.domainModel?.entity?.fieldAry;
        },
        value: {
          get({ id, data, name }: EditorResult<Data>) {
            const { item } = getFormItem(data, { id, name });

            return item?.name;
          },
          set({ id, data, name, input, output, slots }: EditorResult<Data>, val: string) {
            const { item } = getFormItem(data, { id, name });
            const fieldName = setFieldName(item, data, val);

            if (fieldName) {
              refreshSchema({ data, inputs: input, outputs: output, slots });
            }

            val = val.trim();
            if (!val) {
              return message.warn('字段名不能为空');
            }

            // const {item} = getFormItem(data, { id, name });

            // if (item && item.name !== val) {
            //   if (fieldNameCheck(data, val)) {
            //     return message.warn('字段名不能重复');
            //   }
            //   item.name = val;

            //   refreshSchema({ data, inputs: input, outputs: output, slots });
            // }
          }
        }
      },
      {
        title: '字段',
        type: 'EditorRender',
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return !!data.domainModel?.entity?.fieldAry;
        },
        options: ({ data }: EditorResult<Data>) => {
          return {
            render: DomainFieldEditor,
            domainModel: data.domainModel
          };
        },
        value: {
          get({ id, data, name }: EditorResult<Data>) {
            const { item } = getFormItem(data, { id, name });

            return item?.name ? item?.name : undefined;
          },
          set(
            { id, data, name, input, output, slots }: EditorResult<Data>,
            params: { name: string; bizType: string }
          ) {
            const { item } = getFormItem(data, { id, name });

            const fieldName = setFieldName(item, data, params.name);

            if (item && fieldName) {
              const oldRules = data.domainModel?.queryFieldRules?.[item.name || item.label];

              item['label'] = params.name;

              if (oldRules) {
                data.domainModel.queryFieldRules[params.name] = oldRules;
                delete data.domainModel.queryFieldRules[item.name || item.label];
              }

              if (data.domainModel?.type === 'domain') {
                let operator = '=';

                if ([FieldBizType.STRING, FieldBizType.PHONE].includes(params.bizType)) {
                  operator = 'LIKE';
                }

                setQueryFieldRule(data.domainModel, item, operator);
              }

              refreshSchema({ data, inputs: input, outputs: output, slots });
            }

            // params.name = params.name.trim();

            // if (!params.name) {
            //   return message.warn('字段名不能为空');
            // }

            // const {item} = getFormItem(data, { id, name });

            // if (item && item.name !== params.name) {
            //   if (fieldNameCheck(data, params.name)) {
            //     return message.warn('字段名不能重复');
            //   }
            //   const oldRules = data.domainModel?.queryFieldRules?.[item.name || item.label];

            //   if (oldRules) {
            //     data.domainModel.queryFieldRules[params.name] = oldRules;
            //     delete data.domainModel.queryFieldRules[item.name || item.label];
            //   }

            //   item.name = params.name;
            //   item['label'] = params.name;

            //   if (data.domainModel?.type === 'domain') {
            //     let operator = '='

            //     if ([FieldBizType.STRING, FieldBizType.PHONE].includes(params.bizType)) {
            //       operator = 'LIKE'
            //     }

            //     setQueryFieldRule(data.domainModel, item, operator)
            //   }

            //   refreshSchema({ data, inputs: input, outputs: output, slots });
            // }
          }
        }
      },
      {
        title: '检索规则',
        type: 'Select',
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return (
            data.domainModel?.entity?.fieldAry?.length > 0 &&
            data.domainModel?.isQuery &&
            data.domainModel?.type === 'domain'
          );
        },
        options() {
          return {
            options: [
              { label: '等于(=)', value: '=' },
              { label: '不等于(<>)', value: '<>' },
              { label: '匹配(LIKE)', value: 'LIKE' },
              { label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
              { label: '包含(IN)', value: 'IN' },
              { label: '不包含(NOT IN)', value: 'NOT IN' }
            ],
            placeholder: '请选择检索规则'
          };
        },
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            const { item } = getFormItem(data, { id, name });
            if (!item) return;
            const queryField = data.domainModel?.queryFieldRules?.[item.name];

            return queryField?.operator;
          },
          set({ id, name, data }: EditorResult<Data>, value: string) {
            const { item } = getFormItem(data, { id, name });

            if (item) {
              setQueryFieldRule(data.domainModel, item, value);
            }
          }
        }
      },
      {
        title: '标题提示',
        type: 'Text',
        options: {
          locale: true
        },
        ifVisible({ id, name, data }: EditorResult<Data>) {
          return !getFormItemProp({ data, id, name }, 'hiddenLabel');
        },
        description: '展示在标题后面的悬浮提示内容',
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id, name }, 'tooltip');
          },
          set({ id, name, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, id, name }, 'tooltip', value);
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        options: {
          locale: true
        },
        description: '展示在表单项下方的提示内容',
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id, name }, 'description');
          },
          set({ id, name, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, id, name }, 'description', value);
          }
        }
      },
      {
        title: '后置插槽',
        type: 'Switch',
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id, name }, 'slotAfter');
          },
          set({ id, name, data, slot }: EditorResult<Data>, value) {
            const { item } = getFormItem(data, { id, name });
            if (value && item) {
              const slotId = uuid();
              item['slotAfter'] = slotId;
              // setFormItemProps({ data, id }, 'slotAfter', slotId);
              slot.add({ id: slotId, title: getSlotAfterTitle(item?.label) });
            } else {
              const slotAfter = getFormItemProp({ data, id, name }, 'slotAfter');

              if (slot.get(slotAfter)) {
                slot.remove(slotAfter);
                setFormItemProps({ data, id, name }, 'slotAfter', '');
              }
            }
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
            ifVisible({ data, id, name }: EditorResult<Data>) {
              return data.layoutType !== 'QueryFilter';
            },
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'widthOption');
              },
              set({ data, id, name, inputs, outputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, id, name }, 'widthOption', value);
                refreshFormItemPropsSchema({ data, inputs, outputs });
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

              return data.layoutType !== 'QueryFilter' && item?.widthOption !== 'px';
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'span');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'span', value);
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
              return data.layoutType !== 'QueryFilter' && item?.widthOption === 'px';
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'width');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'width', value);
              }
            }
          },
          {
            title: '标题宽度',
            type: 'Radio',
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id, name }, 'hiddenLabel');
            },
            options: [
              { label: '跟随容器', value: 'default' },
              { label: '自定义', value: 'custom' }
            ],
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'labelWidthType');
              },
              set({ id, name, data }: EditorResult<Data>, value: boolean) {
                setFormItemProps({ data, id, name }, 'labelWidthType', value);
              }
            }
          },
          {
            type: 'inputNumber',
            options: [{ min: 1, width: 100, formatter: 'px' }],
            ifVisible({ data, id, name }: EditorResult<Data>) {
              return (
                !getFormItemProp({ data, id, name }, 'hiddenLabel') &&
                getFormItemProp({ data, id, name }, 'labelWidthType') === 'custom'
              );
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return [getFormItemProp({ data, id, name }, 'labelWidth') || data.labelWidth];
              },
              set({ data, id, name }: EditorResult<Data>, value: number[]) {
                setFormItemProps({ data, id, name }, 'labelWidth', value[0]);
              }
            }
          },
          {
            title: '标题冒号',
            type: 'Radio',
            ifVisible({ id, name, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id, name }, 'hiddenLabel');
            },
            description: '当标题配置为空时，始终不展示冒号',
            options: [
              { label: '跟随容器', value: 'default' },
              { label: '显示', value: true },
              { label: '隐藏', value: false }
            ],
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'colon');
              },
              set({ id, name, data }: EditorResult<Data>, value: FormItemColonType) {
                setFormItemProps({ data, id, name }, 'colon', value);
              }
            }
          },
          {
            title: '必填样式',
            type: 'Switch',
            value: {
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'required');
              },
              set({ id, name, data }: EditorResult<Data>, value) {
                setFormItemProps({ data, id, name }, 'required', value);
              }
            }
          }
        ]
      }
    ]
  },
  ':child(mybricks.normal-pc.form-container/form-addition-container)': {
    title: '其他内容',
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
                return getFormItemProp({ data, id, name }, 'widthOption');
              },
              set({ data, id, name, inputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, id, name }, 'widthOption', value);
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
                return getFormItemProp({ data, id, name }, 'span');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'span', value);
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
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'width');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'width', value);
              }
            }
          }
        ]
      }
    ]
  },
  '[data-form-actions]': {
    title: '操作区',
    style: [
      {
        catelog: '默认',
        options: ['padding'],
        target: `div.ant-col.formAction`
      },
      {
        catelog: '默认',
        options: ['margin'],
        target: `div.ant-col.formAction div.ant-row.ant-form-item`
      }
    ],
    items: ({ data, output, env }: EditorResult<Data>, cate1) => {
      cate1.title = actionsEditor(data, output, env).title;
      cate1.items = actionsEditor(data, output, env).items;
    }
  },
  '[data-form-actions-item]': {
    style: [
      {
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: 'primary', label: '主按钮' },
            { value: 'default', label: '次按钮' },
            { value: 'dashed', label: '虚线按钮' },
            { value: 'link', label: '链接按钮' },
            { value: 'text', label: '文字按钮' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string;

            return data.actions.items.find((item) => item.key === comId)?.type || 'default';
          },
          set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);

            if (item) {
              item.type = value;
            }
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string;

            return data.actions.items.find((item) => item.key === comId)?.danger;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);

            if (item) {
              item.danger = value;
            }
          }
        }
      },
      ...iconEditor,
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"] .icon`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                catelog: 'Hover',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:hover`;
                },
                domTarget({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:hover .icon`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '激活',
            items: [
              {
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:active`;
                },
                domTarget({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:active .icon`;
                }
              }
            ]
          })
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      (cate1.title = '操作'),
        (cate1.items = [
          {
            title: '显示',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const comId = focusArea.dataset.formActionsItem as string;
                return data.actions.items.find((item) => item.key === comId)?.visible;
              },
              set({ data, focusArea, output }: EditorResult<Data>, val) {
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);
                if (item) {
                  item.visible = val;
                }
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
              get({ data, focusArea }: EditorResult<Data>) {
                const comId = focusArea.dataset.formActionsItem as string;
                return comId && data.actions.items.find((item) => item.key === comId)?.title;
              },
              set({ data, focusArea, output }: EditorResult<Data>, val) {
                if (!val) {
                  return message.warn('操作标题不能为空');
                }

                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);
                if (item) {
                  item.title = val;
                  output.setTitle(item.outputId, `点击${item.title}`);
                }
              }
            }
          },
          {
            title: '权限',
            type: '_permission',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const item = getAcitonsItem(focusArea, data.actions.items);

                return item?.permission;
              },
              set(params: EditorResult<Data>, val) {
                const { data, focusArea, output } = params;

                const item = getAcitonsItem(focusArea, data.actions.items);

                if (item) {
                  item['permission'] = { id: val.id };
                  val.register(val.id);
                }
              }
            }
          },
          {
            title: '事件',
            items: [
              {
                title: '点击',
                type: '_event',
                options({ data, focusArea }) {
                  // const comId = focusArea.dataset['formActionsItem'];
                  // const item = data.actions.items.find((item) => item.key === comId);
                  const item = getAcitonsItem(focusArea, data.actions.items);
                  if (!item) return;

                  return {
                    outputId: item.outputId
                  };
                }
              }
            ]
          },
          {
            title: '删除',
            type: 'Button',
            ifVisible({ data, focusArea }) {
              // const actions = data.actions.items;
              // const itemId = focusArea.dataset['formActionsItem'];
              // const item = actions.find((item) => item.key === itemId);
              const item = getAcitonsItem(focusArea, data.actions.items);

              return item && !item?.isDefault;
            },
            value: {
              set({ data, output, focusArea, removePermission }: EditorResult<Data>) {
                const actions = data.actions.items;
                const itemId = focusArea.dataset['formActionsItem'];
                const index = actions.findIndex((item) => item.key === itemId);
                const item = data.actions.items[index];

                if (item?.permission) {
                  removePermission(item.permission?.id);
                  item.permission = undefined;
                }

                output.remove(item.outputId);
                actions.splice(index, 1);
              }
            }
          }
        ]),
        (cate2.title = '高级'),
        (cate2.items = [
          {
            title: '动态启用/禁用',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const comId = focusArea.dataset.formActionsItem as string;
                return (
                  comId && data.actions.items.find((item) => item.key === comId)?.useDynamicDisabled
                );
              },
              set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);

                const eventKey1 = `${inputIds.SetEnable}_${item?.key}`;
                const eventKey2 = `${inputIds.SetDisable}_${item?.key}`;

                const event1 = input.get(eventKey1);
                const event2 = input.get(eventKey2);
                if (value) {
                  !event1 && input.add(eventKey1, `启用-"${item?.title}"`, { type: 'any' });
                  !event2 && input.add(eventKey2, `禁用-"${item?.title}"`, { type: 'any' });
                } else {
                  event1 && input.remove(eventKey1);
                  event2 && input.remove(eventKey2);
                }
                if (item) {
                  item.useDynamicDisabled = value;
                }
              }
            }
          },
          {
            title: '动态显示/隐藏',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const comId = focusArea.dataset.formActionsItem as string;
                return (
                  comId && data.actions.items.find((item) => item.key === comId)?.useDynamicHidden
                );
              },
              set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);

                const eventKey1 = `${inputIds.SetShow}_${item?.key}`;
                const eventKey2 = `${inputIds.SetHidden}_${item?.key}`;

                const event1 = input.get(eventKey1);
                const event2 = input.get(eventKey2);
                if (value) {
                  !event1 && input.add(eventKey1, `显示-"${item?.title}"`, { type: 'any' });
                  !event2 && input.add(eventKey2, `隐藏-"${item?.title}"`, { type: 'any' });
                } else {
                  event1 && input.remove(eventKey1);
                  event2 && input.remove(eventKey2);
                }
                if (item) {
                  item.useDynamicHidden = value;
                }
              }
            }
          }
        ]);
    }
  }
};

const getSlotAfterTitle = (label: string) => {
  return `${label}后置内容区`;
};

const setQueryFieldRule = (domainModel, item, value) => {
  if (!domainModel.queryFieldRules) {
    domainModel.queryFieldRules = {};
  }

  domainModel.queryFieldRules[item?.name || item.label] = {
    operator: value
  };
};

const getAcitonsItem = (focusArea, actions) => {
  const itemId = focusArea.dataset['formActionsItem'];
  const item = actions.find((item) => item.key === itemId);

  return item;
};

const setFieldName = (item, data, value) => {
  if (!value) {
    message.warn('字段名不能为空');
    return null;
  }

  const name = value.trim();

  if (item && item.name !== name) {
    if (fieldNameCheck(data, name)) {
      message.warn('字段名不能重复');
      return null;
    }

    item.name = name;

    return name;
  }
};

function fieldNameCheck(data: Data, name: string) {
  const fieldNameList = data.items.map((item) => item.name);
  if (fieldNameList.includes(name)) {
    return true;
  } else {
    return false;
  }
}
