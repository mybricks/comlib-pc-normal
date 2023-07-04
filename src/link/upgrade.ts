import { Data } from './constants';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
     * @description v1.0.1 -> v1.0.2, 兼容之前默认和激活态颜色自定义
  */
  if(data.style){
    setDeclaredStyle(`.linkWrapper`, data.style);
  }
  if(data.hoverStyle){
    setDeclaredStyle(`.linkWrapperHover:hover`, data.hoverStyle);
  }
  
  return true;
}