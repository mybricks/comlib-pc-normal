import { Data } from './constants';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.0 -> v1.0.1, 字体颜色改造
  */
  data.children.forEach((item) => {
    setDeclaredStyle(`.${item.key}`, item.style);
  })
  
  return true;
}