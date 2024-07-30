import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';
import { OutputIds } from '../../constants';

const DynamicTitleEditor = [
  {
    title: '动态设置表头',
    description: `开启后, 原有的表格列不会被使用，可以通过逻辑连线连接表格的输入项【设置表头】, 重新设置当前表格的所有列，包括标题、字段和宽度等。
此时可以使用模板列功能。功能描述如下：新传入的列中，如果设置了template字段，并且在原始列中有字段与该值一样的列，则将以对应列为模板创建新列进行复用`,
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
    description: '开启后, 可以通过逻辑连线连接表格的输入项【修改列属性】，支持动态修改已经存在的列的显隐、标题、字段和宽度',
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