import { Data, LabelWidthType } from '../types'
import { uuid } from '../../../utils'
import visibleOpt from '../../../components/editorRender/visibleOpt'

export const actionsEditor = (data: Data, output) => {

  if (!data.actions) {
    data.actions = {
      visible: true,
      widthOption: 'span',
      span: 24,
      width: 400,
      align: 'left',
      inlinePadding: [0, 0, 0, 0],
      items: [
        {
          title: '添加一项',
          isDefault: true,
          visible: true,
          outputId: 'onClickAdd',
          key: 'add',
        },
        {
          title: '删除',
          isDefault: true,
          visible: true,
          outputId: 'onClickRemove',
          key: 'remove',
        },
      ],
    }
  }
  const { actions } = data;

  return {
    title: '操作区',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return actions.visible
          },
          set({ data }: EditorResult<Data>, val) {
            actions.visible = val
          }
        }
      },
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
          },
          {
            label: '填充剩余宽度',
            value: 'flexFull'
          }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.layout !== 'inline'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return actions.widthOption;
          },
          set({ data }: EditorResult<Data>, value: LabelWidthType) {
            actions.widthOption = value;
          }
        },
      },
      {
        title: '宽度配置(共24格)',
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
          return data.actions.widthOption === 'span' && data.config.layout !== 'inline';
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return actions.span;
          },
          set({ data }: EditorResult<Data>, value: number) {
            actions.span = value;
          }
        },
      },
      {
        title: '宽度配置(px)',
        type: 'text',
        options: {
          type: 'number'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.widthOption === 'px' && data.config.layout !== 'inline';
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return actions.width;
          },
          set({ data }: EditorResult<Data>, value: number) {
            actions.width = value;
          }
        },
      },
      {
        title: '对齐方式',
        ifVisible({ data }: EditorResult<Data>) {
          return actions.visible;
        },
        type: 'Radio',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中对齐', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: 'left' | 'center' | 'right') {
            actions.align = value;
          },
          get({ data }: EditorResult<Data>) {
            return actions.align;
          },
        },
      },
      {
        title: '边距',
        type: 'inputNumber',
        options: [{ min: 0, title: '上' }, { min: 0, title: '右' }, { min: 0, title: '下' }, { min: 0, title: '左' }],
        value: {
          get({ data }: EditorResult<Data>) {
            return actions.inlinePadding;
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            actions.inlinePadding = value
          }
        }
      },
      {
        title: '边距应用所有表单项',
        type: 'Button',
        value: {
          set({ data }: EditorResult<Data>) {
            const margin = actions.inlinePadding || [0, 0, 0, 0];
            data.items.forEach(item => item.inlineMargin = [...margin]);
          }
        }
      },
      {
        title: '操作列表',
        description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
        type: 'array',
        options: {
          addText: '添加操作',
          deletable: false,
          editable: false,
          customOptRender: visibleOpt,
          getTitle: (item) => {
            return item?.title;
          },
          onAdd: (_id) => {
            const outputId = uuid()
            const title = `操作${actions.items.length + 1}`
            const item = {
              title: title,
              key: outputId,
              outputId,
              isDefault: false,
              visible: true
            }
            output.add(outputId, `点击${title}`, { type: 'any' })
            actions.items.push(item)
            return item;
          }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return actions?.items || [];
          },
          set({ data }: EditorResult<Data>, val: any[]) {
            actions.items = val;
          }
        }
      },
    ]
  }
}