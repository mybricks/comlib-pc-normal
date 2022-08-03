import { uuid } from '../utils'
import { message } from 'antd'
import { Data, Location } from './runtime'

interface Result {
  data: Data
  input: any
  output: any
  focusArea?: any
}
const defaultSchema = {
  type: 'follow',
}
export default {
  '@init': ({ data, output, input }: Result) => {
    if (data.tools.length === 0) {
      addBtn({ data, output, input })
    }
  },
  ':root': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规'
    cate1.items = [
      {
        title: '对齐方式',
        type: 'Select',
        options: [
          { value: 'flex-start', label: '居左' },
          { value: 'center', label: '居中' },
          { value: 'flex-end', label: '居右' },
        ],
        value: {
          get({ data }: Result) {
            return data.layout
          },
          set({ data }: Result, value: string) {
            data.layout = value
          },
        },
      },
      {
        title: '添加按钮',
        type: 'Button',
        description: `在工具条中添加按钮，在逻辑视图中会增加一个对应的输出项.`,
        ifVisible() {
          return true
        },
        value: {
          set({ data, output, input }: Result) {
            addBtn({ data, output, input })
          },
        },
      },
      {
        title: '添加按钮组',
        type: 'Button',
        value: {
          set({ data, output, input }: Result) {
            addBtn({ data, output, input, type: 'btngroup' })
          },
        },
      },
      {
        title: '添加开关按钮',
        type: 'Button',
        value: {
          set({ data, output, input }: Result) {
            addBtn({ data, output, input, type: 'switch' })
          },
        },
      },
    ]
    return {
      title: '工具条',
    }
  },
  '[data-btn-id]': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规'
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'btnId', 'title')
          },
          set({ data, focusArea, input, output }: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              const btnId = data.tools[index].id
              const disableEventKey = `disable${btnId}`
              const enableEventKey = `enable${btnId}`
              output.setTitle(btnId, value)
              input.get(disableEventKey) &&
                input.setTitle(disableEventKey, `禁用${value}`)
              input.get(enableEventKey) &&
                input.setTitle(enableEventKey, `启用${value}`)
              input.get(btnId) && input.setTitle(btnId, `设置${value}输出数据`)
            })
            res.title = value
          },
        },
      },
      outputVal('btnId'),
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }) => {
              const res = get(data, focusArea, 'btnId', 'id')
              return {
                outputId: res,
              }
            },
          },
        ],
      },
      ...moveDelete('btnId'),
    ]

    cate2.title = '样式'
    cate2.items = [
      {
        title: '基础样式',
        items: [
          {
            title: '自定义样式',
            type: 'switch',
            description: '是否需要针对文字进行自定义样式',
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'useTextStyle')
              },
              set({ data, focusArea }: Result, value: boolean) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.useTextStyle = value
              },
            },
          },
          {
            title: '样式',
            type: 'style',
            description: '自定义文字样式',
            ifVisible({ data, focusArea }) {
              return get(data, focusArea, 'btnId', 'useTextStyle')
            },
            options: {
              defaultOpen: true,
              plugins: ['font', 'border'],
            },
            value: {
              get({ data, focusArea }: Result) {
                return (
                  get(data, focusArea, 'btnId', 'textStyle') || {
                    color: '#434343',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: 14,
                    lineHeight: 1.5715,
                    borderColor: 'rgb(217, 217, 217)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 4,
                  }
                )
              },
              set({ data, focusArea }: Result, value: object) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.textStyle = value
                res.fontStyle = res.textStyle.fontStyle
              },
            },
          },
          {
            title: '内间距',
            type: 'Inputnumber',
            ifVisible({ data, focusArea }) {
              return get(data, focusArea, 'btnId', 'useTextStyle')
            },
            options: [
              { title: '上', min: 0, max: 1000, width: 50 },
              { title: '右', min: 0, max: 1000, width: 50 },
              { title: '下', min: 0, max: 1000, width: 50 },
              { title: '左', min: 0, max: 1000, width: 50 },
            ],
            value: {
              get({ data, focusArea }: Result) {
                return (
                  get(data, focusArea, 'btnId', 'padding') || [4, 15, 4, 15]
                )
              },
              set({ data, focusArea }: Result, value: number[]) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.padding = value
              },
            },
          },
          {
            title: '风格',
            type: 'Select',
            options() {
              return [
                { value: 'default', label: '默认' },
                { value: 'primary', label: '主按钮' },
                { value: 'dashed', label: '虚线按钮' },
                { value: 'danger', label: '危险按钮' },
                { value: 'link', label: '链接按钮' },
                { value: 'text', label: '文字按钮' },
                // a标签
                { value: 'a', label: '超链接' },
              ]
            },
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'type')
              },
              set({ data, focusArea }: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.type = value
              },
            },
          },
          {
            title: '形状',
            type: 'Select',
            options() {
              return [
                { value: '', label: '默认' },
                { value: 'circle', label: '(椭)圆' },
                { value: 'round', label: '圆角矩形' },
              ]
            },
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'shape')
              },
              set({ data, focusArea }: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.shape = value
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
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'margin')
              },
              set({ data, focusArea }: Result, value: number[]) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.margin = value
              },
            },
          },
          {
            title: '背景色',
            type: 'colorPicker',
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'backgroundColor')
              },
              set({ data, focusArea }: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.backgroundColor = value
              },
            },
          },
          {
            title: '隐藏边框',
            type: 'Switch',
            value: {
              get({ data, focusArea }) {
                return get(data, focusArea, 'btnId', 'hideBorder')
              },
              set({ data, focusArea }, value) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.hideBorder = value
              },
            },
          },
        ],
      },
      icon('btnId'),
    ]

    cate3.title = '高级'
    cate3.items = [
      {
        title: '动态禁用',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            return get(data, focusArea, 'btnId', 'dynamicDisabled')
          },
          set({ data, focusArea, input }, value: boolean) {
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              const disableEventKey = `disable${data.tools[index].id}`
              const enableEventKey = `enable${data.tools[index].id}`
              const disableEvent = input.get(disableEventKey)
              const enableEvent = input.get(enableEventKey)
              if (value) {
                !disableEvent &&
                  input.add(disableEventKey, `禁用${data.tools[index].title}`, {
                    type: 'boolean',
                  })
                !enableEvent &&
                  input.add(enableEventKey, `启用${data.tools[index].title}`, {
                    type: 'any',
                  })
              } else {
                disableEvent && input.remove(disableEventKey)
                enableEvent && input.remove(enableEventKey)
              }
            })
            res.dynamicDisabled = value
          },
        },
      },
      {
        title: '权限Key',
        description: '唯一标识的权限key',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'btnId', 'permissionKey')
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = get(data, focusArea, 'btnId', 'obj')
            res.permissionKey = value
          },
        },
      },
    ]

    return {
      title: '按钮',
    }
  },

  '[data-btngroup-id]': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规'
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'btngroupId', 'title')
          },
          set({ data, focusArea, output }: Result, value: string) {
            get(data, focusArea, 'btngroupId', 'obj', (index) => {
              data.tools[index].title = value
              output.setTitle(data.tools[index].id, value)
            })
          },
        },
      },
      {
        title: '添加按钮',
        type: 'Button',
        value: {
          set({ data, focusArea, output }: Result) {
            get(data, focusArea, 'btngroupId', 'obj', (index: number) => {
              const id = uuid(),
                title = `按钮`
              const defaultBtn = {
                title,
                icon: '',
                outVal: 0,
                size: 'middle',
                useIcon: false,
                location: Location.FRONT,
                showText: true,
                margin: [0, 0],
                type: 'default',
                shape: undefined,
                dataType: 'number',
                useTextStyle: false,
                textStyle: null,
                padding: null,
                id: `${data.tools[index].id}&&${id}`,
              }
              if (data.tools[index].dropdown) {
                output.add(defaultBtn.id, defaultBtn.title, defaultSchema)
              }
              data.tools[index].btns?.push(defaultBtn)
            })
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }) => {
              const res = get(data, focusArea, 'btngroupId', 'id')
              return {
                outputId: res,
              }
            },
          },
        ],
      },
      ...moveDelete('btngroupId'),
    ]

    cate2.title = '样式'
    cate2.items = [
      {
        title: '基础样式',
        items: [
          {
            title: '形状',
            type: 'Select',
            options() {
              return [
                { value: '', label: '默认' },
                { value: 'round', label: '圆角矩形' },
              ]
            },
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btngroupId', 'shape')
              },
              set(
                { data, focusArea }: Result,
                value: 'round' | 'circle' | undefined
              ) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].shape = value
                })
              },
            },
          },
          {
            title: '风格',
            type: 'Select',
            options: [
              { value: 'outline', label: '描边' },
              { value: 'solid', label: '填色' },
            ],
            ifVisible({ data, focusArea }) {
              return !get(data, focusArea, 'btngroupId', 'dropdown')
            },
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btngroupId', 'style')
              },
              set({ data, focusArea }: Result, value: string) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].style = value
                })
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
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btngroupId', 'margin')
              },
              set({ data, focusArea }: Result, value: number[]) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].margin = value
                })
              },
            },
          },
          {
            title: '颜色',
            type: 'Color',
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btngroupId', 'color')
              },
              set({ data, focusArea }: Result, value: string) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].color = value
                })
              },
            },
          },
        ],
      },
    ]

    cate3.title = '高级'
    cate3.items = [
      {
        title: '下拉按钮配置',
        items: [
          {
            title: '下拉',
            type: 'Switch',
            value: {
              get({ data, focusArea }) {
                return get(data, focusArea, 'btngroupId', 'dropdown')
              },
              set({ data, focusArea, output }: Result, value: boolean) {
                const res = get(data, focusArea, 'btngroupId', 'obj')
                res.dropdown = value
                if (value) {
                  res.dropdownName = res.dropdownName || '下拉'
                }
                ;(res.btns || []).forEach((btn) => {
                  const isExist = output.get(btn.id)
                  if (value && !isExist) {
                    output.add(btn.id, btn.title, defaultSchema)
                  }
                  if (!value && isExist) {
                    output.remove(btn.id)
                  }
                })
              },
            },
          },
          {
            title: '下拉按钮名称',
            type: 'Text',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              const res = get(data, focusArea, 'btngroupId', 'obj')
              if (!res.dropdownBtnProps && res.dropdown) {
                res.dropdownBtnProps = {
                  type: 'primary',
                }
              }
              return !!res.dropdown
            },
            value: {
              get({ data, focusArea }) {
                return get(data, focusArea, 'btngroupId', 'dropdownName')
              },
              set({ data, focusArea }: Result, value: string) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].dropdownName = value
                })
              },
            },
          },
          {
            title: '风格',
            type: 'Select',
            options: [
              { value: 'default', label: '默认' },
              { value: 'primary', label: '主按钮' },
              { value: 'dashed', label: '虚线按钮' },
              { value: 'danger', label: '危险按钮' },
              { value: 'link', label: '链接按钮' },
              { value: 'text', label: '文字按钮' },
            ],
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              const res = get(data, focusArea, 'btngroupId', 'obj')
              if (!res.dropdownBtnProps && res.dropdown) {
                res.dropdownBtnProps = {
                  type: 'primary',
                }
              }
              return !!res.dropdown
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                return res?.type
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                res.type = value
              },
            },
          },
          {
            title: '隐藏箭头',
            type: 'Switch',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              const res = get(data, focusArea, 'btngroupId', 'obj')
              if (!res.dropdownBtnProps && res.dropdown) {
                res.dropdownBtnProps = {
                  type: 'primary',
                }
              }
              return !!res.dropdown
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                return res?.hideArrow
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                res.hideArrow = value
              },
            },
          },
          {
            title: '隐藏边框',
            type: 'Switch',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              const res = get(data, focusArea, 'btngroupId', 'obj')
              if (!res.dropdownBtnProps && res.dropdown) {
                res.dropdownBtnProps = {
                  type: 'primary',
                }
              }
              return !!res.dropdown
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                return res?.hideBorder
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                const res = get(
                  data,
                  focusArea,
                  'btngroupId',
                  'dropdownBtnProps'
                )
                res.hideBorder = value
              },
            },
          },
        ],
      },
      {
        title: '权限Key',
        description: '唯一标识的权限key',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'btngroupId', 'permissionKey')
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = get(data, focusArea, 'btngroupId', 'obj')
            res.permissionKey = value
          },
        },
      },
    ]

    return { title: '按钮组' }
  },

  '[data-groupbtn-id]': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规'
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'groupbtnId', 'title')
          },
          set({ data, focusArea, output }: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex) => {
              btns[btnIndex].title = value
              if (output.get(btns[btnIndex].id)) {
                output.setTitle(btns[btnIndex].id, value)
              }
            })
          },
        },
      },
      outputVal('groupbtnId'),
      {
        title: '单击',
        type: '_Event',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          let isDropdown
          get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex, index) => {
            isDropdown = data.tools[index].dropdown
          })
          return !!isDropdown
        },
        options: ({ data, focusArea }) => {
          let outputId
          get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex) => {
            outputId = btns[btnIndex].id
          })
          return {
            outputId,
          }
        },
      },
      {
        title: '设置默认选中',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          let isDropdown
          get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex, index) => {
            isDropdown = data.tools[index].dropdown
          })
          return !isDropdown
        },
        value: {
          set({ data, focusArea }: Result) {
            get(
              data,
              focusArea,
              'groupbtnId',
              'obj',
              (btns, btnIndex, index) => {
                if (data.tools[index].focusId === btns[btnIndex].id) return
                data.tools[index].focusId = btns[btnIndex].id
              }
            )
          },
        },
      },
      ...moveDelete('groupbtnId'),
    ]

    cate2.title = '样式'
    cate2.items = [
      icon('groupbtnId'),
      {
        title: '自定义样式',
        type: 'switch',
        description: '是否需要针对文字进行自定义样式',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'groupbtnId', 'useTextStyle')
          },
          set({ data, focusArea }: Result, value: boolean) {
            const res = get(data, focusArea, 'groupbtnId', 'obj')
            res.useTextStyle = value
          },
        },
      },
      {
        title: '样式',
        type: 'style',
        description: '自定义文字样式',
        ifVisible({ data, focusArea }) {
          return get(data, focusArea, 'groupbtnId', 'useTextStyle')
        },
        options: {
          defaultOpen: true,
          plugins: ['font', 'border'],
        },
        value: {
          get({ data, focusArea }: Result) {
            return (
              get(data, focusArea, 'groupbtnId', 'textStyle') || {
                color: '#434343',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 1.5715,
                borderColor: 'rgb(217, 217, 217)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 4,
              }
            )
          },
          set({ data, focusArea }: Result, value: object) {
            const res = get(data, focusArea, 'groupbtnId', 'obj')
            res.textStyle = value
            res.fontStyle = res.textStyle.fontStyle
          },
        },
      },
      {
        title: '内间距',
        type: 'Inputnumber',
        ifVisible({ data, focusArea }) {
          return get(data, focusArea, 'groupbtnId', 'useTextStyle')
        },
        options: [
          { title: '上', min: 0, max: 1000, width: 50 },
          { title: '右', min: 0, max: 1000, width: 50 },
          { title: '下', min: 0, max: 1000, width: 50 },
          { title: '左', min: 0, max: 1000, width: 50 },
        ],
        value: {
          get({ data, focusArea }: Result) {
            const padding = get(data, focusArea, 'groupbtnId', 'padding') || [
              4, 15, 4, 15,
            ]
            return [...padding]
          },
          set({ data, focusArea }: Result, value: string) {
            get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex) => {
              btns[btnIndex] = { ...btns[btnIndex], padding: value }
            })
          },
        },
      },
      {
        title: '背景色',
        type: 'colorPicker',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'groupbtnId', 'backgroundColor')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, 'groupbtnId', 'obj')
            res.backgroundColor = value
          },
        },
      },
    ]
    return { title: '按钮' }
  },

  '[data-switch-id]': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规'
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'switchId', 'title')
          },
          set({ data, focusArea, output }: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            get(data, focusArea, 'switchId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value)
              data.tools[index].title = value
            })
          },
        },
      },
      {
        title: '默认打开',
        type: 'Switch',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'switchId', 'defaultChecked')
          },
          set({ data, focusArea, output }: Result, value: boolean) {
            get(data, focusArea, 'switchId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value)
              data.tools[index].defaultChecked = value
            })
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }) => {
              const res = get(data, focusArea, 'switchId', 'id')
              return {
                outputId: res,
              }
            },
          },
        ],
      },
      ...moveDelete('switchId'),
    ]

    cate2.title = '高级'
    cate2.items = [
      {
        title: '权限Key',
        description: '唯一标识的权限key',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'switchId', 'permissionKey')
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = get(data, focusArea, 'switchId', 'obj')
            res.permissionKey = value
          },
        },
      },
    ]
    return { title: '开关' }
  },
}

