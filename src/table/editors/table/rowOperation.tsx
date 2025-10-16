import { Data } from '../../types';
import { DefaultOnRowScript, OutputIds, SlotIds } from '../../constants';
import { Schemas, setDataSchema } from '../../schema';
import { InputIds } from '../../constants';
export default {
  title: '行操作',
  items: [
    {
      title: '行点击',
      description: '开启后，可以响应行点击事件',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowClick;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableRowClick = value;
          if (value) {
            output.add(OutputIds.ROW_CLICK, '行点击事件', Schemas.ROW_CLICK);
            setDataSchema({ data, output, ...res });
          } else {
            output.remove(OutputIds.ROW_CLICK);
          }
        }
      }
    },
    {
      title: '行点击事件',
      description: '在打开行点击开关后，可以在该事件内编排行点击逻辑',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowClick;
      },
      options: () => {
        return {
          outputId: OutputIds.ROW_CLICK
        };
      }
    },
    {
      title: '单元格点击',
      description: '开启后，可以响应表格的单元格点击事件',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableCellClick;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableCellClick = value;
          if (value) {
            output.add(OutputIds.CELL_CLICK, '单元格点击事件', Schemas.CEll_CLICK);
            setDataSchema({ data, output, ...res });
          } else {
            output.remove(OutputIds.CELL_CLICK);
          }
        }
      }
    },
    {
      title: '单元格点击事件',
      description: '在打开单元格点击开关后，可以在该事件内编排单元格点击逻辑',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableCellClick;
      },
      options: () => {
        return {
          outputId: OutputIds.CELL_CLICK
        };
      }
    },
    {
      title: '行双击',
      description: '开启后，可以响应行双击事件',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowDoubleClick;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableRowDoubleClick = value;
          if (value) {
            output.add(OutputIds.ROW_DOUBLE_CLICK, '行双击事件', Schemas.ROW_CLICK);
            setDataSchema({ data, output, ...res });
          } else {
            output.remove(OutputIds.ROW_DOUBLE_CLICK);
          }
        }
      }
    },
    {
      title: '行双击事件',
      description: '在打开行双击开关后，可以在该事件内编排行双击逻辑',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowDoubleClick;
      },
      options: () => {
        return {
          outputId: OutputIds.ROW_DOUBLE_CLICK
        };
      }
    },
    {
      title: '行属性设置',
      type: 'switch',
      description: '开启后可以根据行数据动态设置行样式和其他属性',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableOnRow;
        },
        set({ data, output, slot, ...res }: EditorResult<Data>, value: boolean) {
          data.enableOnRow = value;
        }
      }
    },
    {
      title: '行属性设置脚本',
      description: '在打开行属性设置开关后，可以通过js代码动态设置表格行的样式和其他属性',
      type: 'code',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableOnRow;
      },
      options: {
        language: 'javascript',
        enableFullscreen: false,
        title: '行属性设置脚本',
        width: 600,
        minimap: {
          enabled: false
        },
        babel: true,
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
        }
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.onRowScript || DefaultOnRowScript;
        },
        set({ data, output }: EditorResult<Data>, value: string) {
          data.onRowScript = value;
        }
      }
    },
    {
      title: '选中行高亮',
      description: '开启后，可以通过逻辑连线连接输入项【设置选中行序号】，选中行会高亮，支持设置选中行的高亮颜色。',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowFocus;
        },
        set({ data, output, input }: EditorResult<Data>, value: boolean) {
          if (value && !data.focusRowStyle) {
            data.focusRowStyle = {
              background: '#40A9FF'
            };
          }
          if (value) {
            input.add(InputIds.SET_FOCUS_ROW, '设置选中行序号', Schemas.SET_FOCUS_ROW);
            output.add(OutputIds.SET_FOCUS_ROW, '设置选中行之后', Schemas.SET_FOCUS_ROW);
            input.get(InputIds.SET_FOCUS_ROW).setRels([OutputIds.SET_FOCUS_ROW]);
          } else {
            input.remove(InputIds.SET_FOCUS_ROW);
            output.remove(InputIds.SET_FOCUS_ROW);
          }
          data.enableRowFocus = value;
        }
      }
    },
    {
      title: '高亮颜色',
      description: '在打开选中行高亮开关后，可以设置高亮的颜色',
      type: 'colorPicker',
      options: {
        plugins: ['bgcolor']
      },
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowFocus;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.focusRowStyle?.background || '#40A9FF';
        },
        set({ data }: EditorResult<Data>, value) {
          if(data.focusRowStyle) {
            data.focusRowStyle['background'] = value;
          }else{
            data.focusRowStyle = {
              background:value
            }
          }
        }
      }
    },
    {
      title: '行移入',
      description: '开启后，可以响应行移入事件',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowMouseEnter;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableRowMouseEnter = value;
          if (value) {
            output.add(OutputIds.ROW_MOUSE_ENTER, '行移入事件', Schemas.ROW_CLICK);
            setDataSchema({ data, output, ...res });
          } else {
            output.remove(OutputIds.ROW_MOUSE_ENTER);
          }
        }
      }
    },

    {
      title: '行移入事件',
      description: '在打开行点击开关后，可以在该事件内编排行移入事件',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowMouseEnter;
      },
      options: () => {
        return {
          outputId: OutputIds.ROW_MOUSE_ENTER
        };
      }
    },
    {
      title: '行移出',
      description: '开启后，可以响应行移出事件',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowMouseLeave;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableRowMouseLeave = value;
          if (value) {
            output.add(OutputIds.ROW_MOUSE_LEAVE, '行移出事件', Schemas.ROW_CLICK);
            setDataSchema({ data, output, ...res });
          } else {
            output.remove(OutputIds.ROW_MOUSE_LEAVE);
          }
        }
      }
    },
    {
      title: '行移出事件',
      description: '在打开行点击开关后，可以在该事件内编排行移出事件',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowMouseLeave;
      },
      options: () => {
        return {
          outputId: OutputIds.ROW_MOUSE_LEAVE
        };
      }
    },
  ]
};
