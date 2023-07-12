import { OutputIds, QueryMap } from './constants';
import { getSchema } from './util';
import { Data } from './type';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const abilitySet = data.domainModel?.query?.abilitySet;

  /**
   * @description v1.0.6, 各项操作增加成功/失败关联输出
   */
  const queryThenPin = output.get(OutputIds.QUERY.THEN);
  const insertThenPin = output.get(OutputIds.INSERT.THEN);
  const editThenPin = output.get(OutputIds.EDIT.THEN);
  const deleteThenPin = output.get(OutputIds.DELETE.THEN);
  const pageChangeThenPin = output.get(OutputIds.PAGE_CHANGE.THEN);

  const queryCatchPin = output.get(OutputIds.QUERY.CATCH);
  const insertCatchPin = output.get(OutputIds.INSERT.CATCH);
  const editCatchPin = output.get(OutputIds.EDIT.CATCH);
  const deleteCatchPin = output.get(OutputIds.DELETE.CATCH);
  const pageChangeCatchPin = output.get(OutputIds.PAGE_CHANGE.CATCH);

  if (!queryThenPin) {
    output.add({
      id: OutputIds.QUERY.THEN,
      title: '成功',
      schema: getSchema(data, [QueryMap.QUERY, OutputIds.QUERY.THEN], abilitySet.includes('PAGE')
        ? {
          pageNum: {
            title: '页码',
            type: 'number'
          },
          total: {
            title: '数据总数',
            type: 'number'
          }
        }
        : {})
    });
  }
  if (!queryCatchPin) {
    output.add({
      id: OutputIds.QUERY.CATCH,
      title: '失败',
      schema: getSchema(data, [QueryMap.QUERY, QueryMap.CATCH])
    });
  }
  try {
    input.get('query').setRels([OutputIds.QUERY.THEN, OutputIds.QUERY.CATCH]);
  } catch {
    console.error('input: query 不存在！');
  }

  if (abilitySet.includes('INSERT')) {
    if (!insertThenPin) {
      output.add({
        id: OutputIds.INSERT.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.INSERT, QueryMap.THEN])
      });
    }
    if (!insertCatchPin) {
      output.add({
        id: OutputIds.INSERT.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.INSERT, QueryMap.CATCH])
      });
    }
    try {
      input.get('create').setRels([OutputIds.INSERT.THEN, OutputIds.INSERT.CATCH]);
    } catch {
      console.error('input: create 不存在！');
    }
  }

  if (abilitySet.includes('UPDATE')) {
    if (!editThenPin) {
      output.add({
        id: OutputIds.EDIT.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.EDIT, QueryMap.THEN])
      });
    }
    if (!editCatchPin) {
      output.add({
        id: OutputIds.EDIT.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.EDIT, QueryMap.CATCH])
      });
    }
    try {
      input.get('editById').setRels([OutputIds.EDIT.THEN, OutputIds.EDIT.CATCH]);
    } catch {
      console.error('input: editById 不存在！');
    }
  }

  if (abilitySet.includes('DELETE')) {
    if (!deleteThenPin) {
      output.add({
        id: OutputIds.DELETE.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.DELETE, QueryMap.THEN])
      });
    }
    if (!deleteCatchPin) {
      output.add({
        id: OutputIds.DELETE.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.DELETE, QueryMap.CATCH])
      });
    }
    try {
      input.get('deleteById').setRels([OutputIds.DELETE.THEN, OutputIds.DELETE.CATCH]);
    } catch {
      console.error('input: deleteById 不存在！');
    }
  }

  if (abilitySet.includes('PAGE')) {
    if (!pageChangeThenPin) {
      output.add({
        id: OutputIds.PAGE_CHANGE.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.QUERY, OutputIds.QUERY.THEN], {
          pageNum: {
            title: '页码',
            type: 'number'
          },
          total: {
            title: '数据总数',
            type: 'number'
          }
        })
      });
    }
    if (!pageChangeCatchPin) {
      output.add({
        id: OutputIds.PAGE_CHANGE.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.QUERY, QueryMap.CATCH])
      });
    }
    try {
      input.get('pageChange').setRels([OutputIds.PAGE_CHANGE.THEN, OutputIds.PAGE_CHANGE.CATCH]);
    } catch {
      console.error('input: pageChange 不存在！');
    }
  }
  //=========== v1.0.6 end ===============

  return true;
}