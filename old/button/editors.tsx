export default {
  ':root': [
    {
      title:'标题',
      type: 'text',
      value: {
        get({data}) {
          return data.title
        },
        set({data, width, slot}, val) {
          data.title = val
        }
      }
    },
    {
      title: '风格',
      type: 'Select',
      options() {
        return [
          {value: 'default', label: '默认'},
          {value: 'primary', label: '主按钮'},
          // {value: 'ghost', label: '次按钮'},
          {value: 'dashed', label: '虚线按钮'},
          {value: 'danger', label: '危险按钮'},
          {value: 'link', label: '链接按钮'},
          {value: 'text', label: '文字按钮'},
        ]
      },
      value: {
        get({data}) {
          return data.theme
        },
        set({data}, theme: string) {
          data.theme = theme
        },
      },
    },
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
        get({data}) {
          return data.shape
        },
        set({data}, shape: string) {
          data.shape = shape
        },
      },
    },
    {
      title: '触发数据',
      items: [
        {
          title: '类型',
          type: 'Select',
          options(ctx) {
            return [
              {value: 'null', label: '无'},
              {value: 'number', label: '数字'},
              {value: 'string', label: '字符'},
              {value: 'object', label: '对象'},
              {value: 'boolean', label: '布尔'},
              // {value: 'external', label: '外部传入'}
            ]
          },
          value: {
            get({data}) {
              return data.dataType
            },
            set({data, input, output}, value: string) {

              data.dataType = value

              if (value === 'object') {
                data.outVal = {}
              } else if (value === 'number') {
                data.outVal = 0
              } else if (value === 'string') {
                data.outVal = ''
              } else if (value === 'boolean') {
                data.outVal = false
              } else {
                data.outVal = null
              }
            },
          },
        },
        {
          title: '输出值',
          type: 'Text',
          ifVisible({data}) {
            const dataType = data.dataType
            // return dataType !== void 0 && !['external', 'null'].includes(dataType)
            return dataType === 'string'
          },
          description: '点击按钮向外输出的值，可以为任意字符',
          value: {
            get({data}) {
              return data.outVal
            },
            set({data}, value: string) {
              data.outVal = value
            },
          },
        },
        {
          title: '输出值',
          type: 'Text',
          options: {
            type: 'number'
          },
          ifVisible({data}) {
            return data.dataType === 'number'
          },
          description: '点击按钮向外输出的值，只可输入数字',
          value: {
            get({data}) {
              return data.outVal
            },
            set({data}, value: string) {
              data.outVal = Number(value) || 0
            },
          },
        },
        {
          title: '输出值',
          type: 'Switch',
          ifVisible({data}) {
            return data.dataType === 'boolean'
          },
          description: '点击按钮向外输出的值， 打开输出true，关闭输出false',
          value: {
            get({data}) {
              return data.outVal
            },
            set({data}, value: string) {
              data.outVal = value
            }
          }
        },
        {
          title: '输出值',
          type: 'TextArea',
          ifVisible({data}) {
            return data.dataType === 'object'
          },
          description: '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
          value: {
            get({data}) {
              try {
                return JSON.stringify(data.outVal)
              } catch {
                return "{}"
              }
            },
            set({data}, value: string) {
              try {
                // const resValue = JSON.parse(value.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
                const resValue = JSON.parse(value.replace(/\n/g, '').replace(/\r/g, ''))
                data.outVal = resValue
              } catch (ex) {
                throw  ex
                //message.warning('输出值格式有误, 参考格式{"name": "poweros"}')
              }
            },
          },
        },
      ]
    }
  ]
}