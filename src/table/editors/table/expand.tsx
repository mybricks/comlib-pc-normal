import { InputIds, SlotIds } from '../../constants';
import { Data } from '../../types';
import { Schemas, setDataSchema } from '../../schema';

const expandEditor = [
  {
    title: '表格行展开',
    items: [
      {
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useExpand;
          },
          set({ data, slot, ...res }: EditorResult<Data>, value: boolean) {
            if (value) {
              slot.add({ id: SlotIds.EXPAND_CONTENT, title: `展开内容`, type: 'scope' });
              slot
                .get(SlotIds.EXPAND_CONTENT)
                .inputs.add(InputIds.EXP_COL_VALUES, '当前行数据', Schemas.Object);
              slot
                .get(SlotIds.EXPAND_CONTENT)
                .inputs.add(InputIds.INDEX, '当前行序号', Schemas.Number);
              setDataSchema({ data, slot, ...res });
            } else {
              slot.remove(SlotIds.EXPAND_CONTENT);
            }
            data.useExpand = value;
          }
        }
      }
    ]
  }
];

export default expandEditor;
