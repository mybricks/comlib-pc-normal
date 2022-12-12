import moment from 'moment';

export default {
  '@resize': {
    options: ['width']
  },
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '前置提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
        value: {
          get({ data }) {
            return data.config.placeholder[0];
          },
          set({ data }, value: string) {
            data.config.placeholder[0] = value;
          }
        }
      },
      {
        title: '后置提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
        value: {
          get({ data }) {
            return data.config.placeholder[1];
          },
          set({ data }, value: string) {
            data.config.placeholder[1] = value;
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
        description: '用 - 分割开始时间和结束时间，不设置默认使用当前时间',
        options: {
          placeholder: '例：00:00:00-23:59:59'
        },
        ifVisible({ data }) {
          return !!data.showTime;
        },
        value: {
          
          get({ data }) {
            const showTime: any = data.showTime
            const defaultValue = showTime?.defaultValue;
            if (Array.isArray(defaultValue)) {
              return defaultValue.join('-');
            }
            if (typeof showTime !== 'object') {
              data.showTime = {}
            }
            return undefined;
          },
          set({ data }, value: string) {
            const arr = value.split('-').map((item) => item.trim());
            const isValid = !arr.some(
              (item) => item && !moment(item, 'HH:mm:ss').isValid()
            );
            data.showTime = { defaultValue: isValid ? arr : undefined }
          },
        }
      },
      {
        title: '输出数据处理',
        items: [
          {
            title: '日期格式化模板',
            type: 'Select',
            description: '将输出(值变化事件和表单提交)的数据设置成所需要的格式',
            options: [
              { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
              { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
              { label: '年-月-日', value: 'Y-MM-DD' },
              { label: '年-月', value: 'Y-MM' },
              { label: '年', value: 'Y' },
              { label: '时间戳', value: 'timeStamp' }, 
              { label: '自定义', value: 'custom' }
            ],
            value: {
              get({ data }) {
                return data.contentType;
              },
              set({ data }, value: string) {
                data.contentType = value;
              }
            }
          },
          {
            title: '自定义格式化模板',
            type: 'text',
            description:
              '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
            ifVisible({ data }) {
              return data.contentType === 'custom';
            },
            value: {
              get({ data }) {
                return data.formatter;
              },
              set({ data }, value: string) {
                data.formatter = value;
              }
            }
          }
        ]
      },
      {
        title: '事件',
        items: [
          {
            title: '初始化',
            type: '_event',
            options: {
              outputId: 'onInitial'
            }
          },
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      }
    ]
  }
}