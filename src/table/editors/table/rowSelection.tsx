import { runScript } from '../../../utils/runExpCodeScript';
import { InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY } from '../../constants';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import { Schemas, setDataSchema } from '../../schema';

export function updateSlot({ data, slot }) {
  if (
    data.useRowSelection &&
    data.selectionType !== RowSelectionTypeEnum.Radio &&
    data.rowSelectionPostion?.length
  ) {
    if (!slot.get(SlotIds.ROW_SELECTION_OPERATION)) {
      slot.add({
        id: SlotIds.ROW_SELECTION_OPERATION,
        title: `勾选操作区`,
        type: 'scope'
      });
      slot
        .get(SlotIds.ROW_SELECTION_OPERATION)
        .inputs.add(InputIds.ROW_SELECTION_SELECTED_ROW_KEYS, '当前勾选数据-标识', Schemas.Array);
      slot
        .get(SlotIds.ROW_SELECTION_OPERATION)
        .inputs.add(InputIds.ROW_SELECTION_SELECTED_ROWS, '当前勾选数据-行数据', Schemas.Array);
    }
  } else {
    if (slot.get(SlotIds.ROW_SELECTION_OPERATION)) {
      slot.remove(SlotIds.ROW_SELECTION_OPERATION);
    }
  }
}

