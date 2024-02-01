import { Data } from './constants';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, id, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle(`.{id} .ant-popover-arrow-content, .{id} .ant-popover-inner .ant-popover-inner-content`, { ...data.style });
    data.style = {};
  }

  const dynamicTitle = input.get('_title')
  if(dynamicTitle) {
    output.add('_titleComplete', '完成', {type: 'any'})
    dynamicTitle.setRels(['_titleComplete'])
  }
  
  const dynamicContent = input.get('content')
  if(dynamicContent) {
    output.add('contentComplete', '完成', {type: 'any'})
    dynamicContent.setRels(['contentComplete'])
  }

  return true;
}