import formIterm from "./formIterm";
import buttons from "./buttons";

export default Object.assign({}, {
  ':root': [
    {
      title: '标题',
      items: [
        {
          title: '显示标题',
          type: 'switch',
          value: {
            get({data}) {
              return data.title.display
            },
            set({data}, val) {
              return data.title.display = val
            }
          }
        },
        {
          title: '标题内容',
          ifVisible({data}: { data: any }): boolean {
            return data.title.display
          },
          type: 'text',
          value: {
            get({data}) {
              return data.title.content
            },
            set({data}, val) {
              return data.title.content = val
            }
          }
        }
      ]
    },
    {
      title: '表单项',
      items: [
        {
          title: '布局',
          type: 'select',
          options: [
            {value: 'column', label: '竖排'},
            {value: 'row', label: '横排'}
          ],
          value: {
            get({data}) {
              return data.formItemsCfg.layout
            },
            set({data}, val) {
              data.formItemsCfg.layout = val
            }
          }
        },
        {
          ifVisible({data}: { data: any }): boolean {
            return data.formItemsCfg.layout === 'column'
          },
          title: '标题宽度',
          type: 'slider',
          options: {
            min: 50,
            max: 300,
            formatter: 'PX'
          },
          value: {
            get({data}) {
              return data.labelWidth
            },
            set({data}, val) {
              data.labelWidth = val
            }
          }
        },
      ]
    },
    {
      title: '显示工具条',
      type: 'switch',
      value: {
        get({data}) {
          return data.buttons.display
        },
        set({data}, val) {
          return data.buttons.display = val
        }
      }
    },
    {
      title: '添加表单项',
      type: 'button',
      value: {
        set({data}: T_EdtArgs, val) {
          const idx = data.formItems.length + 1
          return data.formItems.push({
            "label": `表单项${idx}`,
            "name": `formitem${idx}`,
            "type": "text"
          })
        }
      }
    }
  ]
}, formIterm, buttons)