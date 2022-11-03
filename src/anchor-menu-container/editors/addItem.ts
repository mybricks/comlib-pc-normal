import { uuid } from '../../utils';
import { Data } from '../constants';

const getNewSlotItem = () => {
  const key = uuid();
  return { slotId: key, title: '新菜单项', key };
};

export default [
  {
    type: 'Array',
    options: {
      editable: false,
      getTitle: (item) => {
        return item.title;
      },
      onAdd: () => {
        return getNewSlotItem();
      }
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.slotList;
      },
      set({ data, slot }: EditorResult<Data>, newSlotList) {
        data.slotList.forEach((item) => {
          // 判断是否删除
          if (
            !newSlotList?.find?.((temp) => temp.slotId === item.slotId && slot.get(item.slotId))
          ) {
            slot.remove(item.slotId);
          }
        });
        data.slotList = [...newSlotList];
        const firstItem = data.slotList[0];
        data.slotList.forEach((item) => {
          if (!slot.get(item.slotId)) {
            slot.add({
              id: item.slotId,
              title: `${item.title}内容`
            });
          }
          if (!item.activeStyle) {
            item.activeStyle = {
              ...firstItem.activeStyle
            };
          }
          if (!item.style) {
            item.style = {
              ...firstItem.style
            };
          }
        });
      }
    }
  }
];
