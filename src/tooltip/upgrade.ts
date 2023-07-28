import { Data } from './types';
import { isEmptyObject } from '../utils'

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if(!isEmptyObject(data.style)){
    setDeclaredStyle('.ant-tooltip-arrow-content, .ant-tooltip-inner', { ...data.style });
    data.style = {};
  }
  return true;
}