function addBtn({
  data,
  output,
  type = 'btn',
}: {
  data: Data
  output: any
  input: any
  type?: string
}) {
  const id = uuid(),
    title = type === 'switch' ? '开关' : '按钮'
  const schema = {
    type: type === 'btn' ? 'number' : 'boolean',
  }

  const defaultBtn = {
    id,
    title,
    icon: '',
    outVal: 0,
    useIcon: false,
    showText: true,
    size: 'middle',
    type: 'default',
    shape: undefined,
    dataType: 'number',
    location: Location.FRONT,
    distance: '2px',
    backgroundColor: '',
    useTextStyle: false,
    fontSize: '',
    fontWeight: null,
    padding: null,
  }

  switch (type) {
    case 'btn':
    case 'switch':
      output.add(id, title, schema)
      data.tools.push({
        ...defaultBtn,
        type: type === 'switch' ? 'switch' : 'default',
        margin: [0, 0],
      })
      break
    case 'btngroup':
      const id1 = `${id}&&${uuid()}`
      const id2 = `${id}&&${uuid()}`
      const groupTitle = '按钮组'
      output.add(id, groupTitle, schema)
      data.tools.push({
        id,
        outVal: 0,
        focusId: id1,
        margin: [0, 0],
        size: 'middle',
        type: 'btngroup',
        style: 'outline',
        shape: undefined,
        title: groupTitle,
        dataType: 'number',
        color: 'rgba(64,169,255,1)',
        useTextStyle: false,
        textStyle: null,
        padding: null,
        btns: [
          { ...defaultBtn, id: id1, margin: [0, 0] },
          { ...defaultBtn, id: id2, margin: [0, 0] },
        ],
      })
      break
    default:
      break
  }
}

