import { FormLayout } from 'antd/es/form/Form'
import { FormLabelAlign } from 'antd/es/form/interface'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { FormItemProps, Data, LayoutModel, LabelWidthType, SubmitAction } from '../runtime'
import { setFormModelSchema, getFormModelSchema, inputSubmitSchema, uploadSubmitSchema } from '../schema'
import { uuid } from '../../utils'
import { defaultFormJSComments, defaultFormJSExample, defaultValidatorAnnotation, defaultValidatorExample, } from '../utils'
import formItemEditor from './formItem/index'
import dynamicFormEditor from './dynamicForm'
import formActionsEditor from './formActions'
import compositionItemEditor from './compositionItem'
import radioEditor from './radio'
import checkboxEditor from './checkbox'

export function addCancelOutput(output: any) {
  output.add('cancel', '取消', { type: 'any' })
}

export function addResetOutput(output: any) {
  output.add('reset', '重置', { type: 'any' })
}

export function addFormItem(formItems: FormItemProps[], type?: string, input?: any, output?: any) {
  const lastIndex: number = formItems.length > 0 ? formItems.length - 1 : 0
  const lastFormItem = formItems[lastIndex]
  let label = `表单名称`
  let name = `name`
  const placeholder = `请输入${label}`

  if (lastFormItem) {
    label = `表单名称${lastIndex + 1}`
    name = `name${lastIndex + 1}`
  }

  if (type === 'dynamicItem') {
    name = `field${name}`
  }

  if (type === 'group') {
    formItems.push({
      key: uuid(),
      type,
      label: '标题',
      cusMargin: [0, 24, 16, 0]
    })
    return;
  }

  const newItem: FormItemProps = {
    key: uuid(),
    label: type && type === 'dynamicItem' ? '' : label,
    name,
    size: 'large',
    type: 'inputText',
    disabled: false,
    placeholder,
    isRequired: false,
    validator: defaultValidatorExample,
    blocksValidator: {},
    options: [],
    fieldsFormItems: [],
    compositionItems: [],
    visible: true,
    useCodeValidator: false
  }

  if (newItem.type === 'upload') {
    newItem.uploadConfig = {
      buttonText: '点击上传',
      name: 'file',
      listType: 'text',
      fileType: [],
      fileSize: [],
      fileCount: [],
      inputId: uuid(),
      outputId: uuid()
    }

    output.add(newItem.uploadConfig.outputId, `${newItem.uploadConfig.buttonText} ${lastIndex + 1}`, uploadSubmitSchema)
  }

  if (newItem.type === 'dynamicItem' && newItem.fieldsFormItems.length === 0) {
    addFormItem(newItem.fieldsFormItems, 'dynamicItem')
  }

  if (newItem.type === 'compositionItem' && newItem.compositionItems?.length === 0) {
    addFormItem(newItem.compositionItems, 'compositionItem')
  }

  formItems.push(newItem)
}



let tempSubmitActions = [],
  addSubmitAction,
  delSubmitAction,
  modifyTitle;

const initSubmitActions = ({ data, output, input }: EditorResult<Data>) => {
  data.submitActions && data.submitActions.map((item, index) => {
    if (!item.title) item.title = `提交行为${index + 1}`;  //向前兼容
  })
  tempSubmitActions = data.submitActions || [];

  // 添加一对提交行为
  addSubmitAction = (action: SubmitAction) => {
    data.submitActions.push(action);
    const {
      inputId,
      outputId,
      title
    } = action;
    output.add(outputId, title, {
      title: '表单数据提交',
      type: 'object',
      properties: getFormModelSchema(data),
    })
    input.add(inputId, title, inputSubmitSchema)
    input.get(inputId).setRels([outputId]);
  };
  // 删除一对提交行为
  delSubmitAction = (id: string, index: number) => {
    index = index > 0 ? index : data.submitActions.findIndex(def => def._id === id);
    const action = data.submitActions[index];
    const {
      inputId,
      outputId,
    } = action;
    input.get(inputId) && input.remove(inputId);
    output.get(outputId) && output.remove(outputId);
    data.submitActions.splice(index, 1);
  };
  // 修改输入输出项title
  modifyTitle = (index: number) => {
    if (index === -1) return;
    const action = data.submitActions[index];
    const {
      inputId,
      outputId,
      title
    } = action;
    input.get(inputId) && input.setTitle(inputId, title);
    output.get(outputId) && output.setTitle(outputId, title);
  };
};

