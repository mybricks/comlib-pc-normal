import { uuid } from '../utils'
import { Data } from './constants'

const DefaultSchema = {
  type: 'follow',
}

export default {
  ':root': [
    {
      title: '描述',
      type: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.toolbar.showDesc
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.toolbar.showDesc = value
        },
      },
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '默认', value: 'default' },
        { label: '导航类型', value: 'navigation' },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.toolbar.type
        },
        set({ data }: EditorResult<Data>, value: 'default' | 'navigation') {
          data.toolbar.type = value
        },
      },
    },
    {
      title: '尺寸',
      type: 'Select',
      options: [
        { label: '默认', value: 'default' },
        { label: '迷你', value: 'small' },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.toolbar.size
        },
        set({ data }: EditorResult<Data>, value: 'default' | 'small') {
          data.toolbar.size = value
        },
      },
    },
    {
      title: '方向',
      type: 'Select',
      options: [
        { label: '水平', value: 'horizontal' },
        { label: '竖直', value: 'vertical' },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.direction || 'horizontal'
        },
        set({ data }: EditorResult<Data>, value: 'horizontal' | 'vertical') {
          data.direction = value
        },
      },
    },
    {
      title: '隐藏插槽占位',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.hideSlots
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.hideSlots = value
        },
      },
    },
    {
      title: '按钮组',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return (
            typeof data.toolbar.showActions === 'undefined' ||
            data.toolbar.showActions
          )
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.toolbar.showActions = value
        },
      },
    },
    {
      title: '全量提交',
      type: 'Switch',
      description:
        '当最后一步仍然需要数据记录时打开，会在最后一步数据校验通过后触发全量提交，通常最后一步只用于确认，则不需要开启',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fullSubmit
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.fullSubmit = value
        },
      },
    },
    {
      title: '添加步骤',
      type: 'Button',
      value: {
        set({ data, slot, output }: EditorResult<Data>) {
          const id = uuid()

          slot.add(id)
          output.add(id, `提交_${id}`, DefaultSchema)
          data.stepAry.push({
            id,
            title: '新步骤',
            description: '新添加的步骤',
            index: data.stepAry.length,
          })
          data.stepAry.forEach((item, idx) => {
            output.setTitle(
              item.id,
              idx === data.stepAry.length - 1
                ? '提交'
                : `第${idx + 1}步 -> 下一步`
            )
          })
        },
      },
    },
    {
      title: '事件',
      items: [
        {
          title: '数据提交',
          type: '_Event',
          options: () => {
            return {
              outputId: 'submit',
            }
          },
        },
      ],
    },
  ],
  '[data-item-type="step"]': {
    title: '步骤',
    items: [
      function ({ data, focusArea }: EditorResult<Data>) {
        data.current = focusArea.index
      },
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea
            return data.stepAry[index].title
          },
          set({ data, focusArea, input }: EditorResult<Data>, values: string) {
            const { index } = focusArea
            data.stepAry[index].title = values
            const { id, useDynamicDisplay, title } = data.stepAry[index]
            if (useDynamicDisplay) {
              input.setTitle(`show${id}`, `显示${title}`, {
                type: 'any',
              })
              input.setTitle(`hide${id}`, `隐藏${title}`, {
                type: 'any',
              })
            }
          },
        },
      },
      {
        title: '子标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea
            return data.stepAry[index].subTitle
          },
          set({ data, focusArea }: EditorResult<Data>, values: string) {
            const { index } = focusArea
            data.stepAry[index].subTitle = values
          },
        },
      },
      {
        title: '描述',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea
            return data.stepAry[index].description
          },
          set({ data, focusArea }: EditorResult<Data>, values: string) {
            const { index } = focusArea
            data.stepAry[index].description = values
          },
        },
      },
      {
        title: '动态显示隐藏',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea
            return data.stepAry[index].useDynamicDisplay
          },
          set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
            const { index } = focusArea
            const { id, title } = data.stepAry[index]
            if (value) {
              input.add(`show${id}`, `显示${title}`, {
                type: 'any',
              })
              input.add(`hide${id}`, `隐藏${title}`, {
                type: 'any',
              })
            } else {
              input.remove(`show${id}`)
              input.remove(`hide${id}`)
            }
            data.stepAry[index].useDynamicDisplay = value
          },
        },
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, focusArea, output, slot }: EditorResult<Data>) {
            if (data.stepAry.length === 1) return
            const step = data.stepAry[focusArea.index]
            output.remove(step.id)
            slot.remove(step.id)
            data.stepAry.splice(focusArea.index, 1)
            if (data.stepAry.length > 0) {
              if (focusArea.index == 0) {
                data.current = 0
              } else {
                data.current = data.current - 1
              }
            } else {
              data.current = -1
            }

            data.stepAry.forEach((item, idx) => {
              output.setTitle(
                item.id,
                idx === data.stepAry.length - 1
                  ? '提交'
                  : `第${idx + 1}步 -> 下一步`
              )
            })
          },
        },
      },
    ],
  },
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items: [
      {
        title: '显示副按钮',
        type: 'Switch',
        value: {
          set({ data }: EditorResult<Data>, value: boolean) {
            data.toolbar.showSecondBtn = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.showSecondBtn
          },
        },
      },
      {
        title: '显示重置按钮',
        type: 'Switch',
        value: {
          set({ data }: EditorResult<Data>, value: boolean) {
            data.toolbar.reset = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.reset
          },
        },
      },
      {
        title: '按钮组对齐',
        type: 'Select',
        options: [
          { label: '左对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'flex-end' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            data.toolbar.actionAlign = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.actionAlign
          },
        },
      },
    ],
  },
  '[data-item-type="next"]': {
    title: '主按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return
            data.toolbar.primaryBtnText = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.primaryBtnText
          },
        },
      },
      // {
      //   title: '是否显示加载',
      //   type: 'Switch',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return (
      //       typeof data.toolbar.showActions === undefined ||
      //       data.toolbar.showActions
      //     );
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.useSubmitBtnLoading;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.useSubmitBtnLoading = value;
      //     }
      //   }
      // },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              const id = data.stepAry[data.current]?.id
              return {
                outputId: `${id}`,
              }
            },
          },
        ],
      },
    ],
  },
  '[data-item-type="pre"]': {
    title: '副按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return
            data.toolbar.secondBtnText = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.secondBtnText
          },
        },
      },
    ],
  },
  '[data-item-type="resetBtn"]': {
    title: '重置按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return
            data.toolbar.resetText = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.resetText
          },
        },
      },
    ],
  },
  '[data-item-type="submit"]': {
    title: '提交按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return
            data.toolbar.submitText = value
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.submitText
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: () => {
              return {
                outputId: 'submit',
              }
            },
          },
        ],
      },
    ],
  },
}