function get(
  data: Data,
  focusArea: any,
  dataset: string,
  val = 'obj',
  cb?: any
) {
  //如果没有聚焦，就返回
  if (!focusArea) return
  //判断一下聚焦区域的类型
  const key = focusArea.dataset[dataset]
  const isGroupbtnId = !['btnId', 'btngroupId', 'switchId'].includes(dataset)
  //按钮组的索引
  const index = isGroupbtnId
    ? data.tools.findIndex((def) => def.id === key.split('&&')[0])
    : data.tools.findIndex((def) => def.id === key)
  if (index === -1) return
  if (!isGroupbtnId) {
    if (cb) cb(index)
    if (val === 'obj') {
      return data.tools[index]
    }
    return data.tools[index][val]
  } else {
    //按钮组
    const { btns } = data.tools[index]
    const btnIndex = (btns || []).findIndex((def) => def.id === key)
    if (btnIndex === -1) return
    if (cb) cb(btns, btnIndex, index)
    if (val === 'obj') {
      return btns?.[btnIndex]
    }
    return btns?.[btnIndex][val]
  }
}

function icon(dataset: string) {
  return {
    title: '图标',
    items: [
      {
        title: '使用图标',
        type: 'Switch',
        ifVisible({ data, focusArea }) {
          return get(data, focusArea, dataset, 'showText')
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'useIcon')
          },
          set({ data, focusArea }: Result, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj')
            if (!res?.icon?.length) {
              res.icon = 'HomeOutlined'
            }
            res.useIcon = value
          },
        },
      },
      {
        title: '显示文字',
        type: 'Switch',
        ifVisible({ data, focusArea }) {
          const res = get(data, focusArea, dataset, 'obj')
          return res?.useIcon && res?.icon?.length ? true : false
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'showText')
          },
          set({ data, focusArea }: Result, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj')
            res.showText = value
          },
        },
      },
      {
        title: '图标位置',
        type: 'Select',
        options: [
          { label: '位于文字前', value: Location.FRONT },
          { label: '位于文字后', value: Location.BACK },
        ],
        ifVisible({ data, focusArea }) {
          const res = get(data, focusArea, dataset, 'obj')
          return res?.useIcon && res?.icon?.length && res.showText
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'location') || Location.FRONT
          },
          set({ data, focusArea }: Result, value: Location) {
            const res = get(data, focusArea, dataset, 'obj')
            res.location = value
          },
        },
      },
      {
        title: '间距',
        type: 'text',
        description: '图标与文字间的距离',
        ifVisible({ data, focusArea }) {
          const res = get(data, focusArea, dataset, 'obj')
          return res?.useIcon && res?.icon?.length && res.showText
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, String(dataset), 'distance')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj')
            if (/^\d+$/.test(value)) {
              res.distance = `${value}px`
            } else {
              res.distance = value
            }
          },
        },
      },
      {
        type: 'Icon',
        ifVisible({ data, focusArea }) {
          return get(data, focusArea, dataset, 'useIcon')
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'icon')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj')
            res.icon = value
          },
        },
      },
    ],
  }
}

