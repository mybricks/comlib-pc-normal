import { Data, InputIds, OutputIds } from './constant';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate2.title = '样式';
    cate3.title = '高级';
    cate1.items = [
      // 数据源
      {
        title: '数据源',
        type: 'Select',
        options: [
          { label: '手动输入', value: 1 },
          { label: '动态获取', value: 2 }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.dataSource;
          },
          set({ data, input }: EditorResult<Data>, value: 1 | 2) {
            data.dataSource = value;
            if (value === 2) {
              input.add(InputIds.SetJsonData, '数据输入', {
                type: 'any'
              });
            } else {
              input.remove(InputIds.SetJsonData);
            }
          }
        }
      },
      {
        title: '数据源类型',
        type: 'Select',
        options: [
          { label: '数组', value: 'array' },
          { label: '对象', value: 'object' }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.dataSource === 2;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.dataSourceType;
          },
          set({ data, input }: EditorResult<Data>, value: 'array' | 'object') {
            data.dataSourceType = value;
            const dsInput = input.get(InputIds.SetJsonData);
            const slotInput = input.get(InputIds.SlotProps);
            dsInput.setSchema({ type: value });
            slotInput?.setSchema({ type: value });
          }
        }
      },
      // 默认展开深度
      {
        title: '默认展开深度',
        type: 'InputNumber',
        description: '0表示全部折叠,-1表示全部展开',
        options: [{ min: -1, max: 20, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.collapsed];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.collapsed = value[0];
          }
        }
      },
      // 属性值长度限制
      {
        title: '字符串长度限制',
        type: 'InputNumber',
        description:
          '为字符串类型的属性设置长度限制，超出部分以...表示，鼠标悬浮气泡展示完整内容。0表示不限制',
        options: [{ min: 0, max: 100, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.collapseStringsAfterLength];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.collapseStringsAfterLength = value[0];
          }
        }
      },
      //显示条目
      {
        title: '大小标记',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.displayObjectSize;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.displayObjectSize = value;
          }
        }
      },
      //节点复制
      {
        title: '单击节点复制',
        type: 'Switch',
        description: '开启后单击节点将属性值复制到粘贴板',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.enableClipboard;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.enableClipboard = value;
          }
        }
      },
      //节点输出
      {
        title: '单击节点输出',
        type: 'Switch',
        description: '开启后单击节点将输出节点数据',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.enableOutput;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.enableOutput = value;
            if (value) {
              output.add(OutputIds.Select, '节点数据', {
                type: 'any'
              });
            } else {
              output.remove(OutputIds.Select);
            }
          }
        }
      },
      {
        ifVisible({ data }: EditorResult<Data>) {
          return data.enableOutput;
        },
        items: [
          {
            title: '节点输出',
            type: '_Event',
            options: () => {
              return {
                outputId: OutputIds.Select
              };
            }
          }
        ]
      },
      // 静态JSON
      {
        title: 'JSON数据',
        type: 'Code',
        options: {
          title: 'JSON数据输入',
          language: 'json',
          width: 600,
          minimap: {
            enabled: false
          }
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.dataSource === 1;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.json;
          },
          set({ data, input }: EditorResult<Data>, value: string) {
            data.json = window.decodeURIComponent(value);
          }
        }
      }
      // 缩进
      // {
      //   title: '缩进',
      //   type: 'InputNumber',
      //   options: [{ min: 0, max: 20, width: 100 }],
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return [data.indentWidth];
      //     },
      //     set({ data }: EditorResult<Data>, value: number[]) {
      //       data.indentWidth = value[0];
      //     },
      //   },
      // },
    ];
    cate2.items = [
      // 字体
      // {
      //   type: 'Style',
      //   options: ['font'],
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.style;
      //     },
      //     set({ data }: EditorResult<Data>, value: CSSProperties) {
      //       data.style = value;
      //     }
      //   }
      // },
      // 颜色配置
      {
        title: '键名 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors['key'];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors['key'] = value;
          }
        }
      },
      {
        title: '括号 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors['bracket'];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors['bracket'] = value;
          }
        }
      },
      {
        title: '字符串 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors['string'];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors['string'] = value;
          }
        }
      },
      {
        title: '其余类型 颜色',
        description: '数值/布尔/空值/未定义',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors['number'];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors['number'] = value;
          }
        }
      }
    ];
    cate3.items = [
      {
        title: '插槽数据传入',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSlotProps;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            data.useSlotProps = value;
            const isHas = input.get(InputIds.SlotProps);
            if (value) {
              !isHas && input.add(InputIds.SlotProps, '插槽数据', { type: 'any' });
            } else {
              isHas && input.remove(InputIds.SlotProps);
            }
          }
        }
      }
    ];
  }
};
