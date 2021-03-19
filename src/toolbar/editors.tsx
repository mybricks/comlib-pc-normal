import { uuid } from '../util'
import { message } from 'antd'
import { Data } from './runtime'

interface Result {
  data: Data
  input: any
  output: any
  focusArea?: any
}

export default {
  '@init': ({data, output, input}: Result) => {//初始化
    if (data.tools.length === 0) {
      addBtn({data, output, input})
    }
  },
  ':root': [
    {
      title: '对齐方式',
      type: 'Select',
      options: [
        {value: 'flex-start', label: '居左'},
        {value: 'center', label: '居中'},
        {value: 'flex-end', label: '居右'},
      ],
      value: {
        get({data}: Result) {
          return data.layout
        },
        set({data}: Result, value: string) {
          data.layout = value
        }
      }
    },
    {
      title: '添加按钮',
      type: 'Button',
      description: `在工具条中添加按钮，在逻辑视图中会增加一个对应的输出项.`,
      ifVisible() {
        return true
      },
      value: {
        set({data, output, input}: Result) {
          addBtn({data, output, input})
        }
      }
    },
    {
      title: '添加按钮组',
      type: 'Button',
      value: {
        set({data, output, input}: Result) {
          addBtn({data, output, input, type: 'btngroup'})
        }
      }
    },
    {
      title: '添加开关',
      type: 'Button',
      value: {
        set({data, output, input}: Result) {
          addBtn({data, output, input, type: 'switch'})
        }
      }
    },
  ],
  '[data-btn-id]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({data, focusArea}: Result) {
            return get(data, focusArea, 'btnId', 'title')
          },
          set({data, focusArea, input, output}: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value)
            })
            res.title = value
          },
        },
      },
      {
        title: '基础样式',
        items: [
          {
            title: '风格',
            type: 'Select',
            options() {
              return [
                {value: 'default', label: '默认'},
                {value: 'primary', label: '主按钮'},
                {value: 'dashed', label: '虚线按钮'},
                {value: 'danger', label: '危险按钮'},
                {value: 'link', label: '链接按钮'},
                {value: 'text', label: '文字按钮'},
              ]
            },
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btnId', 'type')
              },
              set({data, focusArea}: Result, value: string) {
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
                {value: '', label: '默认'},
                {value: 'circle', label: '(椭)圆'},
                {value: 'round', label: '圆角矩形'},
              ]
            },
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btnId', 'shape')
              },
              set({data, focusArea}: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.shape = value
              },
            },
          },
          {
            title: '间距',
            type: 'Inputnumber',
            options: [
              {title: '左', min: 0, max: 50, width: 50},
              {title: '右', min: 0, max: 50, width: 50},
            ],
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btnId', 'margin')
              },
              set({data, focusArea}: Result, value: number[]) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.margin = value
              },
            }
          },
          {
            title: '隐藏边框',
            type: 'Switch',
            value: {
              get({data, focusArea}) {
                return get(data, focusArea, 'btnId', 'hideBorder')
              },
              set({data, focusArea}, value) {
                const res = get(data, focusArea, 'btnId', 'obj')
                res.hideBorder = value
              },
            }
          },
        ]
      },
      outputVal('btnId'),
      ...moveDelete('btnId')
    ]
  },
  '[data-btngroup-id]': {
    title: '按钮组',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({data, focusArea}: Result) {
            return get(data, focusArea, 'btngroupId', 'title')
          },
          set({data, focusArea, output}: Result, value: string) {
            get(data, focusArea, 'btngroupId', 'obj', (index) => {
              data.tools[index].title = value
              output.setTitle(data.tools[index].id, value)
            })
          },
        }
      },
      {
        title: '基础样式',
        items: [
          {
            title: '形状',
            type: 'Select',
            options() {
              return [
                {value: '', label: '默认'},
                {value: 'round', label: '圆角矩形'},
              ]
            },
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btngroupId', 'shape')
              },
              set({data, focusArea}: Result, value: "round" | "circle" | undefined) {
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
              {value: 'outline', label: '描边'},
              {value: 'solid', label: '填色'}
            ],
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btngroupId', 'style')
              },
              set({data, focusArea}: Result, value: string) {
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
              {title: '左', min: 0, max: 50, width: 50},
              {title: '右', min: 0, max: 50, width: 50},
            ],
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btngroupId', 'margin')
              },
              set({data, focusArea}: Result, value: number[]) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].margin = value
                })
              },
            }
          },
          {
            title: '颜色',
            type: 'colorPicker',
            value: {
              get({data, focusArea}: Result) {
                return get(data, focusArea, 'btngroupId', 'color')
              },
              set({data, focusArea}: Result, value: string) {
                get(data, focusArea, 'btngroupId', 'obj', (index) => {
                  data.tools[index].color = value
                })
              },
            },
          },
        ]
      },
      {
        title: '下拉',
        type: 'Switch',
        value: {
          get({data, focusArea}) {
            return get(data, focusArea, 'btngroupId', 'dropdown')
          },
          set({data, focusArea}: Result, value: boolean) {
            get(data, focusArea, 'btngroupId', 'obj', (index) => {
              data.tools[index].dropdown = value
            })
          },
        }
      },
      {
        title: '下拉按钮名称',
        type: 'Text',
        ifVisible({data, focusArea}) {
          return get(data, focusArea, 'btngroupId', 'dropdown') ? true : false
        },
        value: {
          get({data, focusArea}) {
            return get(data, focusArea, 'btngroupId', 'dropdownName')
          },
          set({data, focusArea}: Result, value: string) {
            get(data, focusArea, 'btngroupId', 'obj', (index) => {
              data.tools[index].dropdownName = value
            })
          },
        }
      },
      ...moveDelete('btngroupId'),
      {
        title: '添加按钮',
        type: 'Button',
        value: {
          set({data, focusArea}: Result) {
            get(data, focusArea, 'btngroupId', 'obj', (index) => {
              const id = uuid(), title = `按钮`
              const defaultBtn = {
                id: `${data.tools[index].id}&&${id}`,
                title,
                size: 'middle',
                type: 'default',
                outVal: 0,
                dataType: 'number',
                shape: '',
                showText: true
              }
              data.tools[index].btns.push(defaultBtn)
            })
          }
        }
      }
    ]
  },
  '[data-groupbtn-id]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({data, focusArea}: Result) {
            return get(data, focusArea, 'groupbtnId', 'title')
          },
          set({data, focusArea, output}: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex) => {
              btns[btnIndex].title = value
            })
          },
        },
      },
      outputVal('groupbtnId'),
      {
        title: '设置默认选中',
        type: 'Button',
        value: {
          set({data, focusArea}: Result) {
            get(data, focusArea, 'groupbtnId', 'obj', (btns, btnIndex, index) => {
              if (data.tools[index].focusId === btns[btnIndex].id) return
              data.tools[index].focusId = btns[btnIndex].id
            })
          },
        },
      },
      ...moveDelete('groupbtnId')
    ]
  },
  '[data-switch-id]': {
    title: '开关',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({data, focusArea}: Result) {
            return get(data, focusArea, 'switchId', 'title')
          },
          set({data, focusArea, output}: Result, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`)
            }
            get(data, focusArea, 'switchId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value)
              data.tools[index].title = value
            })
          }
        }
      },
      {
        title: '默认打开',
        type: 'Switch',
        value: {
          get({data, focusArea}: Result) {
            return get(data, focusArea, 'switchId', 'defaultChecked')
          },
          set({data, focusArea, output}: Result, value: boolean) {
            get(data, focusArea, 'switchId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value)
              data.tools[index].defaultChecked = value
            })
          }
        }
      },
      ...moveDelete('switchId')
    ]
  }
}

function addBtn({data, output, type = 'btn'}: any) {
  const id = uuid(), title = type === 'switch' ? '开关' : '按钮'
  const schema = {
    request: [
      {type: type === 'btn' ? 'number' : 'follow'}
    ],
    response: [
      {type: 'follow'}
    ]
  }

  const defaultBtn = {
    id,
    title,
    size: 'middle',
    type: 'default',
    outVal: 0,
    dataType: 'number',
    shape: '',
    showText: true
  }

  switch (type) {
    case 'btn':
    case 'switch':
      output.add(id, title, schema)
      data.tools.push({...defaultBtn, type: type === 'switch' ? 'switch' : 'default', margin: [0, 0]})
      break
    case 'btngroup':
      const id1 = `${id}&&${uuid()}`
      const id2 = `${id}&&${uuid()}`
      const groupTitle = '按钮组'
      output.add(id, groupTitle, schema)
      data.tools.push({
        title: groupTitle,
        style: 'outline',
        type: 'btngroup',
        id,
        btns: [{...defaultBtn, id: id1}, {...defaultBtn, id: id2}],
        size: 'middle',
        shape: '',
        focusId: id1,
        color: 'rgba(64,169,255,1)',
        dataType: 'number',
        outVal: 0,
        margin: [0, 0]
      })
      break
    default:
      break
  }
}

function get(data, focusArea, dataset, val = 'obj', cb?) {
  if (!focusArea) return
  const key = focusArea.dataset[dataset]
  const isGroupbtnId = !['btnId', 'btngroupId', 'switchId'].includes(dataset)
  const index = isGroupbtnId ? data.tools.findIndex(def => def.id === key.split('&&')[0]) : data.tools.findIndex(def => def.id === key)
  if (index === -1) return
  if (!isGroupbtnId) {
    if (cb) cb(index)
    if (val === 'obj') {
      return data.tools[index]
    }
    return data.tools[index][val]
  } else {
    const { btns } = data.tools[index]
    const btnIndex = btns.findIndex(def => def.id === key)
    if (btnIndex === -1) return
    if (cb) cb(btns, btnIndex, index)
    if (val === 'obj') {
      return btns[btnIndex]
    }
    return btns[btnIndex][val]
  }
}

function outputVal(dataset) {
  return {
    title: '触发数据',
    items: [{
      title: '类型',
      type: 'Select',
      options: [
        {value: 'null', label: '无'},
        {value: 'number', label: '数字'},
        {value: 'string', label: '字符'},
        {value: 'object', label: '对象'},
        {value: 'boolean', label: '布尔'},
        {value: 'external', label: '外部传入'}
      ],
      value: {
        get({data, focusArea}: Result) {
          return get(data, focusArea, dataset, 'dataType')
        },
        set({data, focusArea, input, output}: Result, value: string) {
          const res = get(data, focusArea, dataset, 'obj')
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
              input.add(res.id, res.title, {
                request: [{type: 'follow'}],
                response: [{type: 'follow'}]
              });
            }
          } else {
            if (input.get(id)) {
              input.remove(id)
            }
          }
          res.dataType = value
        },
      },
    },{
      title: '输出值',
      type: 'Text',
      ifVisible({data, focusArea}) {
        const dataType = get(data, focusArea, dataset, 'dataType')
        return dataType === 'string'
      },
      description: '点击按钮向外输出的值，可以为任意字符',
      value: {
        get({data, focusArea}: Result) {
          return get(data, focusArea, dataset, 'outVal')
        },
        set({data, focusArea}: Result, value: string) {
          const res = get(data, focusArea, dataset, 'obj')
          res.outVal = value
        },
      },
    },
    {
      title: '输出值',
      type: 'Text',
      options: {
        type: 'number'
      },
      ifVisible({data, focusArea}) {
        const dataType = get(data, focusArea, dataset, 'dataType')
        return dataType === 'number'
      },
      description: '点击按钮向外输出的值，只可输入数字',
      value: {
        get({data, focusArea}: Result) {
          return get(data, focusArea, dataset, 'outVal')
        },
        set({data, focusArea}: Result, value: string) {
          const res = get(data, focusArea, dataset, 'obj')
          res.outVal = Number(value) || 0
        },
      },
    },
    {
      title: '输出值',
      type: 'Switch',
      ifVisible({data, focusArea}) {
        const dataType = get(data, focusArea, dataset, 'dataType')
        return dataType === 'boolean'
      },
      description: '点击按钮向外输出的值， 打开输出true，关闭输出false',
      value: {
        get({data, focusArea}: Result) {
          return get(data, focusArea, dataset, 'outVal')
        },
        set({data, focusArea}: Result, value: string) {
          const res = get(data, focusArea, dataset, 'obj')
          res.outVal = value
        },
      },
    },
    {
      title: '输出值',
      type: 'TextArea',
      ifVisible({data, focusArea}) {
        return get(data, focusArea, dataset, 'dataType') === 'object'
      },
      description: '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
      value: {
        get({data, focusArea}: Result) {
          try {
            return JSON.stringify(get(data, focusArea, dataset, 'outVal')) || '{}'
          } catch {
            return '{}'
          }
        },
        set({data, focusArea}: Result, value: string) {
          try {
            const resValue = JSON.parse(value.replace(/\n/g, '').replace(/\r/g, ''))
            const res = get(data, focusArea, dataset, 'obj')
            res.outVal = resValue
          } catch {
            message.warning('输出值格式有误, 参考格式{"name": "poweros"}')
          }
        },
      },
    }] 
  }
}

function moveDelete(dataset) {
  const isGroupbtnId = !['btnId', 'btngroupId', 'switchId'].includes(dataset)
  return [{
    title: '前移',
    type: 'Button',
    ifVisible({data, focusArea}: Result) {
      let bool = false
      get(data, focusArea, dataset, 'obj', !isGroupbtnId ? (index) => {
        if (data.tools.length > 1 && index !== 0) {
          bool = true
        }
      } : (btns, btnIndex) => {
        if (btns.length > 1 && btnIndex !== 0) {
          bool = true
        }
      })
      return bool
    },
    value: {
      set({data, focusArea}: Result) {
        get(data, focusArea, dataset, 'obj', !isGroupbtnId ? (index) => {
          const tool = data.tools[index]
          data.tools.splice(index, 1)
          data.tools.splice(index - 1, 0, tool)
        } : (btns, btnIndex) => {
          const btn = btns[btnIndex]
          btns.splice(btnIndex, 1)
          btns.splice(btnIndex - 1, 0, btn)
        })
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({data, focusArea}: Result) {
      let bool = false
      get(data, focusArea, dataset, 'obj', !isGroupbtnId ? (index) => {
        if (data.tools.length > 1 && index !== data.tools.length - 1) {
          bool = true
        }
      } : (btns, btnIndex) => {
        if (btns.length > 1 && btnIndex !== btns.length - 1) {
          bool = true
        }
      })
      return bool
    },
    value: {
      set({data, focusArea}: Result) {
        get(data, focusArea, dataset, 'obj', !isGroupbtnId ? (index) => {
          const tool = data.tools[index]
          data.tools.splice(index, 1)
          data.tools.splice(index + 1, 0, tool)
        } : (btns, btnIndex) => {
          const btn = btns[btnIndex]
          btns.splice(btnIndex, 1)
          btns.splice(btnIndex + 1, 0, btn)
        })
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({data, focusArea, output}: Result) {
        get(data, focusArea, dataset, 'obj', !isGroupbtnId ? (index) => {
          output.remove(data.tools[index].id)
          data.tools.splice(index, 1)
        } : (btns, btnIndex, index) => {
          if (btns.length > 1) {
            btns.splice(btnIndex, 1)
          } else {
            output.remove(data.tools[index].id)
            data.tools.splice(index, 1)
          }
        })
      }
    }
  }]
}