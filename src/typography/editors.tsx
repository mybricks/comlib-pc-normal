import { uuid } from '../utils'
import { Color, Data, Item } from './constants'

function findEle({ data, focusArea }, dataname): Item {
  const id = focusArea.dataset[dataname]
  return data.items.find((item) => item.key === id) || {}
}

const contentSchema = {
    type: 'string',
  },
  extendSchema = {
    type: 'object',
    properties: {
      value: {
        type: 'string',
      },
      color: {
        type: 'string',
      },
    },
  },
  defaultStyle = {
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 0,
    lineHeight: 1,
    color: '#000',
  }

export default {
  '@init': ({ data }) => {
    data.items.push({
      src: 1,
      key: uuid(),
      type: 'Text',
      content: '文本',
      oldcontent: '文本',
      textType: '',
      stylePadding: [0, 0],
      style: { ...defaultStyle },
    })
  },
  ':root': [
    {
      title: '水平对齐方式',
      type: 'Select',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中对齐', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      value: {
        get({ data }) {
          return data.style?.textAlign || 'left'
        },
        set({ data }, value) {
          data.style = {
            ...data.style,
            textAlign: value,
          }
        },
      },
    },
    {
      title: '样式',
      type: 'style',
      options: ['BORDER'],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.style
        },
        set({ data }: EditorResult<Data>, value: any) {
          if (typeof data.style == 'undefined') {
            data.style = {}
          }
          data.style = value
        },
      },
    },
    {
      title: '增加文本',
      type: 'Button',
      value: {
        set({ data }) {
          data.items.push({
            src: 1,
            key: uuid(),
            type: 'Text',
            content: '文本',
            oldcontent: '文本',
            textType: '',
            stylePadding: [0, 0],
            style: { ...defaultStyle },
          })
        },
      },
    },
    {
      title: '增加标签',
      type: 'Button',
      value: {
        set({ data }) {
          data.items.push({
            src: 1,
            key: uuid(),
            type: 'Tag',
            content: '标签',
            oldcontent: '标签',
            color: 'success',
            stylePadding: [0, 0],
            style: {},
          })
        },
      },
    },
  ],
  '[data-item-type="text"]': {
    title: '文本',
    items: [
      {
        title: '动态获取文本',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'textId').src === 1
              ? false
              : true
          },
          set({ data, focusArea, input }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'textId').src = value ? 2 : 1
            if (value) {
              findEle({ data, focusArea }, 'textId').content = '[外部获取]'
              data.items.forEach((item, idx) => {
                if (item.src === 2) {
                  input.add(item.key, `修改元素${idx + 1}内容`, contentSchema)
                  input.add(
                    item.key + '-extend',
                    `修改元素${idx + 1}`,
                    extendSchema
                  )
                }
              })
            } else {
              findEle({ data, focusArea }, 'textId').content = findEle(
                { data, focusArea },
                'textId'
              ).oldcontent
              input.remove(findEle({ data, focusArea }, 'textId').key)
              input.remove(
                findEle({ data, focusArea }, 'textId').key + '-extend'
              )
            }
          },
        },
      },
      {
        title: '动态追加',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'textId').useAppend
          },
          set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return
            const item = findEle({ data, focusArea }, 'textId')
            item.useAppend = value
            const inputKey = `${item.key}-append`
            if (value) {
              data.items.forEach((item, idx) => {
                if (item.useAppend) {
                  input.add(inputKey, `追加元素${idx + 1}内容`, contentSchema)
                }
              })
            } else {
              input.remove(inputKey)
            }
          },
        },
      },
      {
        title: '点击事件',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'textId').click ? true : false
          },
          set({ data, focusArea, output }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'textId').click = value
            if (value) {
              data.items.forEach((item, idx) => {
                if (item.click) {
                  output.add(item.key, `元素${idx + 1}(点击)`, contentSchema)
                }
              })
            } else {
              // output.remove(findEle({ data, focusArea }, 'textId').key);
            }
          },
        },
      },
      {
        title: '单击',
        type: '_Event',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'textId').click ? true : false
        },
        options: ({ data, focusArea }) => {
          return {
            outputId: findEle({ data, focusArea }, 'textId').key,
          }
        },
      },
      {
        title: '点击输出内容',
        type: 'Text',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'textId').click ? true : false
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'textId').outputContent
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'textId').outputContent = value
          },
        },
      },
      {
        title: '文本样式',
        type: 'Character',
        value: {
          get({ data, focusArea }) {
            return findEle({ data, focusArea }, 'textId').style
          },
          set({ data, focusArea }, value) {
            findEle({ data, focusArea }, 'textId').style = value
          },
        },
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [
          { title: '左', min: 0, max: 50, width: 50 },
          { title: '右', min: 0, max: 50, width: 50 },
        ],
        value: {
          get({ data, focusArea }) {
            return findEle({ data, focusArea }, 'textId').stylePadding
          },
          set({ data, focusArea }, value) {
            findEle({ data, focusArea }, 'textId').stylePadding = value
          },
        },
      },
      {
        title: '文本内容',
        type: 'Textarea',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'textId').content
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'textId').content = value
            findEle({ data, focusArea }, 'textId').oldcontent = value
          },
        },
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'textId')
            ? findEle({ data, focusArea }, 'textId').src === 1
            : true
        },
      },
      {
        title: '删除元素',
        type: 'Button',
        value: {
          set({ data, focusArea, input }) {
            if (!focusArea || data.items.length === 0) return
            const id = focusArea.dataset['textId']
            const idx = data.items.findIndex((item) => item.key === id)
            input.remove(data.items[idx].key)
            input.remove(data.items[idx].key + '-extend')
            idx !== -1 && data.items.splice(idx, 1)
          },
        },
      },
    ],
  },
  '[data-item-type="tag"]': {
    title: '标签',
    items: [
      {
        title: '动态获取文本',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'tagId').src === 1
              ? false
              : true
          },
          set({ data, focusArea, input }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'tagId').src = value ? 2 : 1
            if (value) {
              findEle({ data, focusArea }, 'tagId').content = '[外部获取]'
              data.items.forEach((item, idx) => {
                if (item.src === 2) {
                  input.add(item.key, `修改元素${idx + 1}内容`, contentSchema)
                  input.add(
                    item.key + '-extend',
                    `修改元素${idx + 1}`,
                    extendSchema
                  )
                }
              })
            } else {
              findEle({ data, focusArea }, 'tagId').content = findEle(
                { data, focusArea },
                'tagId'
              ).oldcontent
              input.remove(findEle({ data, focusArea }, 'tagId').key)
              input.remove(
                findEle({ data, focusArea }, 'tagId').key + '-extend'
              )
            }
          },
        },
      },
      {
        title: '点击事件',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'tagId').click ? true : false
          },
          set({ data, focusArea, output }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'tagId').click = value
            if (value) {
              data.items.forEach((item, idx) => {
                if (item.click) {
                  output.add(item.key, `元素${idx + 1}(点击)`, contentSchema)
                }
              })
            } else {
              // output.remove(findEle({ data, focusArea }, 'tagId').key);
            }
          },
        },
      },
      {
        title: '单击',
        type: '_Event',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'tagId').click ? true : false
        },
        options: ({ data, focusArea }) => {
          return {
            outputId: findEle({ data, focusArea }, 'tagId').key,
          }
        },
      },
      {
        title: '点击输出内容',
        type: 'Text',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'tagId').click ? true : false
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'tagId').outputContent
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'tagId').outputContent = value
          },
        },
      },
      {
        title: '标签内容',
        type: 'Text',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'tagId').content
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'tagId').content = value
            findEle({ data, focusArea }, 'tagId').oldcontent = value
          },
        },
        ifVisible({ data, focusArea }) {
          if (!focusArea) return
          return findEle({ data, focusArea }, 'tagId')
            ? findEle({ data, focusArea }, 'tagId').src === 1
            : true
        },
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [
          { title: '左', min: 0, max: 50, width: 50 },
          { title: '右', min: 0, max: 50, width: 50 },
        ],
        value: {
          get({ data, focusArea }) {
            return findEle({ data, focusArea }, 'tagId').stylePadding
          },
          set({ data, focusArea }, value) {
            findEle({ data, focusArea }, 'tagId').stylePadding = value
          },
        },
      },
      {
        title: '标签类型',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '成功', value: 'success' },
          { label: '运行', value: 'processing' },
          { label: '警告', value: 'warning' },
          { label: '失败', value: 'error' },
        ],
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            return findEle({ data, focusArea }, 'tagId').color
          },
          set({ data, focusArea }, value: Color) {
            if (!focusArea) return
            findEle({ data, focusArea }, 'tagId').color = value
          },
        },
      },
      {
        title: '删除标签',
        type: 'Button',
        value: {
          set({ data, focusArea, input }) {
            if (!focusArea || data.items.length === 0) return
            const id = focusArea.dataset['tagId']
            const idx = data.items.findIndex((item) => item.key === id)
            input.remove(data.items[idx].key)
            input.remove(data.items[idx].key + '-extend')
            idx !== -1 && data.items.splice(idx, 1)
          },
        },
      },
    ],
  },
}
