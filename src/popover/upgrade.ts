import { Data } from './constants';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle('.ant-popover-arrow-content, .ant-popover-inner .ant-popover-inner-content', { ...data.style });
    data.style = {};
  }
  return true;
}