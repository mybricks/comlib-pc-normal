import { InputIds, OutputIds } from './constants';

export default function ({ input, output, slot, data }): boolean {
  // 补全 output => SetPageNumDone
  if (!output.get(OutputIds.SetPageNumDone)) {
    output.add(OutputIds.SetPageNumDone, '当前页码', {
      type: 'number'
    });
  }

  // 补全 rels => setPageNum-setPageNumDone
  if (
    output.get(OutputIds.SetPageNumDone) &&
    input.get(InputIds.SetPageNum) &&
    !input.get(InputIds.SetPageNum)?.rels?.includes(OutputIds.SetPageNumDone)
  ) {
    input.get(InputIds.SetPageNum).setRels([OutputIds.SetPageNumDone]);
  }

  // 补全 output => SetTotalDone
  if (!output.get(OutputIds.SetTotalDone)) {
    output.add(OutputIds.SetTotalDone, '数据总数', {
      type: 'number'
    });
  }

  // 补全 rels => setTotal-setTotalDone
  if (
    output.get(OutputIds.SetTotalDone) &&
    input.get(InputIds.SetTotal) &&
    !input.get(InputIds.SetTotal)?.rels?.includes(OutputIds.SetTotalDone)
  ) {
    input.get(InputIds.SetTotal).setRels([OutputIds.SetTotalDone]);
  }


  if (input.get(InputIds.SetDisable) && !output.get(`${InputIds.SetDisable}Done`)) {
    output.add(`${InputIds.SetDisable}Done`, '禁用完成', { type: 'follow' });
    input.get(InputIds.SetDisable).setRels([`${InputIds.SetDisable}Done`]);
  }
  if (input.get(InputIds.SetEnable) && !output.get(`${InputIds.SetEnable}Done`)) {
    output.add(`${InputIds.SetEnable}Done`, '启用完成', { type: 'follow' });
    input.get(InputIds.SetEnable).setRels([`${InputIds.SetEnable}Done`]);
  }
  // ======================== 1.0.12 end ========================

  return true;
}
