import { Data } from './types';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, setDeclaredStyle, id }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle(`.{id} .ant-tooltip-arrow-content, .{id} .ant-tooltip-inner`, { ...data.style });
    data.style = {};
  }

  const contentComplete = output.get('contentComplete')
  if(!contentComplete) {
    output.add('contentComplete', '完成', {type: 'any'})
    input.get('content').setRels(['contentComplete'])
  }

  return true;
}