const getRowSelectionEditor = (props: EditorResult<Data>) => {
  const suggestions: any[] = [];
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
      description: '开启后，可以进行表格勾选相关的操作。同时可以通过逻辑连线连接输入项【获取勾选数据】和【清空勾选】',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useRowSelection;
        },
        set({ data, input, output, slot, ...res }: EditorResult<Data>, value: boolean) {
          data.useRowSelection = value;
          if (!data.selectionType) {
            data.selectionType = RowSelectionTypeEnum.Checkbox;
          }
          if (value) {

            output.add(OutputIds.ROW_SELECTION, '勾选事件', Schemas.Object);
            output.add(OutputIds.GET_ROW_SELECTION, '勾选数据', Schemas.Object);
            output.add(OutputIds.CLEAR_ROW_SELECTION, '清空勾选后', Schemas.Void);
            output.add(OutputIds.SET_TOGGLE_ROW_SELECTION, '勾选项显示/隐藏', Schemas.Boolean);
            input.add(InputIds.CLEAR_ROW_SELECTION, '清空勾选', Schemas.Void);
            input.add(InputIds.GET_ROW_SELECTION, '获取勾选数据', Schemas.Void);
            input.add(InputIds.SET_TOGGLE_ROW_SELECTION, '勾选项显示/隐藏', Schemas.Boolean);
            input.get(InputIds.GET_ROW_SELECTION).setRels([OutputIds.GET_ROW_SELECTION]);
            input.get(InputIds.CLEAR_ROW_SELECTION).setRels([OutputIds.CLEAR_ROW_SELECTION]);
            input.get(InputIds.SET_TOGGLE_ROW_SELECTION).setRels([OutputIds.SET_TOGGLE_ROW_SELECTION]);
            setDataSchema({ data, input, output, slot, ...res });
          } else {
            if (output.get(OutputIds.GET_ROW_SELECTION)) {
              output.remove(OutputIds.GET_ROW_SELECTION);
            }
            if (output.get(OutputIds.CLEAR_ROW_SELECTION)) {
              output.remove(OutputIds.CLEAR_ROW_SELECTION);
            }
            if (input.get(InputIds.CLEAR_ROW_SELECTION)) {
              input.remove(InputIds.CLEAR_ROW_SELECTION);
            }
            if (input.get(InputIds.GET_ROW_SELECTION)) {
              input.remove(InputIds.GET_ROW_SELECTION);
            }
            
            input.get(InputIds.SET_TOGGLE_ROW_SELECTION) && input.remove(InputIds.SET_TOGGLE_ROW_SELECTION);
          }
          updateSlot({ data, slot })
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
          description: '支持设置勾选类型为单选和批量选择，默认为批量选择',
          type: 'Select',
          options: [
            { label: '单选', value: RowSelectionTypeEnum.Radio },
            { label: '批量选择', value: RowSelectionTypeEnum.Checkbox }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.selectionType || RowSelectionTypeEnum.Checkbox;
            },
            set({ data, slot }: EditorResult<Data>, value: RowSelectionTypeEnum) {
              data.selectionType = value;
              updateSlot({ data, slot });
            }
          }
        },
        {
          title: '勾选限制',
          description: '设置最多勾选几行数据，0表示不限制',
          type: 'inputnumber',
          options: [{ title: '最多', min: 0, width: '100%', placeholder: '0为不限制' }],
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
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
          title: '勾选文案',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          options: {
            locale: true,
            placeholder: `例：已选中 {count} 项, 注意 {count}必填，代表勾选数量`,
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.rowSelectionMessage;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.rowSelectionMessage = value;
            }
          }
        },
        {
          title: `行点击触发勾选`,
          description: '开启后，通过点击表格行就可以触发勾选，不需要额外开启行点击事件',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useRowSelection;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.enableRowClickSelection;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.enableRowClickSelection = value;
            }
          }
        },
        {
          title: `顶部勾选操作区显示`,
          description: '开启后，显示顶部勾选操作区',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.TOP);
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostionEnum.TOP
              );
              if (value) {
                temp.push(RowSelectionPostionEnum.TOP);
              }
              data.rowSelectionPostion = temp;
              updateSlot({ data, slot });
            }
          }
        },
        {
          title: `底部勾选操作区显示`,
          description: '开启后，显示底部勾选操作区',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostionEnum.BOTTOM
              );
              if (value) {
                temp.push(RowSelectionPostionEnum.BOTTOM);
              }
              data.rowSelectionPostion = temp;
              updateSlot({ data, slot });
            }
          }
        },
        {
          title: '合并勾选栏',
          description: '合并后,勾选会输出合并前的多项数据, 不支持单选合并',
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return !!data.enbaleRowMerge;
          },
          type: 'switch',
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return !!data.mergeCheckboxColumn;
            },
            set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value) {
              data.mergeCheckboxColumn = value;
            }
          }
        },
        {
          title: '禁止勾选',
          description: '禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1',
          type: 'EXPRESSION',
          options: {
            autoSize: true,
            placeholder: `禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1`,
            suggestions: suggestions,
            runCode: (str: string) => {
              return runScript(str, {}, TEMPLATE_RENDER_KEY);
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
          description: '开启后，可以通过逻辑连线连接输入项【设置勾选项】, 实现动态设置勾选项',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useSetSelectedRowKeys;
            },
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              data.useSetSelectedRowKeys = value;
              if (value) {
                input.add(InputIds.SET_ROW_SELECTION, '设置勾选项', Schemas.SET_ROW_SELECTION);
                output.add(OutputIds.SET_ROW_SELECTION, '勾选项', Schemas.SET_ROW_SELECTION);
                input.get(InputIds.SET_ROW_SELECTION).setRels([OutputIds.SET_ROW_SELECTION]);
              } else {
                input.remove(InputIds.SET_ROW_SELECTION);
                output.remove(InputIds.SET_ROW_SELECTION);
              }
            }
          }
        },
        {
          title: '动态设置禁用勾选',
          description: '开启后，可以通过逻辑连线连接输入项目【设置禁用勾选】，实现动态设置禁用勾选',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useSetDisabledRowSelection;
            },
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              data.useSetDisabledRowSelection = value;
              if (value) {
                input.add(InputIds.SET_DISABLED_ROW_SELECTION, '设置禁用勾选', Schemas.SET_DISABLED_ROW_SELECTION);
                output.add(OutputIds.SET_DISABLED_ROW_SELECTION, '禁用勾选', Schemas.SET_DISABLED_ROW_SELECTION);
                input.get(InputIds.SET_DISABLED_ROW_SELECTION).setRels([OutputIds.SET_DISABLED_ROW_SELECTION]);
              } else {
                input.remove(InputIds.SET_DISABLED_ROW_SELECTION);
                output.remove(InputIds.SET_DISABLED_ROW_SELECTION);
              }
            }
          }
        },
        {
          title: '勾选事件',
          type: '_Event',
          options: () => {
            return {
              outputId: OutputIds.ROW_SELECTION
            };
          }
        }
      ]
    }
  ];
};

export { getRowSelectionEditor };
