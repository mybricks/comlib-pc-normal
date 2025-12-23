import { message } from 'antd';
import { Data, FormItemColonType, LabelWidthType, FormItems } from '../types';
import {
  refreshSchema,
  refreshFormItemPropsSchema,
  refreshFieldSourceSchema
} from '../schema';
import { getFormItem, getFormItemProp, setFormItemProps } from '../utils';
import { uuid } from '../../../utils';
import DomainFieldEditor from './DomainFieldEditor';
import { FieldBizType } from '../../../domain/domain-crud/constants';

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

const setQueryFieldRule = (domainModel, item, value) => {
  if (!domainModel.queryFieldRules) {
    domainModel.queryFieldRules = {};
  }

  domainModel.queryFieldRules[item?.name || item.label] = {
    operator: value
  };
};

const getSlotAfterTitle = (label: string) => {
  return `${label}后置内容区`;
};


const formItemEditor = {
  ':child(mybricks.normal-pc.form-container/form-item)': {
    ':slot': {},
    title: '表单项',
    style: [
      {
        title: '标题',
        items: [
          {
            title: '字体',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target: [`div.ant-row.ant-form-item > div.ant-col.ant-form-item-label > label > label`, `div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label > label > label`]
          },
          {
            title: '冒号',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target: [`div.ant-row.ant-form-item > div.ant-col.ant-form-item-label > label:after`, `div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label > label:after`]
          },
          {
            title: '对齐方式',
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
            target: [`div.ant-row.ant-form-item > div.ant-col.ant-form-item-label`, `div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label`]
          }
        ]
      },
      {
        title: '提示语',
        options: ['font'],
        target: ({ comId, comName, ...arg }) => {
          return [`div.ant-row.ant-form-item > div.ant-col.ant-form-item-control .formItemDesc`, `div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-control .formItemDesc`];
        }
      },
      {
        title: '边距',
        //catelog: '默认',
        options: ['margin'],
        target: [`div.ant-row.ant-form-item`, `div.ant-row.ant-form-item-row`],
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
        title: '自定义标题',
        type: 'Switch',
        value: {
          get({ id, name, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id, name }, 'labelSlot');
          },
          set({ id, name, data, slot }: EditorResult<Data>, value) {
            const { item } = getFormItem(data, { id, name });
            if (value && item) {
              const slotId = uuid();
              item['labelSlot'] = slotId;
              slot.add({ id: slotId, title: `${item?.name}标题插槽` });
            } else {
              const labelSlot = getFormItemProp({ data, id, name }, 'labelSlot');
              if (slot.get(labelSlot)) {
                slot.remove(labelSlot);
                setFormItemProps({ data, id, name }, 'labelSlot', '');
              }
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
        ifVisible({ id, data, name }: EditorResult<Data>) {
          return (
            !getFormItemProp({ data, id, name }, 'hiddenLabel') &&
            !getFormItemProp({ data, id, name }, 'labelSlot')
          );
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
            const originName = item.name;
            const fieldName = setFieldName(item, data, val);

            if (fieldName) {
              refreshFieldSourceSchema(
                { data, inputs: input, outputs: output, slots },
                { type: 'update', fieldName: fieldName, originFieldName: originName }
              );
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
      // {
      //   title: '字段',
      //   type: 'EditorRender',
      //   ifVisible({ id, name, data }: EditorResult<Data>) {
      //     return !!data.domainModel?.entity?.fieldAry;
      //   },
      //   options: ({ data }: EditorResult<Data>) => {
      //     return {
      //       render: DomainFieldEditor,
      //       domainModel: data.domainModel
      //     };
      //   },
      //   value: {
      //     get({ id, data, name }: EditorResult<Data>) {
      //       const { item } = getFormItem(data, { id, name });

      //       return item?.name ? item?.name : undefined;
      //     },
      //     set(
      //       { id, data, name, input, output, slots }: EditorResult<Data>,
      //       params: { name: string; bizType: string }
      //     ) {
      //       const { item } = getFormItem(data, { id, name });

      //       const fieldName = setFieldName(item, data, params.name);

      //       if (item && fieldName) {
      //         const oldRules = data.domainModel?.queryFieldRules?.[item.name || item.label];

      //         item['label'] = params.name;

      //         if (oldRules) {
      //           data.domainModel.queryFieldRules[params.name] = oldRules;
      //           delete data.domainModel.queryFieldRules[item.name || item.label];
      //         }

      //         if (data.domainModel?.type === 'domain') {
      //           let operator = '=';

      //           if ([FieldBizType.STRING, FieldBizType.PHONE].includes(params.bizType)) {
      //             operator = 'LIKE';
      //           }

      //           setQueryFieldRule(data.domainModel, item, operator);
      //         }

      //         refreshSchema({ data, inputs: input, outputs: output, slots });
      //       }

      //       // params.name = params.name.trim();

      //       // if (!params.name) {
      //       //   return message.warn('字段名不能为空');
      //       // }

      //       // const {item} = getFormItem(data, { id, name });

      //       // if (item && item.name !== params.name) {
      //       //   if (fieldNameCheck(data, params.name)) {
      //       //     return message.warn('字段名不能重复');
      //       //   }
      //       //   const oldRules = data.domainModel?.queryFieldRules?.[item.name || item.label];

      //       //   if (oldRules) {
      //       //     data.domainModel.queryFieldRules[params.name] = oldRules;
      //       //     delete data.domainModel.queryFieldRules[item.name || item.label];
      //       //   }

      //       //   item.name = params.name;
      //       //   item['label'] = params.name;

      //       //   if (data.domainModel?.type === 'domain') {
      //       //     let operator = '='

      //       //     if ([FieldBizType.STRING, FieldBizType.PHONE].includes(params.bizType)) {
      //       //       operator = 'LIKE'
      //       //     }

      //       //     setQueryFieldRule(data.domainModel, item, operator)
      //       //   }

      //       //   refreshSchema({ data, inputs: input, outputs: output, slots });
      //       // }
      //     }
      //   }
      // },
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
            description: '是否展示表单项标签后面的冒号，默认显示。注意：当标题配置为空时，始终不展示冒号',
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
            title: '标题超长配置',
            description: '不配置时，以表单容器的超长配置为准',
            type: 'Radio',
            options: [
              { label: '超长省略', value: 'ellipse' },
              { label: '自动换行', value: 'wrap' },
              { label: '默认', value: 'default' }
            ],
            value: {
              set({ id, name, data }: EditorResult<Data>, value: 'ellipse' | 'wrap' | 'default') {
                setFormItemProps({ data, id, name }, 'ellipseMode', value);
              },
              get({ id, name, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'ellipseMode') || data.ellipseMode;
              }
            }
          },
          {
            title: '必填样式',
            type: 'Switch',
            description: '是否展示表单项左侧的红色星号，默认隐藏',
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
  }
}

export default formItemEditor