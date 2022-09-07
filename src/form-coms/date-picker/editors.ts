import moment from 'moment';

export default {
  '@resize': {
    options: ['width']
  },
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({id, schema: {type: 'string'}})
    }
  },
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
        value: {
          get({ data }) {
            return data.config.placeholder;
          },
          set({ data }, value: string) {
            data.config.placeholder = value;
          }
        }
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get({ data }) {
            return data.config.disabled;
          },
          set({ data }, value: boolean) {
            data.config.disabled = value;
          }
        }
      },
      {
        title: "日期选择类型",
        type: "Select",
        options: [
          { label: "日期", value: "date" },
          { label: "周", value: "week" },
          { label: "月份", value: "month" },
          { label: "季度", value: "quarter" },
          { label: "年份", value: "year" },
        ],
        value: {
          get({ data }) {
            return data.config.picker;
          },
          set({ data }, value: "date" | "week" | "month" | "quarter" | "year" | undefined) {
            data.config.picker = value;
          },
        },
      },
      {
        title: '时间选择',
        type: 'Switch',
        value: {
          get({ data }) {
            return !!data.showTime;
          },
          set({ data }, value: boolean) {
            data.showTime = value;
          },
        }
      },
      {
        title: '默认时间',
        type: 'Text',
        description: '不设置默认使用当前时间',
        options: {
          placeholder: '例:00:00:00'
        },
        ifVisible({ data }) {
          return !!data.showTime;
        },
        value: {
          get({ data }) {
            
            let showTime: any = data.config.showTime;
            if (typeof showTime?.defaultValue === 'string') {
              return data.showTime?.defaultValue;
            }
            if (typeof showTime !== 'object') {
              data.showTime = {}
            }
            return undefined;
          },set({ data }, value: string) {
            data.showTime = {
              defaultValue: moment(value, 'HH:mm:ss').isValid()
                ? value
                : undefined
            }
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      },
    ]
  }
}