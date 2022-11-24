import { Data, InputIds } from './constants';
import { BaseEditor } from './editors/baseEditor';
import { ItemsEditors } from './editors/item';
import { Schemas } from './editors/utils';

export default {
  '@init'({ data, input }: EditorResult<Data>) {
    input.add(InputIds.SetDataSource, '设置数据源', Schemas.SetDataSource(data));
    input.add(InputIds.SetTitle, '设置标题', { type: 'string' });
  },
  ':root': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor];

    return { title: '描述列表' };
  },
  ...ItemsEditors
};
