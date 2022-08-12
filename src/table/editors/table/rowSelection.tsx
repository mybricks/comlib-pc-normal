import { uuid } from '../../../utils';
import { InputIds, OutputIds, RowSelectionPostion } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';
import { runScript } from '../../utils';

function addBatchBtn({ data, output }) {
  if (!data.batchBtns) {
    data.batchBtns = [];
  }
  if (data.batchBtns.length <= 0) {
    const id = uuid();
    const title = `批量操作${data.batchBtns.length}`;
    data.batchBtns.push({
      id,
      title,
      showText: true
    });
    output.add(id, title, Schemas.BATCH_BTN_CLICK(data));
  }
}

const rowSelectionEditor = (props: EditorResult<Data>) => {
  const suggestions = [];
  props?.data?.columns?.forEach((col) => {
    if (!suggestions.find((item) => col.dataIndex === item.label)) {
      suggestions.push({
        label: col.dataIndex,
        insertText: `{${col.dataIndex}}` + ' === ${2}',
        detail: `当前行${col.dataIndex}值`
      });
    }
  });
  return [
    {
      title: '勾选',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useRowSelection;
        },
        set({ data, input, output }: EditorResult<Data>, value: boolean) {
          data.useRowSelection = value;
          if (value) {
            if (!data.batchBtns?.length) {
              addBatchBtn({ data, output });
            } else {
              const schema = Schemas.BATCH_BTN_CLICK(data);
              data.batchBtns.forEach((item) => {
                const { id, title } = item;
                if (id && !output.get(id)) {
                  output.add(id, title, schema);
                }
              });
            }

            output.add(
              OutputIds.GET_ROW_SELECTION,
              '勾选数据',
              Schemas.GetRowSelection(data)
            );
            input.add(InputIds.CLEAR_ROW_SELECTION, '清空勾选', Schemas.Void);
            input.add(InputIds.GET_ROW_SELECTION, '输出勾选数据', Schemas.Void);
            input
              .get(InputIds.GET_ROW_SELECTION)
              .setRels([OutputIds.GET_ROW_SELECTION]);
          } else {
            data.rowKey = 'uuid';
            data.batchBtns.forEach((item) => {
              output.remove(item.id);
            });
            if (output.get(OutputIds.GET_ROW_SELECTION)) {
              output.remove(OutputIds.GET_ROW_SELECTION);
            }
            if (input.get(InputIds.CLEAR_ROW_SELECTION)) {
              input.remove(InputIds.CLEAR_ROW_SELECTION);
            }
            if (input.get(InputIds.GET_ROW_SELECTION)) {
              input.remove(InputIds.GET_ROW_SELECTION);
            }
          }
        }
      }
    },
    {
      title: '勾选配置',
      ifVisible({ data }: EditorResult<Data>) {
        return data.useRowSelection;
      },
      items: [
        {
          title: '勾选类型',
          type: 'Select',
          options: [
            { label: '单选', value: 'radio' },
            { label: '批量选择', value: 'checkbox' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.selectionType || 'checkbox';
            },
            set({ data }: EditorResult<Data>, value) {
              data.selectionType = value;
            }
          }
        },
        {
          title: '自动提交勾选数据',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return !data.unAutoSelect;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.unAutoSelect = !value;
            }
          }
        },
        {
          title: '勾选限制',
          type: 'inputnumber',
          options: [
            { title: '最多', min: 0, width: '100%', placeholder: '0为不限制' }
          ],
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== 'radio';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.rowSelectionLimit];
            },
            set({ data }: EditorResult<Data>, value: number[]) {
              data.rowSelectionLimit = value[0];
            }
          }
        },
        {
          title: '勾选标识',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.rowKey;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.rowKey = value;
            }
          }
        },
        {
          title: `顶部显示`,
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== 'radio';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(
                RowSelectionPostion.TOP
              );
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostion.TOP
              );
              if (value) {
                temp.push(RowSelectionPostion.TOP);
              }
              data.rowSelectionPostion = temp;
            }
          }
        },
        {
          title: `底部显示`,
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== 'radio';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(
                RowSelectionPostion.BOTTOM
              );
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostion.BOTTOM
              );
              if (value) {
                temp.push(RowSelectionPostion.BOTTOM);
              }
              data.rowSelectionPostion = temp;
            }
          }
        },
        {
          title: '禁止勾选',
          description:
            '禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1',
          type: 'EXPCODE',
          options: {
            autoSize: true,
            placeholder: `禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1`,
            suggestions: suggestions,
            run: (str: string) => {
              return runScript(str, {});
            }
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isDisabledScript;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.isDisabledScript = value;
            }
          }
        },
        {
          title: '动态设置勾选项',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useSetSelectedRowKeys;
            },
            set({ data, input }: EditorResult<Data>, value: boolean) {
              data.useSetSelectedRowKeys = value;
              if (value) {
                input.add(
                  InputIds.SET_ROW_SELECTION,
                  '设置勾选项',
                  Schemas.SET_ROW_SELECTION
                );
              } else {
                input.remove(InputIds.SET_ROW_SELECTION);
              }
            }
          }
        },
        {
          title: '勾选事件',
          type: '_Event',
          options: () => {
            return {
              outputId: OutputIds.GET_ROW_SELECTION
            };
          }
        }
      ]
    }
  ];
};

export { rowSelectionEditor };
