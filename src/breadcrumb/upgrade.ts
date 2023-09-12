import { Data } from './constants';
import { isEmptyObject, differObject } from '../utils';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.0 -> v1.0.1, 字体颜色改造
  */
 const defaultStyle = {
    fontSize: '14px',
    fontStyle: 'normal',
    lineHeight: '14px',
    color: 'rgba(0,0,0,.45)'
 }
  data.children.forEach((item) => {
    if(item.style && !isEmptyObject(item.style)){
      const obj = differObject(item.style, defaultStyle);
      if(!isEmptyObject(obj)){
        setDeclaredStyle(`.${item.key}`, obj);
      }
    }
    item.style = {}
  })
  
  return true;
}