import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';
import { OutputIds } from '../../constants';

const DynamicTitleEditor = [
  {
    title: '动态设置表头',
    description: '开启后, 支持通过逻辑连线, 动态设置表格标题、字段和宽度',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useDynamicTitle;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SET_SHOW_TitleS);
        const hasEvent1 = output.get(InputIds.SET_SHOW_TitleS);
        if (value) {
          !hasEvent && input.add(InputIds.SET_SHOW_TitleS, `设置表头`, Schemas.SET_SHOW_TitleS);
          !hasEvent1 && output.add(InputIds.SET_SHOW_TitleS, `表头`, Schemas.SET_SHOW_TitleS);
          input.get(InputIds.SET_SHOW_TitleS).setRels([OutputIds.SET_SHOW_TitleS]);
        } else {
          hasEvent && input.remove(InputIds.SET_SHOW_TitleS);
          hasEvent1 && output.remove(InputIds.SET_SHOW_TitleS);
        }
        data.useDynamicTitle = value;
      }
    }
  },
  {
    title: '动态修改列属性',
    description: '开启后, 支持通过逻辑连线, 动态修改已有列的显隐、标题、字段和宽度',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.enableDynamicChangeCols;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.CHANGE_COLS_ATTR);
        const hasEvent1 = output.get(InputIds.CHANGE_COLS_ATTR);
        if (value) {
          !hasEvent && input.add(InputIds.CHANGE_COLS_ATTR, `修改列属性`, Schemas.CHANGE_COLS_ATTR);
          !hasEvent1 && output.add(InputIds.CHANGE_COLS_ATTR, `列属性`, Schemas.CHANGE_COLS_ATTR);
          input.get(InputIds.CHANGE_COLS_ATTR).setRels([OutputIds.CHANGE_COLS_ATTR]);
        } else {
          hasEvent && input.remove(InputIds.CHANGE_COLS_ATTR);
          hasEvent1 && output.remove(InputIds.CHANGE_COLS_ATTR);
        }
        data.enableDynamicChangeCols = value;
      }
    }
  }
];

export default DynamicTitleEditor;