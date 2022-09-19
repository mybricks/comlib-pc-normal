import visibleOpt from '../../../components/editorRender/visibleOpt';
import { setDataSchema } from '../../schema';
import { Data, IColumn, TableLayoutEnum, WidthTypeEnum } from '../../types';
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
      title: '列宽分配',
      type: 'Select',
      options: [
        { label: '固定列宽(不自动适配)', value: TableLayoutEnum.FixedWidth },
        { label: '按比例分配多余宽度', value: TableLayoutEnum.Fixed },
        { label: '按比例适配（无横向滚动条）', value: TableLayoutEnum.Auto }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.tableLayout || TableLayoutEnum.Fixed;
        },
        set({ data }: EditorResult<Data>, value: TableLayoutEnum) {
          data.tableLayout = value;
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
            return `【${item.width === WidthTypeEnum.Auto ? '自适应' : `${item.width}px`}】${
              item.title
            }(${path})`;
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
