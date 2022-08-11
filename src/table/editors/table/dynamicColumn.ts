import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const dynamicColumnEditor = [
  {
    title: '动态设置显示列',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useDynamicColumn;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SET_DYNAMIC_COL);
        if (value) {
          !hasEvent &&
            input.add(
              InputIds.SET_DYNAMIC_COL,
              `设置显示列`,
              Schemas.DYNAMIC_COL
            );
        } else {
          hasEvent && input.remove(InputIds.SET_DYNAMIC_COL);
        }
        data.useDynamicColumn = value;
      }
    }
  }
];

export { dynamicColumnEditor };
