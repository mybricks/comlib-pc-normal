import visibleOpt from '../../../components/editorRender/visibleOpt';
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
        editable: false,
        customOptRender: visibleOpt,
        getTitle: (item: IColumn) => {
          const path = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
          if (item.visible) {
            return `${item.title}(${path})`;
          } else {
            return `【隐藏】${item.title}(${path})`;
          }
        },
        onAdd: () => {
          return getNewColumn();
        }
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return [...data.columns];
        },
        set({ data, output, input, slot, ...res }: EditorResult<Data>, val: IColumn[]) {
          setColumns({ data, slot }, val);
          setDataSchema({ data, output, input, slot, ...res });
        }
      }
    }
  ]
};

export default addColumnEditor;
