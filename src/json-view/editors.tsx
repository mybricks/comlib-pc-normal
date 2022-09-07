import { Data, OutputIds, Schemas, TypeEnum } from './constant';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
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
      {
        title: '默认JSON数据',
        type: 'Code',
        options: {
          title: 'JSON数据输入',
          language: 'json',
          width: 600,
          minimap: {
            enabled: false
          }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.json;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.json = value;
          }
        }
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '键名 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors[TypeEnum.Key];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors[TypeEnum.Key] = value;
          }
        }
      },
      {
        title: '括号 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors[TypeEnum.Bracket];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors[TypeEnum.Bracket] = value;
          }
        }
      },
      {
        title: '字符串 颜色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors[TypeEnum.String];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors[TypeEnum.String] = value;
          }
        }
      },
      {
        title: '其余类型 颜色',
        description: '数值/布尔/空值/未定义',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colors[TypeEnum.Number];
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.colors[TypeEnum.Number] = value;
          }
        }
      }
    ];

    cate3.title = '事件';
    cate3.items = [
      {
        title: '单击节点事件',
        type: 'Switch',
        description: '开启后单击节点将输出节点数据',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.enableOutput;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.enableOutput = value;
            if (value) {
              output.add(OutputIds.Select, '单击节点', Schemas.Any);
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
            title: '单击节点',
            type: '_Event',
            options: () => {
              return {
                outputId: OutputIds.Select
              };
            }
          }
        ]
      }
    ];
  }
};
