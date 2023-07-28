import Tree from '../../../components/editorRender/fieldSelect';
import { Data } from '../../types';
import { getColumnsSchema } from '../../utils';

const RowKeyEditor = [
  {
    title: '行标识字段',
    description: '勾选标识所对应的行数据，需要全局唯一',
    type: 'editorRender',
    options: {
      render: Tree
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return {
          value: data.rowKey || undefined,
          schema: getColumnsSchema(data),
          placeholder: '默认使用随机生成的内置标识'
        };
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.rowKey = value || undefined;
      }
    }
  },
];
export default RowKeyEditor;
