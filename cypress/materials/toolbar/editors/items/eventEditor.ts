import { OutputIds } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const EventEditor = [
  {
    title: '事件',
    items: [
      {
        title: '单击',
        type: '_Event',
        options: ({ data, focusArea }: EditorResult<Data>) => {
          const { item } = getBtnItemInfo(data, focusArea);
          return {
            outputId: item.key
          };
        }
      },
      {
        title: '双击',
        type: '_Event',
        options: ({ data, focusArea }: EditorResult<Data>) => {
          const { item } = getBtnItemInfo(data, focusArea);
          return {
            outputId: `${OutputIds.DoubleClick}_${item.key}`
          };
        }
      }
    ]
  }
];

export default EventEditor;