function outputVal(dataset: string) {
  return {
    title: '触发数据',
    items: [
      {
        title: '类型',
        type: 'Select',
        options: [
          { value: 'null', label: '无' },
          { value: 'number', label: '数字' },
          { value: 'string', label: '字符' },
          { value: 'object', label: '对象' },
          { value: 'boolean', label: '布尔' },
          { value: 'external', label: '外部传入' },
        ],
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'dataType')
          },
          set({ data, focusArea, input, output }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj', (index) => {
              if (dataset === 'btnId') {
                const outPin = output.get(data.tools[index].id)
                outPin.setSchema({
                  type: 'follow',
                })
              }
            })
            if (value === 'object') {
              res.outVal = {}
            } else if (value === 'number') {
              res.outVal = 0
            } else if (value === 'string') {
              res.outVal = ''
            } else if (value === 'boolean') {
              res.outVal = false
            } else {
              res.outVal = null
            }
            const { id, title } = res
            if (value === 'external') {
              if (id && title) {
                input.add(res.id, `设置${res.title}输出数据`, {
                  type: 'follow',
                })
              }
            } else {
              if (input.get(id)) {
                input.remove(id)
              }
            }
            res.dataType = value
          },
        },
      },
      {
        title: '输出值',
        type: 'Text',
        ifVisible({ data, focusArea }) {
          const dataType = get(data, focusArea, dataset, 'dataType')
          return dataType === 'string'
        },
        description: '点击按钮向外输出的值，可以为任意字符',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'outVal')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj')
            res.outVal = value
          },
        },
      },
      {
        title: '输出值',
        type: 'Text',
        options: {
          type: 'number',
        },
        ifVisible({ data, focusArea }) {
          const dataType = get(data, focusArea, dataset, 'dataType')
          return dataType === 'number'
        },
        description: '点击按钮向外输出的值，只可输入数字',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'outVal')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj')
            res.outVal = Number(value) || 0
          },
        },
      },
      {
        title: '输出值',
        type: 'Switch',
        ifVisible({ data, focusArea }) {
          const dataType = get(data, focusArea, dataset, 'dataType')
          return dataType === 'boolean'
        },
        description: '点击按钮向外输出的值， 打开输出true，关闭输出false',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, dataset, 'outVal')
          },
          set({ data, focusArea }: Result, value: string) {
            const res = get(data, focusArea, dataset, 'obj')
            res.outVal = value
          },
        },
      },
      {
        title: '输出值',
        type: 'TextArea',
        ifVisible({ data, focusArea }) {
          return get(data, focusArea, dataset, 'dataType') === 'object'
        },
        description:
          '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
        value: {
          get({ data, focusArea }: Result) {
            try {
              return (
                JSON.stringify(get(data, focusArea, dataset, 'outVal')) || '{}'
              )
            } catch {
              return '{}'
            }
          },
          set({ data, focusArea }: Result, value: string) {
            try {
              const resValue = JSON.parse(
                value.replace(/\n/g, '').replace(/\r/g, '')
              )
              const res = get(data, focusArea, dataset, 'obj')
              res.outVal = resValue
            } catch {
              message.warning('输出值格式有误, 参考格式{"name": "poweros"}')
            }
          },
        },
      },
    ],
  }
}

