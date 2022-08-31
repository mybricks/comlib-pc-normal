import { setDataSchema } from '../../schema';
import { Data, IColumn } from '../../types';
import { getNewColumn, setColumns } from '../../utils';

const addColumnEditor = {
  title: '列',
  folded: true,
  items: [
    {
      title: '显示列头',
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
      title: '',
      type: 'array',
      options: {
        addText: '添加列',
        getTitle: (item: IColumn) => {
          if (item.visible) {
            return `${item.title}(${item.dataIndex})`;
          } else {
            return `【隐藏】${item.title}(${item.dataIndex})`;
          }
        },
        onAdd: () => {
          return getNewColumn();
        },
        items: [
          {
            title: '显示',
            type: 'switch',
            value: 'visible'
          }
        ]
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return [...data.columns];
        },
        set({ data, output, input, slot }: EditorResult<Data>, val: IColumn[]) {
          setColumns({ data, output, slot }, val);
          setDataSchema({ data, output, input });
        }
      }
    }
  ]
};

export default addColumnEditor;
