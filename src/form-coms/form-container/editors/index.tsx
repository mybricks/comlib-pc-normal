import { message } from 'antd';
import { Data, LabelWidthType, FormItems } from '../types';
import { FormLayout } from 'antd/es/form/Form';
import { actionsEditor } from './actions';
import { inputIds, outputIds, commonDynamicItemSchema } from '../constants';
import { refreshSchema, refreshParamsSchema, refreshFieldSourceSchema } from '../schema';
import { getFormItem, getChildDataSource } from '../utils';
import actionItemEditor from './action-item';
import formItemEditor from './form-item';
import additionFormItemEditor from './form-addition-item';
import { SizeOptions, SizeEnum } from '../../types';
import { createrCatelogEditor } from '../../utils';
import { isSameDomainInstanceAndService } from "../../../utils/domainModel";

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
  '@childAdd'({ data, inputs, outputs, logs, slots }, child, curSlot, configs = {} as { name: string; label: string;}) {
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

          const { name: itemName, label: itemLabel } = configs;

          data.items.push({
            id,
            comName: name,
            schema: com.schema,
            name: itemName || `表单项${nowC}`,
            label: itemLabel || `表单项${nowC}`,
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
          let fieldSourceSchema = getChildDataSource(child);
          if (fieldSourceSchema) {
            refreshFieldSourceSchema(
              { data, inputs, outputs, slots },
              { type: 'add', fieldName: itemName || `表单项${nowC}`, schema: fieldSourceSchema }
            );
          }
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
    let formItemDel = data.items.find((item) => {
      if (item?.comName) {
        return item.comName === name;
      }

      return item.id === id;
    });
    if (formItemDel) {
      refreshFieldSourceSchema(
        { data, inputs, outputs, slots },
        { type: 'remove', fieldName: formItemDel.name }
      );
    }
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
  "@domainModel": {
    options: {
      type: ["create", "update"]
    },
    get({ data }) {
      return data._domainModel;
    },
    set({ data, slot }, _domainModel) {
      if (!_domainModel) {
        data._domainModel = _domainModel;
        return;
      }
      
      if (isSameDomainInstanceAndService(data._domainModel, _domainModel)) {
        return;
      }
      if (_domainModel.defId === "_defined") {
        data._domainModel = _domainModel;
        return;
      }
      // 类型校验
      const { service } = _domainModel;

      if (service?.method === "post") {
        // 清空表单项
        slot.get('content').clear();
        (service.params || service.request).forEach((param) => {
          if (!param["x-read-only"] && !param.extends?.["x-read-only"]) {
            slot.get('content')
              .addCom(
                ANTD_VERSION === 4 ? "mybricks.normal-pc.form-text" : "mybricks.normal-pc.antd5.form-text",
                false,
                { deletable: true, movable: true },
                {
                  name: param.name,
                  label: param.title || param.name
                }
              );
          }
        });
        data._domainModel = _domainModel;
      } else {
        console.warn("[表单容器] 领域模型服务类型不匹配", _domainModel);
      }
    },
  },
  ':root': {
    style: [
      {
        title: '表单',
        items: [
          {
            title: '背景色',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            target: '.ant-form'
          }
        ]
      },
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '表单项标题',
                catelog: '默认',
                items: [
                  {
                    catelog: '默认',
                    title: '背景色',
                    options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                    target: [`.ant-form-item > div.ant-col.ant-form-item-label`, `.ant-form-item > div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label`]
                  },
                  {
                    catelog: '默认',
                    title: '内容',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: [`.ant-form-item > div.ant-col.ant-form-item-label > label > label`, `.ant-form-item > div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label > label > label`]
                  },
                  {
                    title: '冒号',
                    catelog: '默认',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: [`.ant-form-item > div.ant-col.ant-form-item-label > label:after`, `.ant-form-item > div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label > label:after`]
                  },
                  {
                    title: '对齐方式',
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
                    target: [`.ant-form-item > div.ant-col.ant-form-item-label`, `.ant-form-item > div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-label`]
                  },
                  {
                    title: '边距',
                    catelog: '默认',
                    options: ['margin'],
                    target: `.ant-col:not(.formAction) .ant-form-item`,
                    ifVisible({ data }: EditorResult<Data>) {
                      /**
                       * 领域模型查询区内，为保持样式统一 暂时不支持边距自定义
                       */
                      return !(
                        data?.domainModel?.entity?.fieldAry?.length > 0 &&
                        data?.domainModel?.isQuery
                      );
                    }
                  }
                ]
              },
              {
                title: '表单项提示语',
                catelog: '默认',
                items: [
                  {
                    catelog: '默认',
                    title: '字体',
                    options: ['font'],
                    target: [`.ant-form-item > div.ant-col.ant-form-item-control .formItemDesc`, `.ant-form-item > div.ant-row.ant-form-item-row > div.ant-col.ant-form-item-control .formItemDesc`]
                  }
                ]
              },
              {
                title: '操作项',
                catelog: '默认',
                items: [
                  {
                    title: '内边距',
                    catelog: '默认',
                    options: ['padding'],
                    target: `div.ant-col.formAction`
                  },
                  {
                    title: '外边距',
                    catelog: '默认',
                    options: ['margin'],
                    target: [`div.ant-col.formAction div.ant-row.ant-form-item`, `div.ant-col.formAction div.ant-form-item`]
                  }
                ]
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '移动端',
            items: [
              {
                title: '移动端表单项标题',
                catelog: '移动端',
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
                target: `.mobileWarrper .ant-form-item > div.ant-col.ant-form-item-label`
              }
            ]
          })
        ]
      }
    ],
    items: ({ data, output, env }: EditorResult<Data>, cate1, cate2) => {
      cate1.items = [
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
        //null,
        {
          title: '类型',
          type: 'Select',
          description:
            '表单布局类型，默认为“普通表单”，遵循Antd表单Layout字段特性，支持“水平”、“垂直”、“内联”三种排版方式；“查询表单”布局，预设了支持表单项展开收起的布局方式',
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
          description: '提交时收集被隐藏的表单项字段，默认不收集被隐藏的表单项字段',
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
          title: '动态设置表单项',
          description:
            '开启后, 支持通过逻辑连线,根据已有的编辑态搭建内容，动态设置表格标题、字段和宽度',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useDynamicItems;
            },
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              const hasEvent = input.get(inputIds.setDynamicFormItems);
              const hasEvent1 = output.get(inputIds.setDynamicFormItems);
              if (value) {
                const formatSchema = {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: '表单项字段名'
                      },
                      label: {
                        type: 'string',
                        description: '表单项标签'
                      },
                      relOriginField: {
                        type: 'string',
                        enum: data.items.map((iter) => iter.name),
                        description: `使用搭建态表单中已有的字段类型,可以取以下字段,${data.items
                          .map((iter) => iter.name)
                          .join(',')}`
                      },
                      formItemProps: commonDynamicItemSchema
                    }
                  }
                };
                !hasEvent &&
                  input.add(inputIds.setDynamicFormItems, `动态设置表单项`, formatSchema);
                !hasEvent1 &&
                  output.add(outputIds.setDynamicFormItemsDone, `生成表单项内容完成`, {
                    type: 'any'
                  });
                input
                  .get(inputIds.setDynamicFormItems)
                  .setRels([outputIds.setDynamicFormItemsDone]);
              } else {
                hasEvent && input.remove(inputIds.setDynamicFormItems);
                hasEvent1 && output.remove(inputIds.setDynamicFormItems);
              }
              data.useDynamicItems = value;
            }
          }
        },
        {
          title: '自动滚动到错误的位置',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.autoScrollToError;
            },
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              data.autoScrollToError = value;
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
          title: '表单项布局',
          items: [
            {
              title: '类型',
              type: 'Select',
              description:
                '遵循Antd表单Layout字段特性，默认为 “水平”，水平布局：标题与表单项左右水平分布，标题可配置宽度、垂直布局：标题与表单项垂直上下分布，标题在上方，表单项在下方，标题宽度自适应、内联布局：标题与表单项左右水平分布，标题宽度自适应',
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
              title: '启用24栅格布局系统',
              type: 'Switch',
              description:
                '启用后，每个表单项宽度可以占据8、6、4等可以被24整除的数，相应这一行就被分为了3(24/8)、4(24/6)、6(24/4)列；未启用，可设置一行几列式布局',
              ifVisible({ data, id, name }: EditorResult<Data>) {
                return data.layoutType === 'QueryFilter';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.enable24Grid;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.enable24Grid = value;
                }
              }
            },
            {
              title: '每行列数',
              type: 'Slider',
              description:
                '每行的表单项个数，可以实现平均分布各表单项及操作项，在查询表单下实现一行多列效果',
              options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
              ifVisible({ data, id, name }: EditorResult<Data>) {
                return data.layoutType === 'QueryFilter' && data.enable24Grid !== true;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.formItemColumn;
                },
                set({ data }: EditorResult<Data>, value: number) {
                  data.formItemColumn = value;
                }
              }
            },
            {
              title: '列间距',
              type: 'inputNumber',
              description:
                '每行多列布局下，每列表单项之间的距离；在表单项类型布局为水平或垂直下生效',
              ifVisible({ data }: EditorResult<Data>) {
                return (data.config?.layout || data.layout) !== 'inline';
              },
              options: [{ min: 0, max: 240 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.columnGap !== undefined ? [data.columnGap] : [0];
                },
                set({ data }: EditorResult<Data>, value: number) {
                  data.columnGap = value[0];
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
                return data.layoutType === 'QueryFilter' && data.enable24Grid === true;
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
          title: '移动端配置',
          items: [
            {
              title: '宽度适配',
              ifVisible({ data }: EditorResult<Data>) {
                return (data.config?.layout || data.layout) === 'horizontal';
              },
              type: 'Switch',
              description:
                '表单布局为水平下生效，默认开启，antd内置样式会使标题和表单项内容展示为两行；关闭后，水平模式下，展示成一行',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.mobileConfig?.enableWidthAdaptive;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  if (data.mobileConfig === undefined) {
                    data.mobileConfig = {};
                  }
                  data.mobileConfig.enableWidthAdaptive = value;
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
              title: '标题超长配置',
              type: 'Radio',
              options: [
                { label: '超长省略', value: 'ellipse' },
                { label: '自动换行', value: 'wrap' },
                { label: '默认', value: 'default' }
              ],
              value: {
                set({ data }: EditorResult<Data>, value: 'ellipse' | 'wrap' | 'default') {
                  data.ellipseMode = value;
                },
                get({ data }: EditorResult<Data>) {
                  return data.ellipseMode;
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
  '[data-form-item]': {
    title: '',
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }) {
          if (!focusArea) return;
          let name = focusArea.dataset.formItem;
          const { item } = getFormItem(data, { name });
          return item?.label;
        },
        set({ data, focusArea, input, output }, value) {
          if (!focusArea) return;
          let name = focusArea.dataset.formItem;
          const { item } = getFormItem(data, { name });
          item.label = value;
        }
      }
    },
    items: [
      {
        title: '标题',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            let name = focusArea.dataset.formItem;
            const { item } = getFormItem(data, { name });
            return item?.label;
          },
          set({ data, focusArea }: EditorResult<Data>, val) {
            if (!focusArea) return;
            let name = focusArea.dataset.formItem;
            const { item } = getFormItem(data, { name });
            item.label = val;
          }
        }
      }
    ]
  },
  // formItemEditor为:child(mybricks.normal-pc.form-container/form-item) 部分
  ...formItemEditor,
  // additionFormItemEditor为:child(mybricks.normal-pc.form-container/form-addition-container) 部分
  ...additionFormItemEditor,
  '[data-form-actions]': {
    title: '操作区',
    style: [
      {
        title: '边距',
        options: ['padding', 'margin'],
        target: `.ant-form-item-control-input-content>.ant-space.ant-space-horizontal.ant-space-align-center`
      },
      {
        title: '收起',
        options: ['font'],
        target: '.collapseButton'
      }
    ],
    items: ({ data, output, env }: EditorResult<Data>, cate1) => {
      cate1.title = actionsEditor(data, output, env).title;
      cate1.items = actionsEditor(data, output, env).items;
    }
  },
  ...actionItemEditor
};
