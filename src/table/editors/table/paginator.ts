import { OutputIds, InputIds } from '../../components/Paginator/constants';
import { Data } from '../../types';
import { setDataSchema } from '../../schema';

export const PageSchema = {
  type: 'object',
  properties: {
    pageNum: {
      type: 'number'
    },
    pageSize: {
      type: 'number'
    }
  }
};
export default [
  {
    title: '分页模式',
    type: 'Switch',
    ifVisible({ data }: EditorResult<Data>) {
      return !data?.domainModel?.entity;
    },
    value: {
      get({ data, input, output }: EditorResult<Data>) {
        return data.usePagination;
      },
      set({ data, input, output, ...res }: EditorResult<Data>, value: boolean) {
        data.usePagination = value;
        if (value) {
          input.add(InputIds.SetTotal, '设置数据总数', { type: 'number' });
          output.add(InputIds.SetTotal, '设置数据总数完成', { type: 'number' });
          input.get(InputIds.SetTotal).setRels([OutputIds.SetTotal]);
          input.add(InputIds.SetPageNum, '设置当前页码', { type: 'number' });
          output.add(OutputIds.SetPageNumFinish, '设置页码完成', { type: 'number' });
          input.get(InputIds.SetPageNum).setRels([OutputIds.SetPageNumFinish]);
          input.add(InputIds.GetPageInfo, '获取分页数据', { type: 'any' });
          output.add(OutputIds.GetPageInfo, '分页数据', PageSchema);
          input.get(InputIds.GetPageInfo).setRels([OutputIds.GetPageInfo]);
          output.add(OutputIds.PageChange, '点击分页', PageSchema);
        } else {
          input.remove(InputIds.SetTotal);
          output.remove(OutputIds.SetTotal);
          input.remove(InputIds.SetPageNum);
          output.remove(OutputIds.SetPageNumFinish);
          input.remove(InputIds.GetPageInfo);
          output.remove(InputIds.GetPageInfo);
          output.remove(OutputIds.PageChange);
        }
        setDataSchema({ data, input, output, ...res });
      }
    }
  }
];
