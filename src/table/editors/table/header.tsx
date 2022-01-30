import { uuid } from '../../../utils';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const headerEditor = {
  title: '头部设置',
  items: [
    {
      title: '显示表头',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.showHeader === false ? false : true;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.showHeader = value;
        }
      }
    },
    {
      title: '显示标题',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useTableTitle;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useTableTitle = value;
        }
      }
    },
    {
      title: '显示总数',
      type: 'switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.useTableTitle;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useTableTitleWithCount;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useTableTitleWithCount = value;
        }
      }
    },
    {
      title: '显示操作',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useActionBtns;
        },
        set({ data, output }: EditorResult<Data>, value: boolean) {
          data.useActionBtns = value;
          data.actionBtns = data.actionBtns ? data.actionBtns : [];
          if (value) {
            if (data.actionBtns.length <= 0) {
              const id = uuid();
              const title = `按钮${data.actionBtns?.length}`;
              data.actionBtns?.push({
                id,
                title,
                type: 'primary',
                showText: true
              });
            }
            data.actionBtns.forEach((item) => {
              output.add(item.id, item.title, Schemas.HEADER_BTN_CLICK(data));
            });
          }
          if (!value) {
            data.actionBtns.forEach((item) => {
              output.remove(item.id);
            });
          }
        }
      }
    },
    {
      title: '插槽',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useHeaderSlot;
        },
        set({ data, slot }: EditorResult<Data>, value: boolean) {
          data.headerSlotId = 'headerSlot';
          if (value) {
            slot.add('headerSlot', '头部内容');
          } else {
            slot.remove('headerSlot');
          }
          data.useHeaderSlot = value;
        }
      }
    }
  ]
};

export default headerEditor;
