import { Data, AlignTypeEnum, OutputIds, Schemas, InputIds } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '对齐方式',
        type: 'iconradio',
        options: [
          {
            label: '左对齐',
            value: AlignTypeEnum.Left,
            url: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMjA0OCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxOTAiPjxwYXRoIGQ9Ik0yMDEuNjE0MjIyIDUxMy4yNTE1NTZMMjI3LjU1NTU1NiA1MzkuMzA2NjY3IDIyNy41NTU1NTYgNTQwLjQ0NDQ0NGwxLjE5NDY2NiAwIDI5NC42ODQ0NDUwMSAyOTQuNjg0NDQ1IDQwLjIyMDQ0Mzk5LTQwLjI3NzMzM0wzMDkuMTkxMTExIDU0MC40NDQ0NDQgNzk2LjQ0NDQ0NCA1NDAuNDQ0NDQ0bDAtNTYuODg4ODg4LTQ4Ny41OTQ2NjYwMSAwTDU2My42NTUxMTEwMSAyMjguODA3MTExbC00MC4yNzczMzMwMS00MC4yMjA0NDRMMjI4LjQwODg4OSA0ODMuNTU1NTU2IDIyNy41NTU1NTYgNDgzLjU1NTU1NmwwIDAuODUzMzMzLTI1Ljk0MTMzNCAyNS45OTgyMjIgMS40NzkxMTEgMS40MjIyMjItMS40NzkxMTEgMS40MjIyMjN6TTExMy43Nzc3NzggOTEwLjIyMjIyMmw1Ni44ODg4ODkwMSAwTDE3MC42NjY2NjcwMSAxMTMuNzc3Nzc4bC01Ni44ODg4ODkwMSAwIDAgNzk2LjQ0NDQ0NHoiIGZpbGw9IiMxRDFGMjQiIHAtaWQ9IjIwNDkiPjwvcGF0aD48L3N2Zz4='
          },
          {
            label: '居中',
            value: AlignTypeEnum.Center,
            url: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMjE5NyIgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxOTAiPjxwYXRoIGQ9Ik01NDIuOTQ3NTU1OTkgNTEzLjI1MTU1Nkw1NjguODg4ODg5IDUzOS4zMDY2NjcgNTY4Ljg4ODg4OTAxIDU0MC40NDQ0NDRsMS4xOTQ2NjY5OSAwIDE3My45NjYyMjIgMTczLjk2NjIyMyA0MC4yMjA0NDQtNDAuMjIwNDQ1TDY1MC41ODEzMzMgNTQwLjQ0NDQ0NCA4NTMuMzMzMzMzIDU0MC40NDQ0NDRsMC01Ni44ODg4ODgtMjAzLjIwNzExMDk5IDBMNzg0LjI3MDIyMiAzNDkuNTI1MzMzbC00MC4yMjA0NDQtNDAuMjIwNDQ0TDU2OS43NDIyMjIgNDgzLjU1NTU1NiA1NjguODg4ODg5MDEgNDgzLjU1NTU1NmwtMWUtOCAwLjg1MzMzMzAxLTI1Ljk0MTMzMyAyNS45OTgyMjIgMS40MjIyMjIgMS40MjIyMjE5OS0xLjQyMjIyMjAxIDEuNDIyMjIzek00NTUuMTExMTExIDkxMC4yMjIyMjJMNTEyIDkxMC4yMjIyMjIwMSA1MTIgMTEzLjc3Nzc3Nzk5bC01Ni44ODg4ODkgMWUtOCAwIDc5Ni40NDQ0NDR6IG0tMzYxLjkyNzExMS0zNjguNTgzMTEwOTlsMjIxLjUyNTMzMy0wLjA1Njg4OTAxLTEzMy42ODg4ODkgMTMzLjgwMjY2NyA0MC4yMjA0NDUgNDAuMjIwNDQ0IDIwMS4xMDIyMjItMjAxLjE1OTExMS0xLjQyMjIyMi0xLjQyMjIyMiAxLjQyMjIyMi0xLjQyMjIyMi0yMDEuMTAyMjIyLTIwMS4xMDIyMjE5OS00MC4yMjA0NDUgNDAuMjIwNDQzOTkgMTM0LjAzMDIyMyAxMzMuOTczMzMzLTIyMS44NjY2NjcgMC4wNTY4ODkgMCA1Ni44ODg4ODkwMXoiIGZpbGw9IiMxRDFGMjQiIHAtaWQ9IjIxOTgiPjwvcGF0aD48L3N2Zz4='
          },
          {
            label: '右对齐',
            value: AlignTypeEnum.Right,
            url: `data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTg5OSIgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxOTAiPjxwYXRoIGQ9Ik04MjIuMzg1Nzc4IDUxMC43NDg0NDRMNzk2LjQ0NDQ0NCA0ODQuNjkzMzMzIDc5Ni40NDQ0NDQgNDgzLjU1NTU1NmwtMS4xOTQ2NjYgMC0yOTQuNjg0NDQ1MDEtMjk0LjY4NDQ0NS00MC4yMjA0NDM5OSA0MC4yNzczMzNMNzE0LjgwODg4OSA0ODMuNTU1NTU2IDIyNy41NTU1NTYgNDgzLjU1NTU1NmwwIDU2Ljg4ODg4OCA0ODcuNTk0NjY2MDEgMEw0NjAuMzQ0ODg4OTkgNzk1LjE5Mjg4OWw0MC4yNzczMzMwMSA0MC4yMjA0NDRMNzk1LjU5MTExMSA1NDAuNDQ0NDQ0IDc5Ni40NDQ0NDQgNTQwLjQ0NDQ0NGwwLTAuODUzMzMzIDI1Ljk0MTMzNC0yNS45OTgyMjItMS40NzkxMTEtMS40MjIyMjIgMS40NzkxMTEtMS40MjIyMjN6TTkxMC4yMjIyMjIgMTEzLjc3Nzc3OGwtNTYuODg4ODg5MDEgMEw4NTMuMzMzMzMyOTkgOTEwLjIyMjIyMmw1Ni44ODg4ODkwMSAwIDAtNzk2LjQ0NDQ0NHoiIGZpbGw9IiMxRDFGMjQiIHAtaWQ9IjE5MDAiPjwvcGF0aD48L3N2Zz4=`
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.align;
          },
          set({ data }: EditorResult<Data>, value: AlignTypeEnum) {
            data.align = value;
          }
        }
      },
      {
        title: '内容',
        type: 'textarea',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.content;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.content = value;
          }
        }
      },
      {
        title: '文本溢出/省略',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isEllipsis;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.isEllipsis = value;
            if (value === true && !data.ellipsis) {
              data.ellipsis = { rows: 3 };
            }
          }
        }
      },
      {
        title: '最大显示行数',
        type: 'InputNumber',
        options: [{ min: 1, width: '100%' }],
        ifVisible({ data }: EditorResult<Data>) {
          return data.isEllipsis;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.ellipsis.rows];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.ellipsis = { rows: value[0] };
          }
        }
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '动态默认样式',
        description: '开启后，可以通过逻辑连线修改默认样式',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicStyle;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const event = input.get(InputIds.SetStyle);
            if (value) {
              !event && input.add(InputIds.SetStyle, '设置默认样式', Schemas.Style);
            } else {
              event && input.remove(InputIds.SetStyle);
            }
            data.useDynamicStyle = value;
          }
        }
      },
      {
        title: '激活样式',
        description: '开启后，可以为链接分别配置默认样式和鼠标悬浮时的样式',
        type: 'Switch',
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.useHoverStyle;
          },
          set: ({ data }: EditorResult<Data>, value: boolean) => {
            data.useHoverStyle = value;
          }
        }
      },
      {
        title: '默认样式',
        type: 'Style',
        options: {
          plugins: ['Font']
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useHoverStyle;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style;
          },
          set({ data }: EditorResult<Data>, value: object) {
            data.style = {
              ...data.style,
              ...value
            };
          }
        }
      },
      {
        title: '样式',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useHoverStyle;
        },
        catelogChange: {
          value: {
            get({ data }: EditorResult<Data>) {
              return data.styleCatelog;
            },
            set({ data, catelog }: EditorResult<Data>) {
              data.styleCatelog = catelog;
            }
          }
        },
        items: [
          {
            type: 'Style',
            catelog: '默认样式',
            options: {
              plugins: ['Font']
            },
            value: {
              get: ({ data }: EditorResult<Data>) => {
                return data.style;
              },
              set: ({ data }: EditorResult<Data>, value) => {
                data.style = value;
              }
            }
          },
          {
            type: 'style',
            catelog: '激活样式',
            options: {
              plugins: ['Font']
            },
            value: {
              get: ({ data }: EditorResult<Data>) => {
                if (!data.hoverStyle) {
                  data.hoverStyle = { ...data.style };
                }
                return data.hoverStyle;
              },
              set: ({ data }: EditorResult<Data>, value) => {
                data.hoverStyle = value;
              }
            }
          }
        ]
      }
    ];

    cate3.title = '事件';
    cate3.items = [
      {
        title: '点击事件',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useClick;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const event = output.get(OutputIds.Click);
            if (value) {
              !event && output.add(OutputIds.Click, '点击', Schemas.String);
            } else {
              event && output.remove(OutputIds.Click);
            }
            data.useClick = value;
          }
        }
      },
      {
        title: '点击输出内容',
        type: 'text',
        options: {
          placeholder: '默认输出文本内容'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.useClick;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.outputContent;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.outputContent = value;
          }
        }
      },
      {
        title: '点击事件',
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useClick;
        },
        options: () => {
          return {
            outputId: OutputIds.Click
          };
        }
      }
    ];

    return { title: '文本' };
  }
};
