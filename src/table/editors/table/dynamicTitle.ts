import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const DynamicTitleEditor = [
  {
    title: '动态设置表头',
    description: '开启后, 支持通过逻辑连线, 动态设置表格标题和字段',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useDynamicTitle;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SET_SHOW_TitleS);
        if (value) {
          !hasEvent && input.add(InputIds.SET_SHOW_TitleS, `设置表头`, Schemas.SET_SHOW_TitleS);
        } else {
          hasEvent && input.remove(InputIds.SET_SHOW_TitleS);
        }
        data.useDynamicTitle = value;
      }
    }
  }
];

export default DynamicTitleEditor;