function moveDelete(dataset: string) {
  const isGroupbtnId = !['btnId', 'btngroupId', 'switchId'].includes(dataset)
  return [
    {
      title: '前移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false
        get(
          data,
          focusArea,
          dataset,
          'obj',
          !isGroupbtnId
            ? (index) => {
                if (data.tools.length > 1 && index !== 0) {
                  bool = true
                }
              }
            : (btns, btnIndex) => {
                if (btns.length > 1 && btnIndex !== 0) {
                  bool = true
                }
              }
        )
        return bool
      },
      value: {
        set({ data, focusArea }: Result) {
          get(
            data,
            focusArea,
            dataset,
            'obj',
            !isGroupbtnId
              ? (index) => {
                  const tool = data.tools[index]
                  data.tools.splice(index, 1)
                  data.tools.splice(index - 1, 0, tool)
                }
              : (btns, btnIndex) => {
                  const btn = btns[btnIndex]
                  btns.splice(btnIndex, 1)
                  btns.splice(btnIndex - 1, 0, btn)
                }
          )
        },
      },
    },
    {
      title: '后移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false
        get(
          data,
          focusArea,
          dataset,
          'obj',
          !isGroupbtnId
            ? (index) => {
                if (data.tools.length > 1 && index !== data.tools.length - 1) {
                  bool = true
                }
              }
            : (btns, btnIndex) => {
                if (btns.length > 1 && btnIndex !== btns.length - 1) {
                  bool = true
                }
              }
        )
        return bool
      },
      value: {
        set({ data, focusArea }: Result) {
          get(
            data,
            focusArea,
            dataset,
            'obj',
            !isGroupbtnId
              ? (index) => {
                  const tool = data.tools[index]
                  data.tools.splice(index, 1)
                  data.tools.splice(index + 1, 0, tool)
                }
              : (btns, btnIndex) => {
                  const btn = btns[btnIndex]
                  btns.splice(btnIndex, 1)
                  btns.splice(btnIndex + 1, 0, btn)
                }
          )
        },
      },
    },
    {
      title: '删除',
      type: 'Button',
      value: {
        set({ data, focusArea, output }: Result) {
          get(
            data,
            focusArea,
            dataset,
            'obj',
            !isGroupbtnId
              ? (index) => {
                  output.remove(data.tools[index].id)
                  data.tools.splice(index, 1)
                }
              : (btns, btnIndex, index) => {
                  if (btns.length > 1) {
                    if (output.get(btns[btnIndex].id)) {
                      output.remove(btns[btnIndex].id)
                    }
                    btns.splice(btnIndex, 1)
                  } else {
                    output.remove(data.tools[index].id)
                    data.tools.splice(index, 1)
                  }
                }
          )
        },
      },
    },
  ]
}