export default {
  '@init': ({ data, output, input }: EditorResult<Data>) => {
    if (typeof data.showActions === 'undefined' || data.showActions) {
      addCancelOutput(output)
    }
  },
  ':root': ({ data }: EditorResult<Data>, ...editList) => {
    editList[0].title = '常规';
    editList[0].items = [
      {
        title: '自动提交数据',
        type: 'Switch',
        description: '表单初始化后是否主动触发一次数据提交',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.immediate
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.immediate = value
          },
        },
      },
      {
        title: '数据变化触发提交',
        type: 'Switch',
        description: '表单数据变化后主动触发一次数据提交',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.changeSubmit
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            // if (value) {
            //   output.add('changeSubmit', '数据改变', { type: 'any' })
            // } else {
            //   output.remove('changeSubmit')
            // }
            data['changeSubmit'] = value
          },
        },
      },
      {
        title: '提交额外参数',
        type: 'Switch',
        description: '关闭后仅提交表单数据',
        value: {
          get({ data }: EditorResult<Data>) {
            return !data.noSubmitParmas
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.noSubmitParmas = !value
          },
        },
      },
      {
        title: '提交防抖',
        type: 'Switch',
        description: '开始表单提交防抖',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.submitDebounce?.enable
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            if (typeof data.submitDebounce === 'undefined') {
              data['submitDebounce'] = { enable: value, wait: 300 }
            }

            data.submitDebounce.enable = value
          },
        },
      },
      {
        title: '延迟毫秒数',
        type: 'Slider',
        options: [
          {
            max: 1000,
            min: 0,
            step: 100,
            formatter: 'ms',
          },
        ],
        description: '防抖延迟毫秒数',
        ifVisible({ data }: EditorResult<Data>) {
          return data.submitDebounce?.enable
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.submitDebounce?.wait
          },
          set({ data }: EditorResult<Data>, value: number) {
            if (typeof data.submitDebounce === 'undefined') {
              data['submitDebounce'] = { enable: true, wait: value }
            }

            data.submitDebounce.wait = value
          },
        },
      },
      {
        title: '初始化',
        items: [
          {
            title: '默认初始化表单项描述',
            type: 'Switch',
            description: '表单初始化后是否主动获取表单项描述',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.defaultInitialFormItemDesc
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.defaultInitialFormItemDesc = value
              },
            },
          },
          {
            title: '初始化',
            type: 'code',
            options: {
              theme: 'light',
              title: '编辑初始化逻辑',
              language: 'javascript',
              comments: defaultFormJSComments,
              minimap: {
                enabled: false
              },
              displayType: 'button'
            },
            value: {
              get({ data }) {
                return data.formJS || defaultFormJSExample
              },
              set({ data }, value: string) {
                data.useCode = value ? true : false;
                return data.formJS = value
              },
            }
          }
        ]
      },
      {
        title: '操作项',
        items: [
          {
            title: '按钮组',
            description: '开启展示按钮组',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return typeof data.showActions === 'undefined' || data.showActions
              },
              set({ data, output }: EditorResult<Data>, value: boolean) {
                data.showActions = value
                data.resetBtn.isVisible = value
                if (value) {
                  addCancelOutput(output)
                  addResetOutput(output)
                } else {
                  output.remove('cancel')
                  output.setTitle('submit', '数据提交')
                  output.remove('reset')
                }
              },
            },
          },
        ]
      },
      {
        title: '表单项',
        items: [
          {
            title: '尺寸',
            type: 'Select',
            options: [
              { label: '大', value: 'large' },
              { label: '中', value: 'default' },
              { label: '小', value: 'small' },
            ],
            value: {
              set({ data }: EditorResult<Data>, value: SizeType) {
                data.size = value
              },
              get({ data }: EditorResult<Data>) {
                return data.size
              },
            },
          },
          {
            title: '显示标题',
            type: 'Switch',
            value: {
              set({ data }: EditorResult<Data>, value: boolean) {
                data.showLabel = value
              },
              get({ data }: EditorResult<Data>) {
                return data.showLabel
              }
            }
          },
          {
            title: '显示冒号',
            type: 'Switch',
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal' && data.showLabel
            },
            value: {
              set({ data }: EditorResult<Data>, value: boolean) {
                data.colon = value
              },
              get({ data }: EditorResult<Data>) {
                return !!data.colon
              }
            }
          },
          {
            title: '内容宽度占比',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24',
              },
            ],
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal'
            },
            value: {
              set({ data }: EditorResult<Data>, value: number) {
                // data.labelCol = value
                data.wrapperCol = value
              },
              get({ data }: EditorResult<Data>) {
                return data.wrapperCol
              },
            },
          },
          {
            title: '标题宽度类型',
            type: 'Select',
            options: [
              { label: '固定宽度', value: 'default' },
              { label: '动态宽度', value: 'span' }
            ],
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal' && data.showLabel
            },
            value: {
              set({ data }: EditorResult<Data>, value: LabelWidthType) {
                data.labelWidthType = value
              },
              get({ data }: EditorResult<Data>) {
                return data.labelWidthType || 'default'
              },
            }
          },
          {
            title: '标题宽度(px)',
            type: 'text',
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal' && data.showLabel && (data.labelWidthType === 'default' || !data.labelWidthType)
            },
            value: {
              set({ data }: EditorResult<Data>, value: string) {
                data.labelWidth = ~~value
              },
              get({ data }: EditorResult<Data>) {
                return data.labelWidth || 98
              },
            },
          },
          {
            title: '标题对齐方式',
            type: 'Select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' },
            ],
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal' && data.showLabel
            },
            value: {
              set({ data }: EditorResult<Data>, value: FormLabelAlign) {
                data.labelAlign = value
              },
              get({ data }: EditorResult<Data>) {
                return data.labelAlign
              },
            },
          },
          // {
          //   title: '上下间隔',
          //   type: 'Slider',
          //   options: [{max: 24, min: 0, steps: 1, formatter: 'px'}],
          //   value: {
          //     set({data}: EditorResult<Data>, value: number) {
          //       data.intervalMargin = value
          //     },
          //     get({data}: EditorResult<Data>) {
          //       return data.intervalMargin
          //     },
          //   },
          // },
          {
            title: '单行分布',
            type: 'Slider',
            description: '每行的表单项个数',
            options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
            ifVisible({ data }: EditorResult<Data>) {
              return data.layoutModel !== 'column'
            },
            value: {
              set({ data }: EditorResult<Data>, value: number) {
                data.columnCount = value
                const span = ~~(24 / data.columnCount).toFixed(0)
                data.formItems.map(item => {
                  item.span = span
                  return item
                })
              },
              get({ data }: EditorResult<Data>) {
                return data.columnCount
              },
            },
          },
        ],
      },
      {
        title: '添加表单项',
        type: 'Button',
        value: {
          set({ data, input, output }: EditorResult<Data>) {
            addFormItem(data.formItems, '', input, output)
            setFormModelSchema({ data, output, input })
          },
        },
      },
      {
        title: '添加表单分组',
        type: 'Button',
        value: {
          set({ data, input, output }: EditorResult<Data>) {
            addFormItem(data.formItems, 'group', input, output)
            setFormModelSchema({ data, output, input })
          },
        },
      },
      {
        title: '提交行为',
        type: 'Array',
        options: {
          draggable: false,
          getTitle: (item: SubmitAction, index: number) => {
            if (!item.title) item.title = `提交行为${index + 1}`;  //向前兼容
            return item.title;
          },
          onSelect: (_id: string, index: number) => {
            modifyTitle(index);
          },
          onRemove: (_id: string, index: number) => {
            delSubmitAction(_id, index);
          },
          onAdd: (_id: string) => {
            const inputId = uuid();
            const outputId = uuid();
            const title = `提交行为${tempSubmitActions.length + 1}`;

            const actionItem = {
              inputId,
              outputId,
              title
            }
            addSubmitAction(actionItem);
            return actionItem;
          },
          items: [
            {
              title: '名称',
              type: 'textarea',
              value: 'title'
            }
          ]
        },
        value: {
          get(editorResult: EditorResult<Data>) {
            initSubmitActions(editorResult);
            return editorResult.data.submitActions;
          },
          set({ data }: EditorResult<Data>, value: SubmitAction[]) {
            data.submitActions = value;
            tempSubmitActions = value;
          }
        }
      }
    ]

    editList[1].title = '样式';
    editList[1].items = [
      {
        title: '布局',
        type: 'Select',
        options: [
          { label: '内联', value: 'inline' },
          { label: '行', value: 'row' },
          { label: '列', value: 'column' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: LayoutModel) {
            const layoutMap: Record<string, FormLayout> = {
              row: 'horizontal',
              column: 'vertical',
              inline: 'inline'
            }

            data.layoutModel = value
            data.layout = layoutMap[value]
            data.isFollow = value === 'inline'

            if (value === 'inline') {
              data.columnCount = data.columnCount === 1 ? 3 : data.columnCount
              // data.formItems.map(item => {
              //   if (item.cusMargin) {
              //     // item.cusMargin[3] = 16
              //   } else {
              //     item.cusMargin = [0, 24, 0, 16]
              //   }
              //   return item
              // })
              // data.showLabel = false
            } else if (value === 'column') {
              data.columnCount = 1
              // data.showLabel = true
            } else {
              // data.formItems.map(item => {
              //   if (!item.cusMargin) {
              //     item.cusMargin = [0, 24, 0, 0]
              //   }
              //   return item
              // })
              // data.showLabel = true
            }
          },
          get({ data }: EditorResult<Data>) {
            if (typeof data.layoutModel === 'undefined') {
              data.layoutModel = data.layout === 'inline' ? data.layout : 'row'
            }
            return data.layoutModel
          },
        },
      },
      {
        title: '样式',
        type: 'Style',
        options: ['BGCOLOR'],
        value: {
          get({ data }) {
            return data.bgColor
          },
          set({ data }, value: any) {
            data.bgColor = value
          }
        }
      },
    ];

    editList[2].title = '事件';
    editList[2].items = [
      {
        title: '数据提交',
        type: '_Event',
        options: () => {
          return {
            outputId: 'submit'
          };
        }
      },
      {
        title: '重置完成',
        type: '_Event',
        options: () => {
          return {
            outputId: 'afterReset'
          };
        }
      },
      ...data.submitActions.map(({ title, outputId }) => {
        const customEvent = {
          title,
          type: '_Event',
          options: () => {
            return {
              outputId
            };
          }
        }
        return customEvent;
      })
    ];
  },
  ...formItemEditor,
  ...dynamicFormEditor,
  ...formActionsEditor,
  ...compositionItemEditor,
  ...radioEditor,
  ...checkboxEditor
}