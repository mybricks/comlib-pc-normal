import { getTableSchema } from '../../schema';
import Tree from '../../../components/editorRender/fieldSelect';
import { Data, IColumn } from '../../types';
import { DefaultRowKeyKey } from '../../constants';

const RowKeyEditor = [
  {
    title: '行标识字段',
    description:
      '当表格数据太大导致卡顿时，可以通过添加【行标识字段】进行性能优化。该标识字段的值需要全局唯一。此外也可以当作设置勾选数据时的标识',
    type: 'editorRender',
    ifVisible(item: IColumn) {
      return !item?.key || item?.key === DefaultRowKeyKey;
    },
    options: {
      render: Tree
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return {
          value: data.rowKey || '',
          schema: {
            type: 'object',
            properties: getTableSchema({ data }) || {}
          },
          placeholder: '默认使用随机生成的内置标识'
        };
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.rowKey = value || undefined;
      }
    }
  }
];
export default RowKeyEditor;
