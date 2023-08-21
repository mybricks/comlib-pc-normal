import { Data } from './constants';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, id, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle(`.${id} .ant-popover-arrow-content, .${id} .ant-popover-inner .ant-popover-inner-content`, { ...data.style });
    data.style = {};
  }
  return true;
}