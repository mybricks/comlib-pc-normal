import { OutputIds, InputIds } from '../../components/Paginator/constants';
import { Data } from '../../types';
import { setDataSchema } from '../../schema';

const PageSchema = {
  type: 'object',
  properties: {
    pageNum: {
      type: 'number'
    }
    // pageSize: {
    //   type: 'number'
    // }
  }
};
export default [
  {
    title: '开启分页',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.usePagination;
      },
      set({ data, input, output, ...res }: EditorResult<Data>, value: boolean) {
        data.usePagination = value;
        if (value) {
          input.add(InputIds.SetTotal, '设置数据总数', { type: 'number' });
          input.add(InputIds.SetPageNum, '设置当前页码', { type: 'number' });
          input.add(InputIds.GetPageInfo, '获取分页数据', { type: 'any' });
          output.add(OutputIds.GetPageInfo, '分页数据', PageSchema);
          input.get(InputIds.GetPageInfo).setRels([OutputIds.GetPageInfo]);
          output.add(OutputIds.PageChange, '点击分页', PageSchema);
        } else {
          input.remove(InputIds.SetTotal);
          input.remove(InputIds.SetPageNum);
          input.remove(InputIds.GetPageInfo);
          output.remove(InputIds.GetPageInfo);
          output.remove(OutputIds.PageChange);
        }
        setDataSchema({ data, input, output, ...res });
      }
    }
  }
];
