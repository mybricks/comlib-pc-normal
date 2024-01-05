import { Data } from '../../types';
import { DefaultOnRowScript, OutputIds, SlotIds } from '../../constants';
import { Schemas, setDataSchema } from '../../schema';
import { InputIds } from '../../constants';
export default {
  title: '行操作',
  items: [
    {
      title: '行点击',
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
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableRowFocus;
        },
        set({ data, output, input }: EditorResult<Data>, value: boolean) {
          if (value && !data.focusRowStyle) {
            data.focusRowStyle = {
              background: '#dedede'
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
      type: 'style',
      options: {
        plugins: ['bgcolor']
      },
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableRowFocus;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.focusRowStyle || {};
        },
        set({ data, output }: EditorResult<Data>, value) {
          data.focusRowStyle = value;
        }
      }
    }
  ]
};
