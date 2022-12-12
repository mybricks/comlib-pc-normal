import { Data } from '../types'
import { uuid } from '../../../utils'

export const actionsEditor = (data: Data, output) => {
  return {
    title: '操作区',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.visible
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.visible = val
          }
        }
      },
      {
        title: '显示提交按钮',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.visible;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.items.find(item => item.key === 'submit')?.visible
          },
          set({ data }: EditorResult<Data>, val) {
            const submitItem = data.actions.items.find(item => item.key === 'submit')
            if (submitItem) {
              submitItem.visible = val
            }
          }
        }
      },
      {
        title: '宽度',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.visible;
        },
        type: 'Slider',
        description: '24 栅格，0 则为内容自适应',
        options: {
          max: 24,
          min: 0,
          steps: 1,
          formatter: '/24'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions?.span || 24
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.actions.span = value
          }
        }
      },
      {
        title: '对齐方式',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.visible;
        },
        type: 'Select',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中对齐', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: 'left' | 'center' | 'right') {
            data.actions.align = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.actions.align;
          },
        },
      },
      {
        title: '操作列表',
        description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
        type: 'array',
        options: {
          addText: '添加操作',
          deletable: false,
          editable: false,
          getTitle: (item) => {
            return item?.title;
          },
          onAdd: (_id) => {
            const outputId = uuid()
            const title = `操作${data.actions.items.length + 1}`
            const item = {
              title: title,
              key: outputId,
              outputId,
              isDefault: false,
            }
            output.add(outputId, `点击${title}`, { type: 'any' })
            data.actions.items.push(item)
            return item;
          }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions?.items || [];
          },
          set({ data }: EditorResult<Data>, val: any[]) {
            data.actions.items = val;
          }
        }
      },
    ]
  }
}