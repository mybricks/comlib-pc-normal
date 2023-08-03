import Tree from '../../../components/editorRender/fieldSelect';
import { InputIds } from '../../constants';
import { Data } from '../../types';

const RowKeyEditor = [
  {
    title: '行标识字段',
    description: '勾选标识所对应的行数据，需要全局唯一',
    type: 'editorRender',
    options: {
      render: Tree
    },
    value: {
      get({ data, input }: EditorResult<Data>) {
        return {
          value: data.rowKey || '',
          schema: input.get(InputIds.SET_DATA_SOURCE).schema || {},
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
