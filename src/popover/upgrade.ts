import { Data } from './constants';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, id, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle(`.{id} .ant-popover-arrow-content, .{id} .ant-popover-inner .ant-popover-inner-content`, { ...data.style });
    data.style = {};
  }

  const _titleComplete = output.get('_titleComplete')
  if(!_titleComplete) {
    output.add('_titleComplete', '完成', {type: 'any'})
    input.get('_title').setRels(['_titleComplete'])
  }

  const contentComplete = output.get('contentComplete')
  if(!contentComplete) {
    output.add('contentComplete', '完成', {type: 'any'})
    input.get('content').setRels(['contentComplete'])
  }

  return true;
}